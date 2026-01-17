"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { DonationForm } from "@/components/DonationForm";
import Link from "next/link";
import type { StripeElementsOptions } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function DonatePage() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [elementsKey, setElementsKey] = useState(0);
  const [selectedAmount, setSelectedAmount] = useState(25);
  const [selectedCurrency, setSelectedCurrency] = useState<"usd" | "eur">("usd");

  const options: StripeElementsOptions = {
    mode: "payment",
    amount: Math.round(selectedAmount * 100),
    currency: selectedCurrency,
    appearance: {
      theme: "stripe",
      variables: {
        colorPrimary: "#c17a4a",
        colorBackground: "#ffffff",
        colorText: "#333b33",
        colorDanger: "#dc2626",
        fontFamily: "system-ui, sans-serif",
        borderRadius: "8px",
      },
      rules: {
        ".Input": {
          border: "1px solid #e3e6e3",
          boxShadow: "none",
        },
        ".Input:focus": {
          border: "1px solid #c17a4a",
          boxShadow: "0 0 0 2px rgba(193, 122, 74, 0.2)",
        },
        ".Label": {
          color: "#3d473d",
        },
      },
    },
  };

  useEffect(() => {
    setElementsKey((prev) => prev + 1);
  }, [selectedAmount, selectedCurrency]);

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-emerald-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-emerald-900 mb-4">
            Thank You!
          </h1>
          <p className="text-emerald-700 mb-6">
            Your generous donation will help protect Madagascar&apos;s endangered
            turtles. Every contribution makes a difference in our conservation
            efforts.
          </p>
          <div className="bg-emerald-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-emerald-600">
              A confirmation email has been sent to your email address.
            </p>
          </div>
          <Link
            href="/"
            className="inline-block bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
              </div>
              <span className="font-bold text-xl text-emerald-900">
                Turtle Conservation
              </span>
            </Link>
            <Link
              href="/"
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              &larr; Back to Home
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-emerald-900 mb-4">
                Support Turtle Conservation
              </h1>
              <p className="text-lg text-emerald-700">
                Your donation directly supports our mission to protect
                Madagascar&apos;s endangered turtle species and their habitats.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="text-xl font-semibold text-emerald-900 mb-4">
                Your Impact
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      className="w-4 h-4 text-emerald-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium text-emerald-900">$10</span>
                    <p className="text-sm text-emerald-600">
                      Provides food for rescued turtles for one week
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      className="w-4 h-4 text-emerald-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium text-emerald-900">$25</span>
                    <p className="text-sm text-emerald-600">
                      Supports nest protection for one nesting season
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      className="w-4 h-4 text-emerald-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium text-emerald-900">$50</span>
                    <p className="text-sm text-emerald-600">
                      Funds community education workshops
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      className="w-4 h-4 text-emerald-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium text-emerald-900">$100</span>
                    <p className="text-sm text-emerald-600">
                      Sponsors habitat restoration for one hectare
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-emerald-800 text-white rounded-xl p-6">
              <h3 className="font-semibold mb-2">100% Secure Donation</h3>
              <p className="text-emerald-100 text-sm">
                Your payment information is encrypted and secure. We use Stripe,
                a trusted payment processor used by millions of organizations
                worldwide.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-xl h-fit">
            <h2 className="text-2xl font-bold text-emerald-900 mb-6">
              Make a Donation
            </h2>
            <Elements key={elementsKey} stripe={stripePromise} options={options}>
              <DonationForm
                onSuccess={() => setShowSuccess(true)}
                onCancel={() => (window.location.href = "/")}
              />
            </Elements>
          </div>
        </div>
      </main>
    </div>
  );
}
