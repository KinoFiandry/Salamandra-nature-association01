"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";

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
}

export default function PayPalDonateButton({ onSuccess }: PayPalDonateButtonProps) {
  const [sdkReady, setSdkReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sdkReady && containerRef.current && window.PayPal?.Donation) {
      // Clear container before rendering
      containerRef.current.innerHTML = '<div id="paypal-donate-container"></div>';
      
      try {
        window.PayPal.Donation.Button({
          env: (process.env.NEXT_PUBLIC_PAYPAL_ENV as "sandbox" | "production") || "sandbox",
          hosted_button_id: process.env.NEXT_PUBLIC_PAYPAL_HOSTED_BUTTON_ID || "YOUR_HOSTED_BUTTON_ID",
          image: {
            src: "https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif",
            title: "PayPal - The safer, easier way to pay online!",
            alt: "Donate with PayPal button"
          },
          onComplete: onSuccess
        }).render("#paypal-donate-container");
      } catch (error) {
        console.error("PayPal rendering error:", error);
      }
    }
  }, [sdkReady, onSuccess]);

  const onScriptLoad = useCallback(() => {
    setSdkReady(true);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full py-4">
      <div ref={containerRef} className="min-h-[60px] flex items-center justify-center" />
      <Script
        src="https://www.paypalobjects.com/donate/sdk/donate-sdk.js"
        strategy="afterInteractive"
        onLoad={onScriptLoad}
      />
      {!sdkReady && (
        <div className="animate-pulse flex space-x-4">
          <div className="h-12 w-48 bg-gray-200 rounded-lg"></div>
        </div>
      )}
    </div>
  );
}
