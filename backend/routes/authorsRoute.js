import express from 'express';
import mongoSanitize from 'mongo-sanitize';  
import { Author } from '../models/authorModel.js';
import { Book } from '../models/bookModel.js';

const router = express.Router();

// novy autor 
router.post("/", async (req, res) => {
    console.log('POST /authors hit');
    try {
        const sanitizedBody = mongoSanitize(req.body);
        
        const newAuthor = await Author.create(sanitizedBody);
        res.status(201).json(newAuthor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// vsetci autori
router.get("/", async (req, res) => {
    try {
        const authors = await Author.find().populate('books');
        res.status(200).json(authors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// jeden autor podla id
router.get("/:id", async (req, res) => {
    try {
        const sanitizedId = mongoSanitize(req.params.id); 
        const author = await Author.findById(sanitizedId).populate('books');
        if (!author) {
            return res.status(404).json({ message: 'Author not found' });
        }
        res.status(200).json(author);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// update autora podla id 
router.put("/:id", async (req, res) => {
    try {
        const sanitizedId = mongoSanitize(req.params.id);  
        const sanitizedBody = mongoSanitize(req.body);      
        
        const updatedAuthor = await Author.findByIdAndUpdate(sanitizedId, sanitizedBody, {
            new: true,
            runValidators: true,
        });
        if (!updatedAuthor) {
            return res.status(404).json({ message: 'Author not found' });
        }
        res.status(200).json(updatedAuthor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// delete autora podla id
router.delete("/:id", async (req, res) => {
    try {
        const sanitizedId = mongoSanitize(req.params.id); 
        const booksDeleted = await Book.deleteMany({ author: sanitizedId });

        const deletedAuthor = await Author.findByIdAndDelete(sanitizedId);
        if (!deletedAuthor) {
            return res.status(404).json({ message: 'Author not found' });
        }
        if (!deletedAuthor) {
            return res.status(404).json({ message: 'Author not found' });
        }
        res.status(200).json({ message: 'Author deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
