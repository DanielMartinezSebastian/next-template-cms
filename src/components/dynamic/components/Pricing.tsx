/**
 * Pricing Component
 * Displays a pricing plan with features and call-to-action
 */

import React from 'react';

interface Feature {
  text: string;
  included: boolean;
}

interface PricingProps {
  planName?: string;
  price?: string;
  currency?: string;
  period?: string;
  description?: string;
  features?: Feature[];
  buttonText?: string;
  buttonLink?: string;
  highlighted?: boolean;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  locale?: string;
  editMode?: boolean;
  componentId?: string;
}

export function Pricing({
  planName = 'Pro Plan',
  price = '29',
  currency = '$',
  period = 'month',
  description = 'Perfect for growing businesses',
  features = [
    { text: 'Unlimited projects', included: true },
    { text: 'Advanced analytics', included: true },
    { text: 'Priority support', included: true },
    { text: 'Custom integrations', included: false },
    { text: 'Dedicated manager', included: false },
  ],
  buttonText = 'Get Started',
  buttonLink = '#',
  highlighted = false,
  backgroundColor = 'bg-white',
  textColor = 'text-gray-900',
  accentColor = 'bg-blue-600',
  locale = 'en',
  editMode = false,
  componentId,
}: PricingProps) {
  return (
    <div
      className={`pricing relative ${backgroundColor} ${
        highlighted ? 'ring-2 ring-blue-600 ring-offset-2' : 'border border-gray-200'
      } rounded-lg p-6 shadow-lg transition-transform hover:scale-105`}
      data-component-id={componentId}
    >
      {editMode && (
        <div className="mb-4 rounded bg-green-50 p-2 text-xs text-green-700 dark:bg-green-950 dark:text-green-300">
          Pricing Component - ID: {componentId}
        </div>
      )}

      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 transform">
          <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white">
            Most Popular
          </span>
        </div>
      )}

      <div className="space-y-6">
        {/* Plan Header */}
        <div className="text-center">
          <h3 className={`text-xl font-bold ${textColor}`}>{planName}</h3>
          <p className="mt-2 text-sm text-gray-500">{description}</p>
        </div>

        {/* Price */}
        <div className="text-center">
          <div className="flex items-baseline justify-center">
            <span className="text-sm text-gray-500">{currency}</span>
            <span className={`text-4xl font-bold ${textColor}`}>{price}</span>
            <span className="text-sm text-gray-500">/{period}</span>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                {feature.included ? (
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <span
                className={`text-sm ${
                  feature.included ? textColor : 'text-gray-400 line-through'
                }`}
              >
                {feature.text}
              </span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="pt-4">
          <a
            href={buttonLink}
            className={`block w-full rounded-md ${accentColor} px-4 py-3 text-center text-sm font-medium text-white transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          >
            {buttonText}
          </a>
        </div>
      </div>
    </div>
  );
}
