import { NextRequest, NextResponse } from "next/server";
import { generateAccessToken } from "@/lib/paypal";

const PAYPAL_API_URL = process.env.PAYPAL_ENV === "production"
  ? "https://api-m.paypal.com"
  : "https://api-m.sandbox.paypal.com";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency = "EUR", donorName, donorEmail } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid donation amount" },
        { status: 400 }
      );
    }

    const accessToken = await generateAccessToken();
    console.log("Generating PayPal order for amount:", amount, currency);

      const orderPayload = {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: amount.toFixed(2),
            },
            description: "Donation to Madagascar Turtle Conservation",
          },
        ],
        payment_source: {
          paypal: {
            experience_context: {
              payment_method_preference: "IMMEDIATE_PAYMENT_CAPITULATION",
              brand_name: "Madagascar Turtle Conservation",
              locale: "en-US",
              landing_page: "GUEST_CHECKOUT",
              shipping_preference: "NO_SHIPPING",
              user_action: "PAY_NOW",
              return_url: "https://example.com/return",
              cancel_url: "https://example.com/cancel",
            },
          },
        },
      };


    const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "PayPal-Request-Id": `donation-${Date.now()}`,
      },
      body: JSON.stringify(orderPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("PayPal API Error Response:", errorText);
      let errorDetail;
      try {
        errorDetail = JSON.parse(errorText);
      } catch {
        errorDetail = errorText;
      }
      
      return NextResponse.json(
        { 
          error: "Failed to create PayPal order", 
          details: errorDetail?.details?.[0]?.description || errorDetail?.message || "Check server logs"
        },
        { status: response.status }
      );
    }

    const order = await response.json();
    console.log("PayPal Order Created successfully:", order.id);
    return NextResponse.json({ id: order.id, status: order.status });
  } catch (error) {
    console.error("PayPal create order error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
