import { NextRequest, NextResponse } from "next/server";

const PAYPAL_API_URL = process.env.PAYPAL_ENV === "production"
  ? "https://api-m.paypal.com"
  : "https://api-m.sandbox.paypal.com";

async function getAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("PayPal credentials not configured");
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get PayPal access token: ${error}`);
  }

  const data = await response.json();
  return data.access_token;
}

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

    const accessToken = await getAccessToken();

    const orderPayload = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: amount.toFixed(2),
          },
          description: "Donation to Madagascar Turtle Conservation",
          custom_id: JSON.stringify({ donorName, donorEmail }),
        },
      ],
      payment_source: {
        card: {
          experience_context: {
            return_url: `${process.env.NEXT_PUBLIC_APP_URL || ""}/donate?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || ""}/donate?cancelled=true`,
          },
        },
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
      const error = await response.text();
      console.error("PayPal create order error:", error);
      return NextResponse.json(
        { error: "Failed to create PayPal order" },
        { status: 500 }
      );
    }

    const order = await response.json();
    return NextResponse.json({ id: order.id, status: order.status });
  } catch (error) {
    console.error("PayPal create order error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
