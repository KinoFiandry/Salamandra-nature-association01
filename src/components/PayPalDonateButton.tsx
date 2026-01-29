"use client";

import { useEffect, useRef, useState } from "react";

interface DonateParams {
  tx: string;
  st: string;
  amt: string;
  cc: string;
  cm?: string;
  item_number?: string;
  item_name?: string;
}

declare global {
  interface Window {
    PayPal?: {
      Donation: {
        Button: (options: {
          env?: "sandbox" | "production";
          hosted_button_id: string;
          custom?: string;
          image: {
            src: string;
            title: string;
            alt: string;
          };
          onComplete: (params: DonateParams) => void;
        }) => {
          render: (selector: string | HTMLElement) => void;
        };
      };
    };
  }
}

interface PayPalDonateButtonProps {
  onSuccess: (params: DonateParams) => void;
  customData?: string;
}

export default function PayPalDonateButton({ onSuccess, customData }: PayPalDonateButtonProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const renderRef = useRef(false);

  useEffect(() => {
    let script: HTMLScriptElement | null = null;

    const renderButton = () => {
      if (!containerRef.current || !window.PayPal?.Donation) return;
      
      const hostedButtonId = process.env.NEXT_PUBLIC_PAYPAL_HOSTED_BUTTON_ID;
      if (!hostedButtonId || hostedButtonId === "YOUR_PAYPAL_HOSTED_BUTTON_ID") {
        setError("PayPal Hosted Button ID is not configured.");
        setLoading(false);
        return;
      }

      try {
        // Clear container
        containerRef.current.innerHTML = '<div id="paypal-donate-container"></div>';
        
        window.PayPal.Donation.Button({
          env: (process.env.NEXT_PUBLIC_PAYPAL_ENV as "sandbox" | "production") || "sandbox",
          hosted_button_id: hostedButtonId,
          custom: customData,
          image: {
            src: "https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif",
            title: "PayPal - The safer, easier way to pay online!",
            alt: "Donate with PayPal button"
          },
          onComplete: onSuccess
        }).render("#paypal-donate-container");
        setLoading(false);
      } catch (err) {
        console.error("PayPal rendering error:", err);
        setError("Failed to render PayPal button.");
        setLoading(false);
      }
    };

    if (typeof window !== "undefined") {
      if (!window.PayPal?.Donation) {
        script = document.createElement("script");
        script.src = "https://www.paypalobjects.com/donate/sdk/donate-sdk.js";
        script.async = true;
        script.crossOrigin = "anonymous";
        script.onload = () => {
          renderButton();
        };
        script.onerror = () => {
          setError("Failed to load PayPal SDK.");
          setLoading(false);
        };
        document.body.appendChild(script);
      } else {
        renderButton();
      }
    }

    return () => {
      if (script && document.body.contains(script)) {
        // We don't necessarily want to remove the script as it might be needed if the component remounts
        // but if we do, it ensures a clean state.
        // document.body.removeChild(script);
      }
    };
  }, [onSuccess, customData]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full py-4 min-h-[100px]">
      <div ref={containerRef} className="w-full flex justify-center" />
      {loading && (
        <div className="animate-pulse flex space-x-4">
          <div className="h-12 w-48 bg-gray-200 rounded-lg"></div>
        </div>
      )}
    </div>
  );
}
