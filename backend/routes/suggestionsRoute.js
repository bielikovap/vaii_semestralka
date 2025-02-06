import express from 'express';
import { Suggestion } from '../models/suggestionModel.js';   
import sanitize from 'mongo-sanitize';
import { body, param, validationResult } from 'express-validator';

const router = express.Router();

const validateSuggestion = [
    body('suggestion').trim().isLength({ min: 1, max: 1000 }).escape(),
    body('type').isIn(['book', 'author', 'feature']),
    body('submittedBy').optional().isMongoId()
];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

router.post("/", validateSuggestion, validate, async (req, res) => {
    try {
        const cleanData = sanitize(req.body);
        const newSuggestion = new Suggestion(cleanData);
        await newSuggestion.save();
        res.status(201).json(newSuggestion);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const { status, type } = sanitize(req.query);
        const filter = {};

        if (status) filter.status = status;
        if (type) filter.type = type;

        const suggestions = await Suggestion.find(filter)
            .populate("submittedBy", "username");
        res.json(suggestions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.patch("/:id/status", [
    param('id').isMongoId(),
    body('status').isIn(['pending', 'approved', 'rejected'])
], validate, async (req, res) => {
    try {
        const cleanId = sanitize(req.params.id);
        const cleanStatus = sanitize(req.body.status);

        const updatedSuggestion = await Suggestion.findByIdAndUpdate(
            cleanId,
            { status: cleanStatus },
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

router.delete("/:id", [
    param('id').isMongoId()
], validate, async (req, res) => {
    try {
        const cleanId = sanitize(req.params.id);
        const deletedSuggestion = await Suggestion.findByIdAndDelete(cleanId);
        
        if (!deletedSuggestion) {
            return res.status(404).json({ error: "Suggestion not found." });
        }

        res.json({ message: "Suggestion deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;