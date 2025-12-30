"use client";

import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const PRESET_AMOUNTS = [10, 25, 50, 100];

interface DonationFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function DonationForm({ onSuccess, onCancel }: DonationFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState<number>(25);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [currency, setCurrency] = useState<"usd" | "eur">("usd");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [paymentReady, setPaymentReady] = useState(false);

  const displayAmount = customAmount ? parseFloat(customAmount) || 0 : amount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (displayAmount < 1) {
      setErrorMessage("Please enter a valid donation amount (minimum $1)");
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setErrorMessage(submitError.message || "An error occurred");
        setIsProcessing(false);
        return;
      }

      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: displayAmount, currency }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create payment intent");
      }

      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        clientSecret: data.clientSecret,
        redirect: "if_required",
        confirmParams: {
          return_url: `${window.location.origin}/donate/success`,
        },
      });

      if (confirmError) {
        setErrorMessage(confirmError.message || "Payment failed");
        setIsProcessing(false);
      } else {
        onSuccess();
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "An error occurred");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-emerald-800 mb-3">
          Select Amount
        </label>
        <div className="grid grid-cols-4 gap-2 mb-3">
          {PRESET_AMOUNTS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => {
                setAmount(preset);
                setCustomAmount("");
              }}
              className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                amount === preset && !customAmount
                  ? "bg-emerald-600 text-white shadow-md"
                  : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
              }`}
            >
              {currency === "usd" ? "$" : "€"}{preset}
            </button>
          ))}
        </div>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 font-medium">
            {currency === "usd" ? "$" : "€"}
          </span>
          <input
            type="number"
            placeholder="Custom amount"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            min="1"
            step="0.01"
            className="w-full pl-10 pr-4 py-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-emerald-900 placeholder:text-emerald-400"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-emerald-800 mb-3">
          Currency
        </label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setCurrency("usd")}
            className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
              currency === "usd"
                ? "bg-emerald-600 text-white shadow-md"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
            }`}
          >
            USD ($)
          </button>
          <button
            type="button"
            onClick={() => setCurrency("eur")}
            className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
              currency === "eur"
                ? "bg-emerald-600 text-white shadow-md"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
            }`}
          >
            EUR (€)
          </button>
        </div>
      </div>

      <div className="bg-emerald-50 p-4 rounded-lg">
        <div className="flex justify-between items-center text-lg font-semibold text-emerald-900">
          <span>Your Donation</span>
          <span>
            {currency === "usd" ? "$" : "€"}
            {displayAmount.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="max-h-[400px] overflow-y-auto pr-1">
        <PaymentElement
          onReady={() => setPaymentReady(true)}
          options={{
            layout: "tabs",
          }}
        />
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {errorMessage}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 px-6 border border-emerald-200 text-emerald-700 rounded-lg font-semibold hover:bg-emerald-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || !paymentReady || isProcessing || displayAmount < 1}
          className="flex-1 py-3 px-6 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Processing...
            </span>
          ) : (
            `Donate ${currency === "usd" ? "$" : "€"}${displayAmount.toFixed(2)}`
          )}
        </button>
      </div>
    </form>
  );
}
