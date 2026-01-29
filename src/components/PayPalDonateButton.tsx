"use client";

import { useEffect, useRef, useState, useCallback } from "react";

declare global {
  interface Window {
    paypal?: {
      CardFields: (options: CardFieldsOptions) => CardFieldsInstance;
    };
  }
}

interface CardFieldsOptions {
  createOrder: () => Promise<string>;
  onApprove: (data: { orderID: string }) => Promise<void>;
  onError?: (err: unknown) => void;
  style?: Record<string, Record<string, string>>;
  inputEvents?: {
    onChange?: (state: CardFieldState) => void;
    onFocus?: (state: CardFieldState) => void;
    onBlur?: (state: CardFieldState) => void;
  };
}

interface CardFieldsInstance {
  isEligible: () => boolean;
  NameField: () => { render: (selector: string) => Promise<void> };
  NumberField: () => { render: (selector: string) => Promise<void> };
  ExpiryField: () => { render: (selector: string) => Promise<void> };
  CVVField: () => { render: (selector: string) => Promise<void> };
  submit: (options?: { billingAddress?: object }) => Promise<void>;
  getState: () => CardFieldState;
}

interface CardFieldState {
  cards: Array<{ type: string }>;
  errors: string[];
  isFormValid: boolean;
  fields: Record<string, { isValid: boolean; isEmpty: boolean; isFocused: boolean }>;
}

interface PayPalCardFormProps {
  amount: number;
  currency?: string;
  donorName: string;
  donorEmail: string;
  onSuccess: (data: {
    orderId: string;
    captureId: string;
    amount: string;
    currency: string;
  }) => void;
  onError?: (error: string) => void;
}

export default function PayPalDonateButton({
  amount,
  currency = "EUR",
  donorName,
  donorEmail,
  onSuccess,
  onError,
}: PayPalCardFormProps) {
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEligible, setIsEligible] = useState(true);
  const [formValid, setFormValid] = useState(false);
  const cardFieldsRef = useRef<CardFieldsInstance | null>(null);
  const initialized = useRef(false);

  const handleSubmit = useCallback(async () => {
    if (!cardFieldsRef.current || processing) return;

    setProcessing(true);
    setError(null);

    try {
      await cardFieldsRef.current.submit();
    } catch (err) {
      console.error("Card submit error:", err);
      setError("Payment failed. Please check your card details.");
      setProcessing(false);
    }
  }, [processing]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    if (!clientId || clientId === "YOUR_PAYPAL_CLIENT_ID") {
      setError("PayPal Client ID is not configured.");
      setLoading(false);
      return;
    }

    const loadScript = () => {
      return new Promise<void>((resolve, reject) => {
        if (window.paypal?.CardFields) {
          resolve();
          return;
        }

        const existingScript = document.querySelector(
          'script[src*="paypal.com/sdk/js"]'
        );
        if (existingScript) {
          existingScript.addEventListener("load", () => resolve());
          return;
        }

        const script = document.createElement("script");
        script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&components=card-fields&currency=${currency}`;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load PayPal SDK"));
        document.body.appendChild(script);
      });
    };

    const initCardFields = async () => {
      try {
        await loadScript();

        if (!window.paypal?.CardFields) {
          throw new Error("PayPal CardFields not available");
        }

        const cardFields = window.paypal.CardFields({
          style: {
            input: {
              "font-size": "16px",
              "font-family": "'Inter', system-ui, sans-serif",
              color: "#1f2937",
              padding: "12px",
            },
            ".invalid": {
              color: "#dc2626",
            },
            ":focus": {
              color: "#1f2937",
            },
          },
          createOrder: async () => {
            const response = await fetch("/api/paypal/create-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                amount,
                currency,
                donorName,
                donorEmail,
              }),
            });

            if (!response.ok) {
              const errData = await response.json();
              throw new Error(errData.error || "Failed to create order");
            }

            const data = await response.json();
            return data.id;
          },
          onApprove: async (data: { orderID: string }) => {
            const response = await fetch("/api/paypal/capture-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderId: data.orderID }),
            });

            if (!response.ok) {
              const errData = await response.json();
              throw new Error(errData.error || "Failed to capture payment");
            }

            const captureData = await response.json();
            setProcessing(false);
            onSuccess({
              orderId: captureData.id,
              captureId: captureData.captureId,
              amount: captureData.amount,
              currency: captureData.currency,
            });
          },
          onError: (err: unknown) => {
            console.error("PayPal CardFields error:", err);
            const errorMessage =
              err instanceof Error ? err.message : "Payment failed";
            setError(errorMessage);
            setProcessing(false);
            onError?.(errorMessage);
          },
          inputEvents: {
            onChange: (state: CardFieldState) => {
              setFormValid(state.isFormValid);
            },
          },
        });

        if (!cardFields.isEligible()) {
          setIsEligible(false);
          setError(
            "Card payments are not available in your region. Please contact us for alternative payment methods."
          );
          setLoading(false);
          return;
        }

        cardFieldsRef.current = cardFields;

        await Promise.all([
          cardFields.NameField().render("#card-name-field"),
          cardFields.NumberField().render("#card-number-field"),
          cardFields.ExpiryField().render("#card-expiry-field"),
          cardFields.CVVField().render("#card-cvv-field"),
        ]);

        setLoading(false);
      } catch (err) {
        console.error("CardFields init error:", err);
        setError(
          err instanceof Error ? err.message : "Failed to initialize payment form"
        );
        setLoading(false);
      }
    };

    initCardFields();
  }, [amount, currency, donorName, donorEmail, onSuccess, onError]);

  if (error && !isEligible) {
    return (
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {loading && (
        <div className="space-y-3 animate-pulse">
          <div className="h-12 bg-sage-100 rounded-lg" />
          <div className="h-12 bg-sage-100 rounded-lg" />
          <div className="grid grid-cols-2 gap-3">
            <div className="h-12 bg-sage-100 rounded-lg" />
            <div className="h-12 bg-sage-100 rounded-lg" />
          </div>
        </div>
      )}

      <div className={loading ? "hidden" : "space-y-3"}>
        <div>
          <label className="block text-sm font-medium text-sage-700 mb-1.5">
            Cardholder Name
          </label>
          <div
            id="card-name-field"
            className="h-12 border border-sage-200 rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-terracotta-500 focus-within:border-terracotta-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-sage-700 mb-1.5">
            Card Number
          </label>
          <div
            id="card-number-field"
            className="h-12 border border-sage-200 rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-terracotta-500 focus-within:border-terracotta-500 transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-sage-700 mb-1.5">
              Expiry Date
            </label>
            <div
              id="card-expiry-field"
              className="h-12 border border-sage-200 rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-terracotta-500 focus-within:border-terracotta-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-sage-700 mb-1.5">
              CVV
            </label>
            <div
              id="card-cvv-field"
              className="h-12 border border-sage-200 rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-terracotta-500 focus-within:border-terracotta-500 transition-all"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading || processing || !formValid}
        className="w-full bg-terracotta-500 text-white py-3.5 rounded-lg font-bold hover:bg-terracotta-600 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {processing ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Processing...
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            Donate {currency === "EUR" ? "€" : "$"}
            {amount.toFixed(2)}
          </>
        )}
      </button>

      <p className="text-xs text-sage-500 text-center">
        Your payment is secured by PayPal. Card details are encrypted and never
        stored on our servers.
      </p>
    </div>
  );
}
