import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
const TO = process.env.NOTIFICATION_EMAIL || "salamandra.nature2@gmail.com";

export async function sendContactNotification(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  return resend.emails.send({
    from: FROM,
    to: TO,
    replyTo: data.email,
    subject: `[Contact] ${data.subject}`,
    html: `
      <h2>New contact message — Salamandra Nature</h2>
      <p><strong>From:</strong> ${data.name} (${data.email})</p>
      <p><strong>Subject:</strong> ${data.subject}</p>
      <hr/>
      <p style="white-space:pre-wrap">${data.message}</p>
    `,
  });
}

export async function sendDonationNotification(data: {
  donorName: string;
  donorEmail: string;
  amount: string;
  currency: string;
  orderId: string;
  captureId: string;
}) {
  return Promise.all([
    // Notify admin
    resend.emails.send({
      from: FROM,
      to: TO,
      subject: `[Donation] ${data.amount} ${data.currency} from ${data.donorName}`,
      html: `
        <h2>New donation received — Salamandra Nature</h2>
        <p><strong>Donor:</strong> ${data.donorName} (${data.donorEmail})</p>
        <p><strong>Amount:</strong> ${data.amount} ${data.currency}</p>
        <p><strong>PayPal Order ID:</strong> ${data.orderId}</p>
        <p><strong>Capture ID:</strong> ${data.captureId}</p>
      `,
    }),
    // Confirm to donor (only if email available)
    ...(data.donorEmail
      ? [
          resend.emails.send({
            from: FROM,
            to: data.donorEmail,
            subject: `Thank you for your donation — Salamandra Nature`,
            html: `
              <h2>Thank you, ${data.donorName}!</h2>
              <p>We have received your donation of <strong>${data.amount} ${data.currency}</strong>.</p>
              <p>Your generosity helps us protect Madagascar's endangered tortoises.</p>
              <p>— The Salamandra Nature team</p>
            `,
          }),
        ]
      : []),
  ]);
}
