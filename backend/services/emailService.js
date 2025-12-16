import nodemailer from "nodemailer";

export async function sendBookingConfirmation(to, booking) {
  // Prevent crashes if env vars are missing
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("⚠️ EMAIL SERVICE DISABLED — missing EMAIL_USER or EMAIL_PASS");
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // App Password recommended
    },
  });

  const mailOptions = {
    from: "MyBnB <no-reply@mybnb.com>",
    to,
    subject: "Bevestiging van je boeking",
    text: `
Je boeking is bevestigd!

Check-in: ${booking.checkinDate}
Check-out: ${booking.checkoutDate}
Aantal gasten: ${booking.numberOfGuests}
Totaalprijs: €${booking.totalPrice}
    `,
    html: `
      <h2>Je boeking is bevestigd!</h2>
      <p>Bedankt voor je reservering bij MyBnB.</p>
      <p><strong>Check-in:</strong> ${booking.checkinDate}</p>
      <p><strong>Check-out:</strong> ${booking.checkoutDate}</p>
      <p><strong>Aantal gasten:</strong> ${booking.numberOfGuests}</p>
      <p><strong>Totaalprijs:</strong> €${booking.totalPrice}</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}
