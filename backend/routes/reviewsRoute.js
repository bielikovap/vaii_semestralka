import express from 'express';
import mongoose from 'mongoose';
import { Review } from '../models/reviewModel.js';
import { Book } from '../models/bookModel.js';
import { User } from '../models/userModel.js';
import sanitize from 'mongo-sanitize';

const router = express.Router();

// jedna kniha
router.get('/:bookId/reviews', async (req, res) => {
    try {
        const { bookId } = req.params;
        const sanitizedBookId = sanitize(bookId);

        console.log(`Fetching reviews for bookId: ${sanitizedBookId}`);
        const book = await Book.findById(sanitizedBookId);
        if (!book) {
            return res.status(404).send({ message: 'Book not found.' });
        }

        const reviews = await Review.find({ book: sanitizedBookId })
            .populate('user', 'username')
            .exec();

        return res.status(200).send({ reviews });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({ message: error.message });
    }
});

router.get('/review/:reviewId', async (req, res) => {
    try {
        const { reviewId } = req.params;

        const sanitizedReviewId = sanitize(reviewId);

        const review = await Review.findById(sanitizedReviewId)
            .populate('user', 'username')
            .populate('book', 'title author')
            .exec();

        if (!review) {
            return res.status(404).send({ message: 'Review not found.' });
        }

        return res.status(200).send({ review });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({ message: error.message });
    }
});

router.put('/:reviewId', async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { rating, reviewText } = req.body;

        const sanitizedRating = sanitize(rating);
        const sanitizedReviewText = sanitize(reviewText);

        if (sanitizedRating && (sanitizedRating < 1 || sanitizedRating > 5)) {
            return res.status(400).send({ message: 'Rating must be between 1 and 5.' });
        }

        const updatedReview = await Review.findByIdAndUpdate(
            reviewId,
            { rating: sanitizedRating, reviewText: sanitizedReviewText },
            { new: true }
        );

        if (!updatedReview) {
            return res.status(404).send({ message: 'Review not found.' });
        }

        return res.status(200).send({ updatedReview });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({ message: error.message });
    }
});

router.delete('/:reviewId', async (req, res) => {
    try {
        const { reviewId } = req.params;

        const sanitizedReviewId = sanitize(reviewId);

        const deletedReview = await Review.findByIdAndDelete(sanitizedReviewId);

        if (!deletedReview) {
            return res.status(404).send({ message: 'Review not found.' });
        }

        return res.status(200).send({ message: 'Review deleted successfully.' });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({ message: error.message });
    }
});

router.post('books/:bookId/reviews', async (req, res) => {
    try {
        const { user, rating, reviewText } = req.body;
        const { bookId } = req.params;

        const sanitizedRating = sanitize(rating);
        const sanitizedReviewText = sanitize(reviewText);
        const sanitizedBookId = sanitize(bookId);

        if (!sanitizedRating || !sanitizedReviewText.trim()) {
            return res.status(400).send({ message: 'Rating and review text are required.' });
        }

        if (sanitizedRating < 1 || sanitizedRating > 5) {
            return res.status(400).send({ message: 'Rating must be between 1 and 5.' });
        }

        const book = await Book.findById(sanitizedBookId);
        if (!book) {
            return res.status(404).send({ message: 'Book not found.' });
        }

        const userFound = await User.findById(user);
        if (!userFound) {
            return res.status(404).send({ message: 'User not found.' });
        }

        const existingReview = await Review.findOne({ user, book: sanitizedBookId });
        if (existingReview) {
            return res.status(400).send({ message: 'User has already reviewed this book.' });
        }

        const newReview = new Review({
            user: userFound._id,
            book: sanitizedBookId,
            rating: sanitizedRating,
            reviewText: sanitizedReviewText
        });

        await newReview.save();

        return res.status(201).send(newReview);
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({ message: error.message });
    }
});

export default router;
