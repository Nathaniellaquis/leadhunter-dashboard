import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/hooks/use-toast'; // Make sure this path matches your project structure

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

interface OneTimePlan {
  name: string
  price: number
  credits: string
  features: string[]
  actionLabel: string
  recommended?: boolean
}

const plans: OneTimePlan[] = [
  {
    name: 'Starter',
    price: 10,
    credits: '1,000 Credits',
    features: [
      'Basic data export',
      'Limited support',
    ],
    actionLabel: 'Buy Now',
  },
  {
    name: 'Growth',
    price: 50,
    credits: '6,000 Credits',
    features: [
      'Everything in Starter',
      'Enhanced support',
      'Extended data export',
    ],
    actionLabel: 'Buy Now',
    recommended: true,
  },
  {
    name: 'Ultimate',
    price: 200,
    credits: '30,000 Credits',
    features: [
      'Everything in Growth',
      'Priority support',
      'White-glove setup assistance',
    ],
    actionLabel: 'Buy Now',
  },
]

export default function OneTimePurchasePage() {
  const { accessToken, userData } = useAuth();
  const uid = userData?.uid; 
  const isBuyer = userData?.isBuyer;

  const [selectedPlan, setSelectedPlan] = useState<OneTimePlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [purchaseComplete, setPurchaseComplete] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [showCheckoutPage, setShowCheckoutPage] = useState(false);
  const [paymentURL, setPaymentURL] = useState<string | null>(null);
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);
  console.log(isUpdatingPayment);

  const { toast } = useToast();

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      try {
        const { type, payload } = event.data || {};
        if (type === 'resize' && payload?.height && iframeRef.current) {
          iframeRef.current.style.height = `${payload.height}px`;
        }
      } catch (error) {
        console.error('[Frontend] Error handling iframe message:', error);
      }
    }
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  async function handleBuyNow(plan: OneTimePlan) {
    if (loading) return;
    setSelectedPlan(plan);
    setPurchaseComplete(false);
    setLoading(true);

    if (!accessToken || !uid) {
      toast({
        title: "Error",
        description: "You must be logged in to make a purchase.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    if (isBuyer) {
      const purchaseSuccess = await commitPurchase(plan);
      if (!purchaseSuccess) {
        // If purchase fails, show checkout page with update mode
        await createOrUpdateBuyerAndShowCheckout(plan, false);
      }
    } else {
      // If not a buyer, go to add payment flow
      await createOrUpdateBuyerAndShowCheckout(plan, true);
    }

    setLoading(false);
  }

  async function createOrUpdateBuyerAndShowCheckout(plan: OneTimePlan, isFirstTime: boolean) {
    console.log(plan)
    if (!accessToken || !uid) return;
    setLoading(true);
    setPurchaseComplete(false);

    try {
      const buyerResp = await axios.post(`${API_BASE_URL}/transactions/create-buyer`,
        { uid },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const { buyer } = buyerResp.data;
      const headlineText = isFirstTime ? "Add Your Payment Method" : "Update Your Payment Method";
      const submitButtonText = isFirstTime ? "Add Payment" : "Update";
      setIsUpdatingPayment(!isFirstTime);

      const options = {
        font: "Poppins",
        backgroundColor: "#FFFFFF",
        textColor: "#272D36",
        secondaryTextColor: "#657C9D",
        errorColor: "#D7625E",
        buttonColor: "#080808",
        buttonLabelColor: "#FFFFFF",
        buttonBorderRadius: "6px",
        fieldBackgroundColor: "#F9F9F9",
        fieldBottomBorderColor: "#DEE3EB",
        fieldBorderRadius: "0px",
        fieldTextColor: "#080808",
        loaderColor: "#DEE3EB",
        headlineText,
        submitButtonText
      };

      const stringified = JSON.stringify(options);
      const encoded = btoa(stringified);
      const paymentMethodURL = `${buyer.payment_method_embed_url}?options=${encoded}`;

      setPaymentURL(paymentMethodURL);
      setShowCheckoutPage(true);
    } catch (error: any) {
      console.error('[Frontend] Error creating/updating buyer:', error.response ? error.response.data : error.message);
      toast({
        title: "Error",
        description: "Error setting up payment method. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  async function commitPurchase(plan: OneTimePlan): Promise<boolean> {
    if (!plan) {
      console.error('[Frontend] No plan provided to commitPurchase.');
      return false;
    }

    if (!accessToken || !uid) {
      toast({
        title: "Error",
        description: "You must be logged in to make a purchase.",
        variant: "destructive"
      });
      return false;
    }

    const amountInCents = plan.price * 100;
    const items = [
      {
        name: plan.name + ' Credits',
        description: plan.credits,
        amount_in_cents: amountInCents,
        quantity: 1,
      }
    ];

    setLoading(true);
    setPurchaseComplete(false);

    try {
      await axios.post(`${API_BASE_URL}/transactions/purchase`,
        { uid, items },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      toast({
        title: "Success",
        description: "Purchase completed successfully!",
      });
      setShowCheckoutPage(false);
      setPurchaseComplete(true);
      return true;
    } catch (error: any) {
      console.error('[Frontend] Error committing purchase:', error.response ? error.response.data : error.message);
      const errorMsg = error?.response?.data?.error || "Failed to commit purchase";
      toast({
        title: "Error",
        description: `Failed to commit purchase: ${errorMsg}`,
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function handleCompletePurchase() {
    if (loading) return;
    if (!selectedPlan) return;
    await commitPurchase(selectedPlan);
  }

  return (
    <div className="w-screen min-h-screen bg-white text-gray-900">
      {!showCheckoutPage && (
        <div className="py-16 px-4 max-w-screen-lg mx-auto text-center">
          <h1 className="text-4xl font-extrabold">One-Time Credit Packs</h1>
          <p className="text-lg text-gray-600 mt-2">
            Purchase credits once and use them whenever you like.
          </p>

          <section className="flex flex-col md:flex-row justify-center gap-8 mt-12">
            {plans.map((plan) => (
              <PriceCard 
                key={plan.name} 
                plan={plan} 
                onBuyNow={() => handleBuyNow(plan)} 
                loading={loading && selectedPlan?.name === plan.name} 
                purchaseComplete={purchaseComplete && selectedPlan?.name === plan.name} 
              />
            ))}
          </section>
        </div>
      )}

      {showCheckoutPage && paymentURL && selectedPlan && (
        <div className="max-w-screen-lg mx-auto py-10 px-4 relative">
          {/* Close button in top-right corner */}
          <button
            onClick={() => {
              setShowCheckoutPage(false);
              setSelectedPlan(null);
              setPurchaseComplete(false);
            }}
            className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full bg-black text-white"
            aria-label="Close checkout"
          >
            X
          </button>

          <h2 className="text-2xl font-bold mb-6">Checkout</h2>
          <div className="flex flex-col md:flex-row gap-10">
            {/* Payment Method Embed */}
            <div className="flex-1">
              {/* Removed "Payment Details" text as requested */}
              <iframe
                ref={iframeRef}
                src={paymentURL}
                className="w-full border"
                style={{ height: '600px' }}
                onLoad={() => console.log('[Frontend] Payment iframe loaded')}
              ></iframe>
            </div>

            {/* Order Summary */}
            <div className="md:w-80 bg-gray-50 p-4 rounded-md border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              <div className="flex justify-between mb-2">
                <span className="text-gray-700">{selectedPlan.name} Credits</span>
                <span className="text-gray-900 font-bold">${selectedPlan.price}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-700">{selectedPlan.credits}</span>
                <span className="text-gray-700">One-time</span>
              </div>
              <hr className="my-4" />
              <Button
                variant="default"
                onClick={handleCompletePurchase}
                disabled={loading || purchaseComplete}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : purchaseComplete ? (
                  "Success!"
                ) : (
                  "Complete Purchase"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface PriceCardProps {
  plan: OneTimePlan
  onBuyNow: () => void
  loading: boolean
  purchaseComplete: boolean
}

function PriceCard({ plan, onBuyNow, loading, purchaseComplete }: PriceCardProps) {
  return (
    <Card
      className={cn(
        "w-72 flex flex-col justify-between py-2 mx-auto md:mx-0 border transition-shadow hover:shadow-lg focus-within:ring-2 focus-within:ring-indigo-400",
        plan.recommended ? "border-indigo-400" : "border-gray-200"
      )}
      aria-label={`${plan.name} plan`}
    >
      <CardHeader className="pb-6 pt-4 space-y-2">
        <CardTitle className="text-gray-800 text-lg font-bold">
          {plan.name}
        </CardTitle>
        <div className="flex items-end gap-1 mt-2">
          <h3 className="text-3xl font-extrabold">${plan.price}</h3>
          <span className="text-sm text-gray-500">one-time</span>
        </div>
        <CardDescription className="pt-1.5 text-gray-600">
          {plan.credits}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        {plan.features.map((feature) => (
          <CheckItem key={feature} text={feature} />
        ))}
      </CardContent>

      <CardFooter className="mt-4">
        <Button
          className="relative inline-flex w-full items-center justify-center rounded-md bg-black text-white dark:bg-white dark:text-black px-6 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
          aria-label={`Select the ${plan.name} plan`}
          onClick={onBuyNow}
          disabled={loading || purchaseComplete}
        >
          <div className="absolute -inset-0.5 -z-10 rounded-lg bg-gradient-to-b from-[#c7d2fe] to-[#8678f9] opacity-75 blur" />
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : purchaseComplete ? (
            "Success!"
          ) : (
            plan.actionLabel
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

function CheckItem({ text }: { text: string }) {
  return (
    <div className="flex gap-2 items-start">
      <CheckCircle2 size={18} className="text-green-400 mt-0.5" aria-hidden="true" />
      <p className="pt-0.5 text-gray-700 text-sm">{text}</p>
    </div>
  )
}
