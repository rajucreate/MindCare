const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sugguvaradaraju8@gmail.com",
    pass: "Raj17511800r"   // Google App Password
  }
});

module.exports = transporter;
