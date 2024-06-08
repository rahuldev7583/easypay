const nodemailer = require("nodemailer");

export async function sendVerificationEmail(
  email: string,
  verificationCode: string
) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL,
        pass: process.env.PASSWORD,
      },
    });
    const verificationLink = `http://localhost:3000/auth/verify?verificationCode=${verificationCode}`;

    const info = await transporter.sendMail({
      from: `easypay<noreply@easypay.com>`,
      to: email,
      subject: "Verify Your Email for easypay",
      html: `
        <!DOCTYPE html>
        <html>
          <body style="color: black">
            <h2>Welcome to easypay!</h2>
            <p>Hi there,</p>
            <p>
              Thank you for signing up for our app. To get started, please click the button below to verify your email address:
            </p>
            <a href="${verificationLink}" style="background-color: black; color: white; padding: 10px 20px; text-decoration: none; display: inline-block; border-radius: 5px;">Verify Email</a>
            <p>Happy using our app!</p>
            <p>Best regards,</p>
            <p>easypay Team</p>
          </body>
        </html>
      `,
      contentType: "text/html",
    });

    console.log("Verification email sent:", info.response);
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
}
