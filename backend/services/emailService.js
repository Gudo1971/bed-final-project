

export async function sendBookingConfirmation(to, booking) {
  if (!process.env.MAILTRAP_TOKEN) {
    console.warn("⚠️ EMAIL SERVICE DISABLED — missing MAILTRAP_TOKEN");
    return;
  }

  const response = await fetch("https://send.api.mailtrap.io/api/send", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.MAILTRAP_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: {
        email: "hello@demomailtrap.co",
        name: "MyBnB",
      },
      to: [
        { email: "gbgieles@gmail.com"}
      ],
      subject: "Bevestiging van je boeking",
      text: `
Je boeking is bevestigd!

Check-in: ${booking.checkinDate}
Check-out: ${booking.checkoutDate}
Aantal gasten: ${booking.numberOfGuests}
Totaalprijs: €${booking.totalPrice}

      `,
      category: "Booking Confirmation",
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Email sending failed:", error);
  }
}
