import express from 'express';
import { Suggestion } from '../models/suggestionModel.js';   
import sanitize from 'mongo-sanitize';

const router = express.Router();
// Create a new suggestion
router.post("/", async (req, res) => {
  try {
    const { suggestion, type, submittedBy } = req.body;

    if (!suggestion || !type) {
      return res.status(400).json({ error: "Suggestion and type are required." });
    }

    const newSuggestion = new Suggestion({
      suggestion,
      type,
      submittedBy: submittedBy || null
    });

    await newSuggestion.save();
    res.status(201).json(newSuggestion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all suggestions (optional: filter by status or type)
router.get("/", async (req, res) => {
  try {
    const { status, type } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (type) filter.type = type;

    const suggestions = await Suggestion.find(filter).populate("submittedBy", "username"); // Populate username if available
    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update suggestion status (approve/reject)
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status." });
    }

    const updatedSuggestion = await Suggestion.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedSuggestion) {
      return res.status(404).json({ error: "Suggestion not found." });
    }

    res.json(updatedSuggestion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a suggestion
router.delete("/:id", async (req, res) => {
  try {
    const deletedSuggestion = await Suggestion.findByIdAndDelete(req.params.id);
    if (!deletedSuggestion) {
      return res.status(404).json({ error: "Suggestion not found." });
    }

    res.json({ message: "Suggestion deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;