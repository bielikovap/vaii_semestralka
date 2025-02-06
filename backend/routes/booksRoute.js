import express from 'express';
import mongoose from 'mongoose';
import mongoSanitize from 'mongo-sanitize';
import { body, param, validationResult } from 'express-validator';
import { Book } from '../models/bookModel.js';

const router = express.Router();

// Update the validateBook middleware with more specific validation
const validateBook = [
    body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
    body('author').isMongoId().withMessage('Valid author ID is required'),
    body('publishYear').isInt({ min: 1000, max: new Date().getFullYear() })
        .withMessage('Invalid publish year'),
    body('ISBN').matches(/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/)
        .withMessage('Invalid ISBN format'),
    body('description').trim().isLength({ min: 1 })
        .withMessage('Description is required'),
    body('longDescription').trim().isLength({ min: 1 })
        .withMessage('Long description is required'),
    body('bookCover').isURL().withMessage('Valid book cover URL is required')
];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

//nova kniha
router.post('/', validateBook, validate, async (req, res) => {
    try {
        const book = await Book.create(mongoSanitize(req.body));
        res.status(201).json(book);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//vsetky
router.get('/', async (request, response) => {
  try {
    const books = await Book.find({})
      .populate('author', 'name bio')
      .exec();

    return response.status(200).json({
      count: books.length,
      data: books,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

//jedna kniha podla id
router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(mongoSanitize(req.params.id))
            .populate('author', 'name bio');
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update the PUT route to handle the request properly
router.put('/:id', [
    param('id').isMongoId().withMessage('Invalid book ID'),
    ...validateBook
], validate, async (req, res) => {
    try {
        const sanitizedId = mongoSanitize(req.params.id);
        const sanitizedBody = mongoSanitize(req.body);

        // Log the sanitized data for debugging
        console.log('Sanitized ID:', sanitizedId);
        console.log('Sanitized Body:', sanitizedBody);

        // Check if the book exists first
        const existingBook = await Book.findById(sanitizedId);
        if (!existingBook) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Update the book
        const book = await Book.findByIdAndUpdate(
            sanitizedId,
            sanitizedBody,
            { 
                new: true,
                runValidators: true
            }
        ).populate('author', 'name bio');

        res.status(200).json(book);
    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({ 
            message: error.message,
            details: error.errors 
        });
    }
});

//delete knihy podla id
router.delete('/:id', async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(mongoSanitize(req.params.id));
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
