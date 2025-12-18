import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendBookingConfirmation(to, booking) {
  console.log("CONFIRMATION EMAIL FUNCTION REACHED");

  try {
    const result = await resend.emails.send({
      from: 'onboarding@resend.dev',   // gratis & toegestaan
      to,
      subject: 'Bevestiging van je boeking – StayBnB',
      html: `
        <h2>Je boeking is bevestigd!</h2>
        <p>Beste gebruiker,</p>
        <p>Je boeking voor <strong>${booking.property.title}</strong> is succesvol bevestigd.</p>
        <p>Details:</p>
        <ul>
          <li>Check-in: ${booking.checkinDate}</li>
          <li>Check-out: ${booking.checkoutDate}</li>
          <li>Aantal gasten: ${booking.numberOfGuests}</li>
          <li>Totaalprijs: €${booking.totalPrice}</li>
        </ul>
        <p>We wensen je een fantastisch verblijf!</p>
      `
    });

    if (result.error) {
      console.error("Resend confirmation email failed:", result.error);
      return false;
    }

    console.log("CONFIRMATION EMAIL SENT via Resend");
    return true;

  } catch (err) {
    console.error("Resend API error:", err);
    return false;
  }
}

export async function sendBookingCancellationEmail(to, booking) {
  console.log("CANCELLATION EMAIL FUNCTION REACHED");

  try {
    const result = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to,
      subject: 'Bevestiging van annulering – StayBnB',
      html: `
        <h2>Je boeking is geannuleerd</h2>
        <p>Beste gebruiker,</p>
        <p>Je boeking voor <strong>${booking.property.title}</strong> is succesvol geannuleerd.</p>
        <p>Details:</p>
        <ul>
          <li>Check-in: ${booking.checkinDate}</li>
          <li>Check-out: ${booking.checkoutDate}</li>
        </ul>
        <p>We hopen je snel weer te zien op StayBnB!</p>
      `
    });

    if (result.error) {
      console.error("Resend cancellation email failed:", result.error);
      return false;
    }

    console.log("CANCELLATION EMAIL SENT via Resend");
    return true;

  } catch (err) {
    console.error("Resend API error:", err);
    return false;
  }
}
