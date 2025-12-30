"use client";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import type { StripeElementsOptions } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface StripeProviderProps {
  children: React.ReactNode;
  amount: number;
  currency: "usd" | "eur";
}

export function StripeProvider({
  children,
  amount,
  currency,
}: StripeProviderProps) {
  const options: StripeElementsOptions = {
    mode: "payment",
    amount: Math.round(amount * 100),
    currency,
    appearance: {
      theme: "stripe",
      variables: {
        colorPrimary: "#059669",
        colorBackground: "#ffffff",
        colorText: "#064e3b",
        colorDanger: "#dc2626",
        fontFamily: "system-ui, sans-serif",
        borderRadius: "8px",
      },
      rules: {
        ".Input": {
          border: "1px solid #d1fae5",
          boxShadow: "none",
        },
        ".Input:focus": {
          border: "1px solid #059669",
          boxShadow: "0 0 0 2px rgba(5, 150, 105, 0.2)",
        },
        ".Label": {
          color: "#065f46",
        },
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}
