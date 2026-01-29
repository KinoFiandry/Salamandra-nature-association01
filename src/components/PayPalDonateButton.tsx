"use client";

import { useCallback, useEffect, useState } from "react";
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
  PayPalCardFieldsProvider,
  PayPalCardFieldsForm,
} from "@paypal/react-paypal-js";

function ButtonsWrapper({
  amount,
  currency,
  donorName,
  donorEmail,
  onSuccess,
  onError,
}: {
  amount: number;
  currency: string;
  donorName: string;
  donorEmail: string;
  onSuccess: (data: {
    orderId: string;
    captureId: string;
    amount: string;
    currency: string;
  }) => void;
  onError?: (error: string) => void;
}) {
  const [{ isRejected, isPending, options }, dispatch] = usePayPalScriptReducer();
  const [showCardForm, setShowCardForm] = useState(false);

  const handleCreateOrder = useCallback(async () => {
    try {
      const res = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, currency, donorName, donorEmail }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Order creation failed");
      }
      const data = await res.json();
      return data.id;
    } catch (err) {
      console.error("Create order error:", err);
      onError?.(err instanceof Error ? err.message : "Failed to initialize payment");
      throw err;
    }
  }, [amount, currency, donorName, donorEmail, onError]);

  const handleApprove = useCallback(
    async (data: { orderID: string }) => {
      try {
        const res = await fetch("/api/paypal/capture-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: data.orderID }),
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Payment capture failed");
        }
        const captureData = await res.json();
        onSuccess({
          orderId: captureData.id,
          captureId: captureData.captureId,
          amount: captureData.amount,
          currency: captureData.currency,
        });
      } catch (err) {
        console.error("Capture order error:", err);
        onError?.(err instanceof Error ? err.message : "Payment failed");
      }
    },
    [onSuccess, onError]
  );

  if (isRejected) {
    return (
      <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
        <p className="font-bold mb-1">Failed to load Payment System</p>
        <p>
          Please check your internet connection or disable any ad-blockers.
          Using an <strong>Incognito/Private window</strong> is highly recommended for sandbox testing.
        </p>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="space-y-3 animate-pulse">
        <div className="h-14 bg-sage-100 rounded-lg" />
        <div className="h-14 bg-sage-100 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <PayPalButtons
          style={{
            layout: "vertical",
            color: "gold",
            shape: "rect",
            label: "pay",
            tagline: false,
          }}
          createOrder={handleCreateOrder}
          onApprove={handleApprove}
          onError={(err) => {
            console.error("PayPal Button Error:", err);
            onError?.("Payment failed to initialize. If 'Debit or Credit Card' doesn't respond, please try the PayPal button or use Incognito mode.");
          }}
          forceReRender={[amount, currency]}
        />
      </div>

      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-sage-200"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-sage-400 font-medium">Safe & Secure</span>
        </div>
      </div>
    </div>
  );
}

interface PayPalDonateButtonProps {
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
}: PayPalDonateButtonProps) {
  const [clientToken, setClientToken] = useState<string | null>(null);
  const [loadingToken, setLoadingToken] = useState(true);
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";

  useEffect(() => {
    async function fetchToken() {
      try {
        const res = await fetch(`/api/paypal/client-token?currency=${currency}&intent=CAPTURE`);
        const data = await res.json();
        if (data.client_token) {
          setClientToken(data.client_token);
        }
      } catch (err) {
        console.error("Error fetching client token:", err);
      } finally {
        setLoadingToken(false);
      }
    }
    fetchToken();
  }, [currency]);

  if (!clientId) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-lg text-yellow-700 text-sm">
        PayPal configuration missing.
      </div>
    );
  }

  if (loadingToken) {
    return (
      <div className="space-y-3 animate-pulse">
        <div className="h-14 bg-sage-100 rounded-lg" />
        <div className="h-14 bg-sage-100 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <PayPalScriptProvider
        options={{
          clientId: clientId,
          currency: currency,
          intent: "CAPTURE",
          components: "buttons,card-fields",
          dataClientToken: clientToken || undefined,
        }}
      >
        <ButtonsWrapper
          amount={amount}
          currency={currency}
          donorName={donorName}
          donorEmail={donorEmail}
          onSuccess={onSuccess}
          onError={onError}
        />
      </PayPalScriptProvider>
    </div>
  );
}
