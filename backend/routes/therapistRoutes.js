const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/authMiddleware"); // JWT protect

/** ----------------------------------------
 *  GET all therapists
 *  GET /api/therapist/all
 * ---------------------------------------- */
router.get("/all", async (req, res) => {
  try {
    const therapists = await User.find(
      { role: "therapist" },
      "-password" // don't send password
    );
    res.json(therapists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/** ----------------------------------------
 *  UPDATE therapist online/offline availability
 *  PATCH /api/therapist/status
 *  Body: { availability: true/false }
 * ---------------------------------------- */
router.patch("/status", auth, async (req, res) => {
  try {
    const therapistId = req.user.id;
    const { availability } = req.body;

    const user = await User.findById(therapistId);
    if (!user || user.role !== "therapist")
      return res.status(403).json({ msg: "Not a therapist" });

    user.availability = availability;
    await user.save();

    res.json({ msg: "Status updated", availability });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/** ----------------------------------------
 *  GET weekly availability
 *  GET /api/therapist/:id/weekly-availability
 * ---------------------------------------- */
router.get("/:id/weekly-availability", async (req, res) => {
  try {
    const therapist = await User.findById(req.params.id);

    if (!therapist || therapist.role !== "therapist") {
      return res.status(404).json({ msg: "Therapist not found" });
    }

    res.json({ weeklyAvailability: therapist.weeklyAvailability });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// fetch for current logged-in therapist
router.get("/me/weekly-availability", auth, async (req, res) => {
  try {
    const therapist = await User.findById(req.user.id);
    if (!therapist || therapist.role !== "therapist") return res.status(403).json({ msg: "Not a therapist" });
    res.json({ weeklyAvailability: therapist.weeklyAvailability });
  } catch (err) { res.status(500).json({ error: err.message }); }
});


router.patch("/weekly-availability", auth, async (req, res) => {
  try {
    const therapistId = req.user.id;
    const { weeklyAvailability } = req.body;

    const user = await User.findById(therapistId);

    if (!user || user.role !== "therapist") {
      return res.status(403).json({ msg: "Not a therapist" });
    }

    user.weeklyAvailability = weeklyAvailability;
    await user.save();

    res.json({ msg: "Weekly availability updated", weeklyAvailability });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
