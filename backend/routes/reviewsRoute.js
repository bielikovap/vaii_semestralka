import express from 'express';
import { Review } from '../models/reviewModel.js';
import { Book } from '../models/bookModel.js';
import sanitize from 'mongo-sanitize';

const router = express.Router();

// GET all reviews
router.get('/', async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate('user', 'username')
            .populate('book', 'title');
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET reviews by bookId
router.get('/book/:bookId', async (req, res) => {
    try {
        const bookId = sanitize(req.params.bookId);
        
        // Validate book exists
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Find all reviews for the book
        const reviews = await Review.find({ book: bookId })
            .populate('user', 'username')
            .sort({ createdAt: -1 });

        res.status(200).json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ message: error.message });
    }
});

// GET reviews by userId
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

// GET review by ID
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

// POST new review
router.post('/', async (req, res) => {
    try {
        const { user, book, rating, reviewText } = req.body;
        
        if (!user || !book || !rating) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const review = new Review({
            user,
            book,
            rating,
            reviewText,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        const savedReview = await review.save();
        await Book.findByIdAndUpdate(book, {
            $push: { reviews: savedReview._id }
        });

        res.status(201).json(savedReview);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT update review
router.put('/:id', async (req, res) => {
    try {
        const { rating, reviewText } = req.body;
        const reviewId = sanitize(req.params.id);

        const updatedReview = await Review.findByIdAndUpdate(
            reviewId,
            {
                rating,
                reviewText,
                updatedAt: new Date()
            },
            { new: true }
        );

        if (!updatedReview) {
            return res.status(404).json({ message: 'Review not found' });
        }

        res.status(200).json(updatedReview);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE review
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
        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;