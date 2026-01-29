"use client";

import { useEffect, useState, useCallback } from "react";
import {
  PayPalScriptProvider,
  PayPalCardFieldsProvider,
  PayPalNameField,
  PayPalNumberField,
  PayPalExpiryField,
  PayPalCVVField,
  usePayPalCardFields,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";

function ScriptErrorWrapper({ children }: { children: React.ReactNode }) {
  const [{ isRejected, isPending }] = usePayPalScriptReducer();

  if (isRejected) {
    return (
      <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
        <p className="font-bold mb-1">Failed to load PayPal Secure Payment</p>
        <p>
          This may be due to an ad-blocker or your account not being eligible
          for Advanced Card Payments. Please try disabling ad-blockers.
        </p>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="space-y-3 animate-pulse">
        <div className="h-12 bg-sage-100 rounded-lg" />
        <div className="h-12 bg-sage-100 rounded-lg" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-12 bg-sage-100 rounded-lg" />
          <div className="h-12 bg-sage-100 rounded-lg" />
        </div>
        <div className="h-12 bg-sage-200 rounded-lg" />
      </div>
    );
  }

  return <>{children}</>;
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

function CardFieldsContent({
  amount,
  currency,
  onSuccess,
  onError,
}: Omit<PayPalCardFormProps, "donorName" | "donorEmail">) {
  const { cardFields } = usePayPalCardFields();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldsReady, setFieldsReady] = useState(false);

  useEffect(() => {
    if (cardFields?.submit) {
      setFieldsReady(true);
    }
  }, [cardFields]);

  const handleSubmit = async () => {
    if (!cardFields?.submit || processing) return;

    setProcessing(true);
    setError(null);

    try {
      await cardFields.submit();
    } catch (err) {
      console.error("Card submit error:", err);
      const msg = err instanceof Error ? err.message : "Payment failed";
      setError(msg);
      onError?.(msg);
      setProcessing(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-sage-700 mb-1.5">
            Cardholder Name
          </label>
          <div className="h-12 border border-sage-200 rounded-lg overflow-hidden bg-white">
            <PayPalNameField
              style={{
                input: {
                  "font-size": "16px",
                  color: "#1f2937",
                  padding: "12px",
                },
              }}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-sage-700 mb-1.5">
            Card Number
          </label>
          <div className="h-12 border border-sage-200 rounded-lg overflow-hidden bg-white">
            <PayPalNumberField
              style={{
                input: {
                  "font-size": "16px",
                  color: "#1f2937",
                  padding: "12px",
                },
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-sage-700 mb-1.5">
              Expiry Date
            </label>
            <div className="h-12 border border-sage-200 rounded-lg overflow-hidden bg-white">
              <PayPalExpiryField
                style={{
                  input: {
                    "font-size": "16px",
                    color: "#1f2937",
                    padding: "12px",
                  },
                }}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-sage-700 mb-1.5">
              CVV
            </label>
            <div className="h-12 border border-sage-200 rounded-lg overflow-hidden bg-white">
              <PayPalCVVField
                style={{
                  input: {
                    "font-size": "16px",
                    color: "#1f2937",
                    padding: "12px",
                  },
                }}
              />
            </div>
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
        disabled={processing || !fieldsReady}
        className="w-full bg-terracotta-500 text-white py-3.5 rounded-lg font-bold hover:bg-terracotta-600 transition-colors shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {processing ? "Processing..." : `Donate ${currency === "EUR" ? "€" : "$"}${amount.toFixed(2)}`}
      </button>
    </div>
  );
}

export default function PayPalDonateButton({
  amount,
  currency = "EUR",
  donorName,
  donorEmail,
  onSuccess,
  onError,
}: PayPalCardFormProps) {
  const [clientToken, setClientToken] = useState<string | null>(null);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/paypal/client-token?currency=${currency}&intent=CAPTURE`)
      .then((res) => res.json())
      .then((data) => {
        if (data.client_token) setClientToken(data.client_token);
        else throw new Error(data.error || "Token error");
      })
      .catch((err) => {
        console.error("Token fetch error:", err);
        setInitError("Payment system unavailable");
      });
  }, [currency]);

  const handleCreateOrder = useCallback(async () => {
    const res = await fetch("/api/paypal/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, currency, donorName, donorEmail }),
    });
    if (!res.ok) throw new Error("Order creation failed");
    const data = await res.json();
    return data.id;
  }, [amount, currency, donorName, donorEmail]);

  const handleApprove = useCallback(async (data: { orderID: string }) => {
    const res = await fetch("/api/paypal/capture-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: data.orderID }),
    });
    if (!res.ok) throw new Error("Payment capture failed");
    const captureData = await res.json();
    onSuccess({
      orderId: captureData.id,
      captureId: captureData.captureId,
      amount: captureData.amount,
      currency: captureData.currency,
    });
  }, [onSuccess]);

  const handleErr = useCallback((err: any) => {
    onError?.(err instanceof Error ? err.message : "Payment failed");
  }, [onError]);

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";

  if (initError) return <div className="p-4 text-red-600">{initError}</div>;
  if (!clientToken || !clientId) return <div className="h-48 animate-pulse bg-sage-50 rounded-xl" />;

  return (
    <PayPalScriptProvider
      options={{
        clientId: clientId,
        components: "card-fields",
        dataClientToken: clientToken,
        currency: currency,
        intent: "CAPTURE",
      }}
    >
      <ScriptErrorWrapper>
        <PayPalCardFieldsProvider
          createOrder={handleCreateOrder}
          onApprove={handleApprove}
          onError={handleErr}
        >
          <CardFieldsContent
            amount={amount}
            currency={currency}
            onSuccess={onSuccess}
            onError={onError}
          />
        </PayPalCardFieldsProvider>
      </ScriptErrorWrapper>
    </PayPalScriptProvider>
  );
}
