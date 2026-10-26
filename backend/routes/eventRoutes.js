const express = require("express");
const EventDoc = require("../models/EventModel");
const eventRouter = express.Router();

const ID_PREFIX = "EV-";
const FIRST_SEQ = 2001;

// list every event, nearest date first
eventRouter.get("/", async (req, res) => {
  try {
    const all = await EventDoc.find().sort({ date: 1 });
    res.json(all);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// fetch a single event (used to pre-fill the update form)
eventRouter.get("/:id", async (req, res) => {
  try {
    const found = await EventDoc.findById(req.params.id);
    if (!found) return res.status(404).json({ message: "No such event" });
    res.json(found);
  } catch (error) {
    res.status(400).json({ message: "That event id is not valid" });
  }
});

// add a new event and give it the next running id
eventRouter.post("/", async (req, res) => {
  try {
    const { name, description, date, venue } = req.body;
    if (!name || !description || !date || !venue) {
      return res.status(400).json({ message: "Please fill in every field" });
    }
    const latest = await EventDoc.findOne().sort({ seq: -1 });
    const nextSeq = latest ? latest.seq + 1 : FIRST_SEQ;
    const created = await EventDoc.create({
      seq: nextSeq,
      eventId: ID_PREFIX + nextSeq,
      name,
      description,
      date,
      venue,
    });
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// change an existing event
eventRouter.put("/:id", async (req, res) => {
  try {
    const { name, description, date, venue, totalRegistrations } = req.body;
    const changes = { name, description, date, venue };
    if (totalRegistrations !== undefined) changes.totalRegistrations = totalRegistrations;
    const saved = await EventDoc.findByIdAndUpdate(req.params.id, changes, {
      new: true,
      runValidators: true,
    });
    if (!saved) return res.status(404).json({ message: "No such event" });
    res.json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// remove an event for good
eventRouter.delete("/:id", async (req, res) => {
  try {
    const removed = await EventDoc.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: "No such event" });
    res.json({ message: "Event removed" });
  } catch (error) {
    res.status(400).json({ message: "That event id is not valid" });
  }
});

module.exports = eventRouter;
