'use client';

import { Suspense, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

const PLANS = [
  {
    id: 'pro_monthly',
    name: 'Pro Monthly',
    price: '$9',
    period: '/month',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY || '',
    features: [
      'Unlimited tool comparisons',
      'Advanced filters',
      'Priority support',
      'Pro badge on profile',
    ],
  },
  {
    id: 'pro_yearly',
    name: 'Pro Yearly',
    price: '$89',
    period: '/year',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY || '',
    features: [
      'Everything in Pro Monthly',
      'Save $19 vs monthly',
      'Early access to new features',
      'Exclusive newsletter content',
    ],
    popular: true,
  },
];

function SubscriptionContent() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  const success = searchParams.get('success');
  const cancelled = searchParams.get('cancelled');

  async function handleSubscribe(priceId: string) {
    if (!priceId) {
      alert('Price not configured. Please set Stripe price IDs.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/stripe/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Failed to create checkout session');
      }
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Sign in required</h1>
          <p className="mt-2 text-muted-foreground">
            Please sign in to subscribe to Pro
          </p>
        </div>
      </div>
    );
  }

  const user = session.user;
  const isPro = (user as any)?.subscriptionStatus === 'active';

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <a href="/" className="flex items-center gap-2 font-bold text-xl">
            IndieTools.ai
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Success/Cancelled banners */}
        {success && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">
            ✅ Subscription activated! Welcome to Pro.
          </div>
        )}
        {cancelled && (
          <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-800">
            ⚠️ Checkout cancelled. No charges were made.
          </div>
        )}

        {/* Current status */}
        {isPro && (
          <div className="mb-8 rounded-lg border border-indigo-200 bg-indigo-50 p-6 text-center">
            <h2 className="text-xl font-semibold text-indigo-900">✨ You&apos;re already a Pro member</h2>
            <p className="mt-1 text-indigo-700">Thank you for supporting IndieTools.ai!</p>
            <a
              href="/api/stripe/portal"
              className="mt-4 inline-block rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Manage Subscription →
            </a>
          </div>
        )}

        {/* Plans */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold">Upgrade to Pro</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Get unlimited access to advanced features
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl border p-8 ${
                plan.popular
                  ? 'border-indigo-600 shadow-lg ring-1 ring-indigo-600'
                  : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-1 text-xs font-medium text-white">
                  Most Popular
                </span>
              )}
              <div className="text-center">
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                <div className="mt-4 flex items-baseline justify-center">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-1">{plan.period}</span>
                </div>
              </div>
              <ul className="mt-8 space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSubscribe(plan.priceId)}
                disabled={loading || !plan.priceId}
                className={`mt-8 w-full rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${
                  plan.popular
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-gray-100 hover:bg-gray-200'
                } disabled:opacity-50`}
              >
                {!plan.priceId
                  ? 'Not configured'
                  : loading
                  ? 'Redirecting...'
                  : `Subscribe ${plan.period}`}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
          <div className="mt-8 grid gap-8 text-left md:grid-cols-2">
            <div>
              <h3 className="font-semibold">Can I cancel anytime?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Yes, you can cancel your subscription at any time. You&apos;ll retain access until the end of your billing period.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">What payment methods do you accept?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                We accept all major credit cards (Visa, Mastercard, Amex) via Stripe.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Is there a free trial?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Currently we don&apos;t offer a free trial, but you can cancel within 7 days for a full refund.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">What&apos;s included in Pro?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Pro gives you unlimited tool comparisons, access to advanced filters, priority support, and a Pro badge on your profile.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 mt-auto">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:px-6 md:flex-row">
          <span className="font-semibold">IndieTools.ai</span>
          <p className="text-sm text-muted-foreground">
            © 2024 IndieTools.ai. Built for indie developers.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function SubscriptionPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><p>Loading...</p></div>}>
      <SubscriptionContent />
    </Suspense>
  );
}