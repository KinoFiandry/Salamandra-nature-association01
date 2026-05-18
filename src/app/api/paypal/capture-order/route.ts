import { NextRequest, NextResponse } from "next/server";
import { generateAccessToken } from "@/lib/paypal";
import { sendDonationNotification } from "@/lib/resend";

const PAYPAL_API_URL = process.env.PAYPAL_ENV === "production"
  ? "https://api-m.paypal.com"
  : "https://api-m.sandbox.paypal.com";

export async function POST(request: NextRequest) {
  try {
    const bodyText = await request.text();
    if (!bodyText) {
      return NextResponse.json({ error: "Empty request body" }, { status: 400 });
    }
    
    let body;
    try {
      body = JSON.parse(bodyText);
    } catch (e) {
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 });
    }
    
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    const accessToken = await generateAccessToken();

    const response = await fetch(
      `${PAYPAL_API_URL}/v2/checkout/orders/${orderId}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      let errorDetail;
      try {
        errorDetail = JSON.parse(errorText);
      } catch {
        errorDetail = errorText;
      }
      console.error("PayPal capture order detailed error:", JSON.stringify(errorDetail, null, 2));

      return NextResponse.json(
        { 
          error: "Failed to capture PayPal order",
          details: errorDetail?.details?.[0]?.description || errorDetail?.message || "Check server logs for details"
        },
        { status: response.status }
      );
    }

    const captureData = await response.json();

    const capture = captureData.purchase_units?.[0]?.payments?.captures?.[0];
    const payerEmail = captureData.payer?.email_address ?? "";
    const payerName = captureData.payer?.name?.given_name
      ? `${captureData.payer.name.given_name} ${captureData.payer.name.surname || ""}`.trim()
      : "Anonymous";

    // Send donation notification emails (fire-and-forget)
    sendDonationNotification({
      donorName: payerName,
      donorEmail: payerEmail,
      amount: capture?.amount?.value ?? "?",
      currency: capture?.amount?.currency_code ?? "EUR",
      orderId: captureData.id,
      captureId: capture?.id ?? "",
    }).catch((err) => console.error("Donation email error:", err));

    return NextResponse.json({
      id: captureData.id,
      status: captureData.status,
      captureId: capture?.id,
      amount: capture?.amount?.value,
      currency: capture?.amount?.currency_code,
      payerEmail,
      payerName,
    });
  } catch (error) {
    console.error("PayPal capture order error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
