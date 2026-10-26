const mongoose = require("mongoose");

// One document = one event that people can register for
const EventModel = new mongoose.Schema(
  {
    seq: { type: Number, required: true, unique: true },
    eventId: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    venue: { type: String, required: true, trim: true },
    totalRegistrations: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", EventModel);
