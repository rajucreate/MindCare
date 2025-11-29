const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Update availability
router.post("/availability", async (req, res) => {
  try {
    const { email, availability } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.availability = availability;
    await user.save();

    res.json({ msg: "Availability updated", availability });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all therapists
router.get("/all", async (req, res) => {
  try {
    const therapists = await User.find({ role: "therapist" });

    res.json(therapists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
