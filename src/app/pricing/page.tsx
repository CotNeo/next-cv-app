'use client';

import Link from 'next/link';

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for trying out our service',
    features: [
      '1 free CV creation',
      'Basic templates',
      'PDF export',
      'Email support',
      'Basic ATS optimization',
    ],
    buttonText: 'Get Started',
    buttonLink: '/auth/register',
    popular: false,
  },
  {
    name: 'Pay-as-you-go',
    price: '$0.50',
    description: 'Pay only for what you need',
    features: [
      'All templates',
      'Unlimited CVs',
      'PDF export',
      'Email support',
      'Advanced ATS optimization',
      'AI-powered suggestions',
      'Custom branding',
    ],
    buttonText: 'Start Creating',
    buttonLink: '/auth/register',
    popular: false,
  },
  {
    name: 'Monthly',
    price: '$3',
    description: 'Best for regular users',
    features: [
      'All templates',
      'Unlimited CVs',
      'PDF export',
      'Priority support',
      'Advanced ATS optimization',
      'AI-powered suggestions',
      'Custom branding',
      'Cloud storage',
      'Version history',
      'Collaboration tools',
    ],
    buttonText: 'Subscribe Now',
    buttonLink: '/auth/register',
    popular: true,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-stone-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-stone-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-stone-600">
            Choose the plan that&apos;s right for you
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-lg shadow-md overflow-hidden ${
                plan.popular ? 'ring-2 ring-teal-600' : ''
              }`}
            >
              {plan.popular && (
                <div className="bg-teal-600 text-white text-center py-1">
                  Most Popular
                </div>
              )}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-stone-900 mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold text-stone-900">
                    {plan.price}
                  </span>
                  {plan.name !== 'Free' && (
                    <span className="text-stone-500 ml-1">
                      {plan.name === 'Monthly' ? '/month' : '/CV'}
                    </span>
                  )}
                </div>
                <p className="text-stone-600 mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <svg
                        className="h-5 w-5 text-green-500 mr-2 flex-shrink-0"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-stone-800 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.buttonLink}
                  className={`block w-full text-center px-4 py-2 rounded-md text-sm font-medium ${
                    plan.popular
                      ? 'bg-teal-700 text-white hover:bg-teal-800'
                      : 'bg-stone-100 text-stone-900 hover:bg-stone-200'
                  }`}
                >
                  {plan.buttonText}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-stone-900 text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium text-stone-900 mb-2">
                Can I switch plans later?
              </h3>
              <p className="text-stone-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-stone-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-stone-600">
                We accept all major credit cards, PayPal, and other popular payment methods.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-stone-900 mb-2">
                Is there a free trial?
              </h3>
              <p className="text-stone-600">
                Yes, you can create one CV for free to try out our service before committing to a paid plan.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-stone-900 mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-stone-600">
                Yes, you can cancel your subscription at any time. You&apos;ll continue to have access until the end of your billing period.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 