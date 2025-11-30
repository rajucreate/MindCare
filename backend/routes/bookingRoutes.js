const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const User = require("../models/User");

/**
 * Helpers
 */

// Parse "YYYY-MM-DD" and "HH:MM" into a Date (local)
function makeDateTime(dateStr, timeStr) {
  // dateStr "2025-12-01", timeStr "09:30"
  const [year, month, day] = dateStr.split("-").map(Number);
  const [hour, minute] = timeStr.split(":").map(Number);
  // monthIndex is zero-based
  return new Date(year, month - 1, day, hour, minute, 0, 0);
}

function addMinutes(dt, minutes) {
  return new Date(dt.getTime() + minutes * 60000);
}

// check conflict: returns true if conflict found
async function hasConflict(therapistId, start, end) {
  // any booking overlapping start..end (status not rejected)
  const conflict = await Booking.findOne({
    therapistId,
    status: { $nin: ["rejected"] },
    $or: [
      { start: { $lt: end }, end: { $gt: start } } // overlapping intervals
    ]
  });
  return !!conflict;
}

/**
 * GET available slots for therapist on a date
 * Query: GET /api/booking/therapist/:id/available?date=YYYY-MM-DD
 */
router.get("/therapist/:id/available", async (req, res) => {
  try {
    const therapistId = req.params.id;
    const date = req.query.date; // required
    if (!date) return res.status(400).json({ msg: "date query required (YYYY-MM-DD)" });

    const therapist = await User.findById(therapistId);
    if (!therapist) return res.status(404).json({ msg: "Therapist not found" });
    if (!therapist.availability) return res.json({ slots: [] }); // global off

    const day = new Date(date).getDay(); // 0..6
    const dayEntry = (therapist.weeklyAvailability || []).find(d => d.day === day);
    if (!dayEntry || !Array.isArray(dayEntry.slots)) return res.json({ slots: [] });

    // Filter slots by existing bookings
    const available = [];
    for (const timeStr of dayEntry.slots) {
      const start = makeDateTime(date, timeStr);
      const end = addMinutes(start, 60); // default slot 60 min, modify if needed

      const conflict = await Booking.findOne({
        therapistId,
        dateString: date,
        status: { $ne: "rejected" },
        $or: [
          { start: { $lt: end }, end: { $gt: start } }
        ]
      });

      if (!conflict) available.push(timeStr);
    }

    res.json({ date, slots: available });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


/**
 * POST create booking (student)
 * POST /api/booking/create
 * Body: { studentId, therapistId, date: "YYYY-MM-DD", time: "HH:MM", durationMinutes?, mode, reason }
 */
router.post("/create", async (req, res) => {
  try {
    const { studentId, therapistId, date, time, durationMinutes = 60, mode, reason } = req.body;
    if (!studentId || !therapistId || !date || !time || !mode) {
      return res.status(400).json({ msg: "missing required fields" });
    }

    const therapist = await User.findById(therapistId);
    if (!therapist) return res.status(404).json({ msg: "Therapist not found" });
    if (!therapist.availability) return res.status(400).json({ msg: "Therapist not available" });

    // check that the time exists in weeklyAvailability for that day
    const day = new Date(date).getDay();
    const dayEntry = (therapist.weeklyAvailability || []).find(d => d.day === day);
    if (!dayEntry || !dayEntry.slots.includes(time)) {
      return res.status(400).json({ msg: "Selected time is not in therapist availability" });
    }

    const start = makeDateTime(date, time);
    const end = addMinutes(start, durationMinutes);

    // conflict check
    const conflict = await Booking.findOne({
      therapistId,
      dateString: date,
      status: { $ne: "rejected" },
      $or: [
        { start: { $lt: end }, end: { $gt: start } }
      ]
    });

    if (conflict) return res.status(400).json({ msg: "Selected slot is already booked" });

    const booking = new Booking({
      studentId,
      therapistId,
      start,
      end,
      dateString: date,
      timeString: time,
      durationMinutes,
      mode,
      reason,
      status: "pending"
    });

    await booking.save();

    res.json({ msg: "Booking created", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/set-availability", async (req, res) => {
  try {
    const { therapistId, weeklyAvailability } = req.body;

    const therapist = await User.findById(therapistId);
    if (!therapist) return res.status(404).json({ msg: "Therapist not found" });

    therapist.weeklyAvailability = weeklyAvailability;
    therapist.availability = true;

    await therapist.save();

    res.json({ msg: "Availability updated", weeklyAvailability });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET bookings for therapist
 * GET /api/booking/therapist/:id
 */
router.get("/therapist/:id", async (req, res) => {
  try {
    const therapistId = req.params.id;
    const bookings = await Booking.find({ therapistId })
      .populate("studentId", "name email")
      .sort({ start: -1 });
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


/**
 * GET bookings for student
 * GET /api/booking/student/:id
 */
router.get("/student/:id", async (req, res) => {
  try {
    const studentId = req.params.id;
    const bookings = await Booking.find({ studentId })
      .populate("therapistId", "name email")
      .sort({ start: -1 });
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


/**
 * PATCH update booking status (therapist approves / rejects / reschedule)
 * PATCH /api/booking/update-status
 * Body: { bookingId, status, therapistNote, newDate?, newTime? }
 */
router.patch("/update-status", async (req, res) => {
  try {
    const { bookingId, status, therapistNote, newDate, newTime } = req.body;
    if (!bookingId || !status) return res.status(400).json({ msg: "bookingId and status required" });

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ msg: "Booking not found" });

    if (status === "reschedule_requested") {
      // therapist suggests new time (check conflict)
      if (!newDate || !newTime) return res.status(400).json({ msg: "newDate and newTime required for reschedule" });

      const therapist = await User.findById(booking.therapistId);
      const day = new Date(newDate).getDay();
      const dayEntry = (therapist.weeklyAvailability || []).find(d => d.day === day);
      if (!dayEntry || !dayEntry.slots.includes(newTime)) {
        return res.status(400).json({ msg: "new time is not in therapist availability" });
      }

      const newStart = makeDateTime(newDate, newTime);
      const newEnd = addMinutes(newStart, booking.durationMinutes);

      const conflict = await Booking.findOne({
        therapistId: booking.therapistId,
        status: { $ne: "rejected" },
        _id: { $ne: booking._id },
        $or: [
          { start: { $lt: newEnd }, end: { $gt: newStart } }
        ]
      });

      if (conflict) return res.status(400).json({ msg: "new slot conflicts with existing booking" });

      booking.start = newStart;
      booking.end = newEnd;
      booking.dateString = newDate;
      booking.timeString = newTime;
      booking.status = "reschedule_requested";
      if (therapistNote) booking.therapistNote = therapistNote;
      await booking.save();
      return res.json({ msg: "Reschedule requested", booking });
    }

    // Approve / Reject / Completed
    booking.status = status;
    if (therapistNote) booking.therapistNote = therapistNote;
    await booking.save();

    res.json({ msg: "Booking status updated", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
