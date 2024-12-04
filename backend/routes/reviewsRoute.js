import express from 'express';
import mongoose from 'mongoose';
import { Review } from '../models/reviewModel.js';
import { Book } from '../models/bookModel.js';

const router = express.Router();

// POST /reviews/:bookId
router.post('/:bookId/review', async (req, res) => {
    try {
      const { userId, rating, reviewText } = req.body;
      const { bookId } = req.params;
  
      if (!userId || !rating || !bookId) {
        return res.status(400).send({ message: 'User, rating, and book are required.' });
      }
  
      if (rating < 1 || rating > 5) {
        return res.status(400).send({ message: 'Rating must be between 1 and 5.' });
      }
  
      const book = await Book.findById(bookId);
      if (!book) {
        return res.status(404).send({ message: 'Book not found.' });
      }
  
      const newReview = new Review({
        user: userId,
        book: bookId,
        rating,
        reviewText
      });
  
      await newReview.save();
  
      return res.status(201).send(newReview);
    } catch (error) {
      console.log(error.message);
      return res.status(500).send({ message: error.message });
    }
  });
  

//recenzie pre knihu
router.get('/:bookId/reviews', async (req, res) => {
    try {
        const { bookId } = req.params;

        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).send({ message: 'Book not found.' });
        }

        const reviews = await Review.find({ book: bookId })
            .populate('user', 'username') // Populate the user's username
            .exec();

        return res.status(200).send({ reviews });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({ message: error.message });
    }
});
  
// konkretnu recenziu
router.get('/review/:reviewId', async (req, res) => {
    try {
        const { reviewId } = req.params;

        const review = await Review.findById(reviewId)
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
  
      if (rating && (rating < 1 || rating > 5)) {
        return res.status(400).send({ message: 'Rating must be between 1 and 5.' });
      }
  
      const updatedReview = await Review.findByIdAndUpdate(
        reviewId,
        { rating, reviewText },
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
  
     
      const deletedReview = await Review.findByIdAndDelete(reviewId);
  
      if (!deletedReview) {
        return res.status(404).send({ message: 'Review not found.' });
      }
  
      return res.status(200).send({ message: 'Review deleted successfully.' });
    } catch (error) {
      console.log(error.message);
      return res.status(500).send({ message: error.message });
    }
  });
  
  
export default router;