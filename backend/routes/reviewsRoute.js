import express from 'express';
import { Review } from '../models/reviewModel.js';
import { Book } from '../models/bookModel.js';
import sanitize from 'mongo-sanitize';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Basic validation middleware
const validateReview = [
    body('user').isMongoId(),
    body('book').isMongoId(),
    body('rating').isInt({ min: 1, max: 5 }),
    body('reviewText').trim().isLength({ min: 1, max: 1000 })
];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Routes with sanitization
router.get('/', async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate('user', 'username')
            .populate('book', 'title');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/book/:bookId', async (req, res) => {
    try {
        const reviews = await Review.find({ book: sanitize(req.params.bookId) })
            .populate('user', 'username profileImage')
            .populate('book', 'title');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/user/:userId', async (req, res) => {
    try {
        const userId = sanitize(req.params.userId);
        
        const reviews = await Review.find({ user: userId })
            .populate('book', 'title')
            .sort({ createdAt: -1 });

        if (!reviews) {
            return res.status(404).json({ message: 'No reviews found for this user' });
        }

        res.status(200).json(reviews);
    } catch (error) {
        console.error('Error fetching user reviews:', error);
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const review = await Review.findById(sanitize(req.params.id))
            .populate('user', 'username')
            .populate('book', 'title');
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', validateReview, validate, async (req, res) => {
    try {
        const cleanData = sanitize(req.body);
        const review = new Review({
            ...cleanData,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        
        const savedReview = await review.save();
        await Book.findByIdAndUpdate(cleanData.book, {
            $push: { reviews: savedReview._id }
        });
        
        res.status(201).json(savedReview);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id', validateReview, validate, async (req, res) => {
    try {
        const cleanData = sanitize(req.body);
        const updatedReview = await Review.findByIdAndUpdate(
            sanitize(req.params.id),
            {
                ...cleanData,
                updatedAt: new Date()
            },
            { new: true }
        );
        
        if (!updatedReview) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.json(updatedReview);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const review = await Review.findById(sanitize(req.params.id));
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        
        await Book.findByIdAndUpdate(review.book, {
            $pull: { reviews: review._id }
        });
        await Review.findByIdAndDelete(review._id);
        
        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;