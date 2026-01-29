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

      const orderPayload = {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: amount.toFixed(2),
            },
            description: "Donation to Madagascar Turtle Conservation",
            // Use a simpler custom_id to avoid length or character issues
            custom_id: `${donorName.substring(0, 30)}|${donorEmail.substring(0, 50)}`,
          },
        ],
        application_context: {
          shipping_preference: "NO_SHIPPING",
          user_action: "PAY_NOW",
          brand_name: "Salamandra Nature",
        },
      };

    const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "PayPal-Request-Id": `donation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      },
      body: JSON.stringify(orderPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorDetail;
      try {
        errorDetail = JSON.parse(errorText);
      } catch {
        errorDetail = errorText;
      }
      console.error("PayPal create order detailed error:", JSON.stringify(errorDetail, null, 2));
      
      return NextResponse.json(
        { 
          error: "Failed to create PayPal order", 
          details: errorDetail?.details?.[0]?.description || errorDetail?.message || "Check server logs for details"
        },
        { status: response.status }
      );
    }

    const order = await response.json();
    return NextResponse.json({ id: order.id, status: order.status });
  } catch (error) {
    console.error("PayPal create order error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
