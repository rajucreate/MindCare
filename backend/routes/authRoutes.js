const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const crypto = require("crypto");
const transporter = require("../config/nodemailer");

/* ============================================
   SIGNUP (NO EMAIL VERIFICATION)
============================================ */
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    let user = await User.findOne({ email });
    if (user)
      return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      isVerified: true    // 👈 always verified
    });

    await user.save();

    res.json({ msg: "Signup successful! You can now log in." });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});


/* ============================================
   LOGIN (NO VERIFICATION REQUIRED)
============================================ */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid email or password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        availability: user.availability
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* ============================================
   FORGOT PASSWORD → send reset link
============================================ */
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ msg: "Email not found" });

  const token = crypto.randomBytes(32).toString("hex");

  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
  await user.save();

  const resetURL = `${process.env.CLIENT_URL}/reset-password/${token}`;

  await transporter.sendMail({
    to: email,
    subject: "Reset Password | MindCare",
    html: `
      <h3>Password Reset Request</h3>
      <p>Click this link to reset your password:</p>
      <a href="${resetURL}">${resetURL}</a>
      <p>This link expires in 15 minutes.</p>
    `
  });

  res.json({ msg: "Reset link sent to email" });
});


/* ============================================
   RESET PASSWORD (final step)
============================================ */
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ msg: "Invalid or expired reset token" });

  const hashedPassword = await bcrypt.hash(password, 10);

  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  res.json({ msg: "Password reset successful" });
});


module.exports = router;
