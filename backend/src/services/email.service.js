import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/* ============================================================
   HELPERS
============================================================ */
function formatDate(date) {
  if (!date) return "onbekend";
  return new Date(date).toLocaleDateString("nl-NL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

async function sendEmail({ to, subject, html }) {
  try {
    const result = await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject,
      html,
    });

    if (result.error) {
      console.error("❌ Resend email failed:", result.error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("❌ Resend API error:", err);
    return false;
  }
}

/* ============================================================
   BOOKING CONFIRMATION EMAIL
============================================================ */
export async function sendBookingConfirmation(to, booking) {
  console.log("📧 CONFIRMATION EMAIL FUNCTION REACHED");

  const html = `
    <h2>Je boeking is bevestigd!</h2>
    <p>Beste gebruiker,</p>
    <p>Je boeking voor <strong>${booking.property?.title ?? "onbekende accommodatie"}</strong> is succesvol bevestigd.</p>
    <p>Details:</p>
    <ul>
      <li>Check-in: ${formatDate(booking.startDate)}</li>
      <li>Check-out: ${formatDate(booking.endDate)}</li>
      <li>Aantal gasten: ${booking.numberOfGuests}</li>
      <li>Totaalprijs: €${booking.totalPrice}</li>
    </ul>
    <p>We wensen je een fantastisch verblijf!</p>
  `;

  return await sendEmail({
    to,
    subject: "Bevestiging van je boeking – StayBnB",
    html,
  });
}

/* ============================================================
   BOOKING CANCELLATION EMAIL
============================================================ */
export async function sendBookingCancellationEmail(to, booking) {
  console.log("📧 CANCELLATION EMAIL FUNCTION REACHED");

  const html = `
    <h2>Je boeking is geannuleerd</h2>
    <p>Beste gebruiker,</p>
    <p>Je boeking voor <strong>${booking.property?.title ?? "onbekende accommodatie"}</strong> is succesvol geannuleerd.</p>
    <p>Details:</p>
    <ul>
      <li>Check-in: ${formatDate(booking.startDate)}</li>
      <li>Check-out: ${formatDate(booking.endDate)}</li>
    </ul>
    <p>We hopen je snel weer te zien op StayBnB!</p>
  `;

  return await sendEmail({
    to,
    subject: "Bevestiging van annulering – StayBnB",
    html,
  });
}
