const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendVerificationEmail(email, token) {
  const verifyUrl = `${process.env.BASE_URL}/verify/${token}`;

  await transporter.sendMail({
    from: `"MindCare" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify Your MindCare Account",
    html: `
      <h2>Verify your email</h2>
      <p>Click the button below to activate your account:</p>
      <a href="${verifyUrl}">
        <button style="padding:10px 20px;background:#4caf50;color:white;border:none;border-radius:5px;cursor:pointer;">
          Verify Email
        </button>
      </a>
      <p>Or open this link manually:</p>
      <p>${verifyUrl}</p>
    `
  });
}

module.exports = sendVerificationEmail;
