import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';

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
  const uid = userData?.uid; // Use uid from auth context
  const isBuyer = userData?.isBuyer; // Assuming this is available in userData.

  const [selectedPlan, setSelectedPlan] = useState<OneTimePlan | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentURL, setPaymentURL] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      try {
        const { type, payload } = event.data || {};
        console.log('[Frontend] Received event from iframe:', event.data);
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
    console.log('[Frontend] User clicked Buy Now for plan:', plan.name);
    const chosenPlan = plan; // store locally
    setSelectedPlan(plan);

    if (!accessToken || !uid) {
      console.error('[Frontend] No accessToken or uid found. User may not be logged in.');
      alert('You must be logged in to make a purchase.');
      return;
    }

    if (!isBuyer) {
      // If user is not a buyer, create/update buyer and show modal
      await createOrUpdateBuyerAndShowModal();
    } else {
      // If user is a buyer, try to purchase immediately with chosenPlan
      const purchaseSuccess = await commitPurchase(chosenPlan);
      if (!purchaseSuccess) {
        // If purchase failed, call create-buyer again to get payment method embed
        await createOrUpdateBuyerAndShowModal();
      }
    }
  }

  async function createOrUpdateBuyerAndShowModal() {
    if (!accessToken || !uid) return;
    setLoading(true);
    try {
      console.log('[Frontend] Calling create-buyer endpoint...');
      const buyerResp = await axios.post(`${API_BASE_URL}/transactions/create-buyer`,
        { uid },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('[Frontend] Buyer creation/update response:', buyerResp.data);
      const { buyer } = buyerResp.data;
      const paymentMethodURL = buyer.payment_method_embed_url;
      setPaymentURL(paymentMethodURL);
      setShowPaymentModal(true);
    } catch (error: any) {
      console.error('[Frontend] Error creating/updating buyer:', error.response ? error.response.data : error.message);
      alert('Error setting up payment method. Please try again.');
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
      console.error('[Frontend] No accessToken or uid found. User may not be logged in.');
      alert('You must be logged in to make a purchase.');
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

    console.log('[Frontend] Committing purchase for plan:', plan.name);
    setLoading(true);

    try {
      const purchaseResp = await axios.post(`${API_BASE_URL}/transactions/purchase`,
        { uid, items },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('[Frontend] Purchase response:', purchaseResp.data);
      alert('Purchase completed successfully!');
      setShowPaymentModal(false);
      return true;
    } catch (error: any) {
      console.error('[Frontend] Error committing purchase:', error.response ? error.response.data : error.message);
      alert('Purchase failed. Please update your payment method and try again.');
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function handlePurchaseClick() {
    // User clicks "Purchase" button inside modal after updating payment method
    if (!selectedPlan) {
      console.error('[Frontend] No selectedPlan when user clicks Purchase.');
      return;
    }

    const success = await commitPurchase(selectedPlan);
    if (success) {
      setShowPaymentModal(false);
    }
  }

  return (
    <div className="w-screen min-h-screen bg-white text-gray-900">
      <div className="py-16 px-4 max-w-screen-lg mx-auto text-center">
        <h1 className="text-4xl font-extrabold">One-Time Credit Packs</h1>
        <p className="text-lg text-gray-600 mt-2">
          Purchase credits once and use them whenever you like.
        </p>

        <section className="flex flex-col md:flex-row justify-center gap-8 mt-12">
          {plans.map((plan) => (
            <PriceCard key={plan.name} plan={plan} onBuyNow={() => handleBuyNow(plan)} />
          ))}
        </section>
      </div>

      {showPaymentModal && paymentURL && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-md shadow-lg max-w-lg w-full relative">
            <h2 className="text-xl font-bold mb-2">Payment Method</h2>
            <p className="text-gray-700 mb-4">
              Update or set your payment details, then click "Purchase" to finalize your order.
            </p>
            <iframe
              ref={iframeRef}
              src={paymentURL}
              className="w-full border"
              style={{ height: '600px' }}
              onLoad={() => console.log('[Frontend] Payment iframe loaded')}
            ></iframe>
            <div className="flex items-center justify-end mt-4 gap-4">
              <Button
                variant="ghost"
                onClick={() => {
                  console.log('[Frontend] User closed payment modal');
                  setShowPaymentModal(false);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handlePurchaseClick}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Purchase'}
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
}

function PriceCard({ plan, onBuyNow }: PriceCardProps) {
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
        >
          <div className="absolute -inset-0.5 -z-10 rounded-lg bg-gradient-to-b from-[#c7d2fe] to-[#8678f9] opacity-75 blur" />
          {plan.actionLabel}
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
