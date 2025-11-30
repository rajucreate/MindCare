const express = require("express");
const router = express.Router();
const Session = require("../models/Session");
const User = require("../models/User");

/* ---------------------------
    BOOK A SESSION (Student)
----------------------------*/
router.post("/book", async (req, res) => {
  try {
    const { studentId, therapistId, date, time, mode, reason } = req.body;

    const therapist = await User.findById(therapistId);

    if (!therapist) return res.status(404).json({ msg: "Therapist not found" });

    if (!therapist.availability)
      return res.status(400).json({ msg: "Therapist is currently not available" });

    const session = new Session({
      studentId,
      therapistId,
      date,
      time,
      mode,
      reason,
    });

    await session.save();

    res.json({ msg: "Session request sent", session });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* ---------------------------
  GET SESSIONS FOR STUDENT
----------------------------*/
router.get("/student/:id", async (req, res) => {
  try {
    const sessions = await Session.find({ studentId: req.params.id })
      .populate("therapistId", "name email")
      .sort({ createdAt: -1 });

    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* ---------------------------
  GET SESSIONS FOR THERAPIST
----------------------------*/
router.get("/therapist/:id", async (req, res) => {
  try {
    const sessions = await Session.find({ therapistId: req.params.id })
      .populate("studentId", "name email")
      .sort({ createdAt: -1 });

    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* ---------------------------
  UPDATE SESSION STATUS
----------------------------*/
router.post("/update-status", async (req, res) => {
  try {
    const { sessionId, status, therapistNote } = req.body;

    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ msg: "Session not found" });

    session.status = status;
    if (therapistNote) session.therapistNote = therapistNote;

    await session.save();

    res.json({ msg: "Status updated", session });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
