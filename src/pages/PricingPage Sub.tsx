import { useState, useMemo } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import PublicTopbar from '@/modules/PublicTopbar'
import PrivateTopbar from '@/modules/PrivateTopbar'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PricingPlan {
  name: string
  monthlyPrice: number
  yearlyPrice: number
  credits: string
  features: string[]
  actionLabel: string
  extraPricing?: string
  recommended?: boolean
  exclusive?: boolean
}

const plans: PricingPlan[] = [
  {
    name: 'Free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    credits: '150 Credits',
    features: ['Google Maps Search Data', '2 URL Google Maps Search'],
    actionLabel: 'Get Started',
  },
  {
    name: 'Basic',
    monthlyPrice: 19,
    yearlyPrice: 190,
    credits: '3,000 Credits per month',
    extraPricing: '$0.01 per additional credit',
    features: [
      'Everything in previous tier',
      '10 URL Google Maps Search',
      'Website Data Email Search',
      'Linkedin Profiles And Company',
    ],
    actionLabel: 'Choose Plan',
  },
  {
    name: 'Pro',
    monthlyPrice: 69,
    yearlyPrice: 690,
    credits: '15,000 Credits per month',
    extraPricing: '$0.007 per additional credit',
    features: [
      'Priority support',
      'Everything in previous tier',
    ],
    actionLabel: 'Choose Plan',
    recommended: true,
  },
  {
    name: 'Mega',
    monthlyPrice: 420,
    yearlyPrice: 4200,
    credits: '120,000 Credits per month',
    extraPricing: '$0.005 per additional credit',
    features: [
      'White glove help and support',
      'Everything in previous tier',
    ],
    actionLabel: 'Choose Plan',
    exclusive: true,
  },
]

export default function PricingPage() {
  const { currentUser, userData } = useAuth()

  // Determine current user's plan if available
  const userPlan = currentUser && userData ? userData.plan || 'Free' : 'Free'

  // State to track billing period (false = monthly, true = yearly)
  const [isYearly, setIsYearly] = useState<boolean>(false)

  const handlePricingPeriodChange = (value: string) => {
    setIsYearly(value === '1')
  }

  const billingPeriodText = isYearly ? 'year' : 'month'

  // Memoize processed plans to avoid redundant calculations
  const displayedPlans = useMemo(() => {
    return plans.map((plan) => {
      const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice
      const showSavings = isYearly && plan.monthlyPrice > 0 && plan.yearlyPrice > 0
      const savings = showSavings ? (plan.monthlyPrice * 12 - plan.yearlyPrice) : 0
      return { ...plan, price, showSavings, savings }
    })
  }, [isYearly])

  return (
    <div className="w-screen min-h-screen bg-white">
      {currentUser ? <PrivateTopbar /> : <PublicTopbar />}

      <div className="py-12 px-4 max-w-screen-lg mx-auto">
        {/* Heading Section */}
        <section className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900">Pricing Plans</h2>
          <p className="text-xl pt-1 text-gray-600">
            Choose the plan that&apos;s right for you
          </p>
          {currentUser && (
            <p className="mt-2 text-sm text-gray-500">
              You are currently on the {userPlan} plan
            </p>
          )}
        </section>

        {/* Tabs for Monthly/Yearly Switch */}
        <Tabs
          defaultValue="0"
          className="w-40 mx-auto mt-8"
          onValueChange={handlePricingPeriodChange}
          aria-label="Billing period toggle"
        >
          <TabsList className="py-6 px-2 flex justify-center space-x-2 border bg-gray-50 rounded-md">
            <TabsTrigger value="0" className="text-base">Monthly</TabsTrigger>
            <TabsTrigger value="1" className="text-base">Yearly</TabsTrigger>
          </TabsList>
        </Tabs>

        <p className="text-sm text-green-600 font-medium text-center mt-4">
          Discounted pricing available if billed yearly
        </p>

        {/* Plans Section */}
        <section className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-8 mt-12">
          {displayedPlans.map((plan) => (
            <PriceCard key={plan.name} plan={plan} isYearly={isYearly} billingPeriodText={billingPeriodText} />
          ))}
        </section>
      </div>
    </div>
  )
}

interface PriceCardProps {
  plan: PricingPlan & {
    price: number
    showSavings: boolean
    savings: number
  }
  isYearly: boolean
  billingPeriodText: string
}

function PriceCard({ plan, isYearly, billingPeriodText }: PriceCardProps) {
  console.log(isYearly);
  return (
    <Card
      className={cn(
        "w-72 flex flex-col justify-between py-2 mx-auto sm:mx-0 border transition-shadow hover:shadow-lg focus-within:ring-2 focus-within:ring-indigo-400",
        plan.recommended ? "border-rose-400" : "border-zinc-200",
        plan.exclusive ? "animate-background-shine bg-white dark:bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%]" : ""
      )}
      aria-label={`${plan.name} plan`}
    >
      <CardHeader className="pb-8 pt-4 space-y-2">
        {plan.showSavings ? (
          <div className="flex justify-between items-start">
            <CardTitle className="text-zinc-700 dark:text-zinc-300 text-lg font-bold">
              {plan.name}
            </CardTitle>
            <div
              className={cn(
                "px-2.5 rounded-xl h-fit text-sm py-1 bg-zinc-200 text-black dark:bg-zinc-800 dark:text-white font-medium",
                plan.recommended ? "bg-gradient-to-r from-orange-400 to-rose-400 dark:text-black" : ""
              )}
            >
              Save ${plan.savings}
            </div>
          </div>
        ) : (
          <CardTitle className="text-zinc-700 dark:text-zinc-300 text-lg font-bold">
            {plan.name}
          </CardTitle>
        )}

        <div className="flex items-end gap-1 mt-2">
          {plan.price > 0 ? (
            <>
              <h3 className="text-3xl font-extrabold">${plan.price}</h3>
              <span className="text-sm text-gray-600">
                /{billingPeriodText}
              </span>
            </>
          ) : (
            <h3 className="text-3xl font-extrabold">Free</h3>
          )}
        </div>
        <CardDescription className="pt-1.5 h-12 text-gray-600">
          {plan.credits}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        {plan.extraPricing && (
          <p className="text-sm text-gray-500 mb-2">{plan.extraPricing}</p>
        )}
        {plan.features.map((feature) => (
          <CheckItem key={feature} text={feature} />
        ))}
      </CardContent>

      <CardFooter className="mt-2">
        <Button
          className="relative inline-flex w-full items-center justify-center rounded-md bg-black text-white dark:bg-white dark:text-black px-6 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
          aria-label={`Select the ${plan.name} plan`}
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
      <p className="pt-0.5 text-zinc-700 dark:text-zinc-300 text-sm">{text}</p>
    </div>
  )
}
