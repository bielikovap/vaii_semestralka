import express from 'express';
import mongoose from 'mongoose';
import mongoSanitize from 'mongo-sanitize';  
import { Book } from '../models/bookModel.js';

const router = express.Router();

// nova kniha
router.post('/', async (request, response) => {
  try {
    const { title, author, publishYear, ISBN, description, longDescription, bookCover } = request.body;

    if (!title || !author || !publishYear || !ISBN || !description || !longDescription || !bookCover) {
      return response.status(400).send({
        message: 'Send all required fields: title, author, publishYear, ISBN, description, longDescription, bookCover',
      });
    }
    const sanitizedAuthor = mongoSanitize(author);
    const sanitizedBody = mongoSanitize({ title, author: sanitizedAuthor, publishYear, ISBN, description, longDescription, bookCover });

    if (!mongoose.Types.ObjectId.isValid(sanitizedAuthor)) {
      return response.status(400).send({
        message: 'Invalid author ID',
      });
    }

    const book = await Book.create(sanitizedBody);

    return response.status(201).send(book);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
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
//jedna kniha
router.get('/:id', async (request, response) => {
  try {
    const { id } = request.params;

    const sanitizedId = mongoSanitize(id);

    const book = await Book.findById(sanitizedId).populate('author', 'name bio');

    if (!book) {
      return response.status(404).json({ message: 'Book not found' });
    }

    return response.status(200).json(book);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// update knihy
router.put('/:id', async (request, response) => {
  try {
    const { id } = request.params;
    const { title, author, publishYear, ISBN, description, longDescription, bookCover } = request.body;

    if (!title || !author || !publishYear || !ISBN || !description || !longDescription || !bookCover) {
      return response.status(400).send({
        message: 'Send all required fields: title, author, publishYear, ISBN, description, longDescription bookCover',
      });
    }

    // Sanitize the ID and the request body
    const sanitizedId = mongoSanitize(id);
    const sanitizedAuthor = mongoSanitize(author);
    const sanitizedBody = mongoSanitize({ title, author: sanitizedAuthor, publishYear, ISBN, description, longDescription, bookCover });

    if (!mongoose.Types.ObjectId.isValid(sanitizedAuthor)) {
      return response.status(400).send({
        message: 'Invalid author ID',
      });
    }

    const updatedBook = await Book.findByIdAndUpdate(
      sanitizedId,
      sanitizedBody,
      { new: true }
    ).populate('author', 'name bio');

    if (!updatedBook) {
      return response.status(404).json({ message: 'Book not found' });
    }

    return response.status(200).json(updatedBook);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Delete a book by id
router.delete('/:id', async (request, response) => {
  try {
    const { id } = request.params;

    // Sanitize the ID parameter
    const sanitizedId = mongoSanitize(id);

    const result = await Book.findByIdAndDelete(sanitizedId);

    if (!result) {
      return response.status(404).json({ message: 'Book not found' });
    }

    return response.status(200).send({ message: 'Book deleted successfully' });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

export default router;
