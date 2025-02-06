import express from 'express';
import { Review } from '../models/reviewModel.js';
import { Book } from '../models/bookModel.js';
import sanitize from 'mongo-sanitize';

const router = express.Router();

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

router.get('/book/:bookId', async (req, res) => {
    try {
        const reviews = await Review.find({ book: req.params.bookId })
            .populate('user', 'username profileImage _id')
            .populate('book', 'title')
            .exec();

        console.log('Fetched reviews:', reviews); // Debug log
        res.json(reviews);
    } catch (error) {
        console.error('Error in /book/:bookId route:', error);
        res.status(500).json({ 
            message: 'Error fetching reviews',
            error: error.message 
        });
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