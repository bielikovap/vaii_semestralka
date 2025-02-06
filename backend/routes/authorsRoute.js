import express from 'express';
import mongoSanitize from 'mongo-sanitize';
import { body, param, validationResult } from 'express-validator';
import { Author } from '../models/authorModel.js';
import { Book } from '../models/bookModel.js';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const router = express.Router();

// Cloudinary configuration
cloudinary.config({
  cloud_name: 'dtcdmwn9z',
  api_key: '687785583695473',
  api_secret: 'SKSrdmTCA0h2c1UiUGoCkdpfr1c'
});

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'author_images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  }
});

const upload = multer({ storage: storage });

// Validation middleware
const validateAuthor = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('bio').optional().trim().isLength({ max: 2000 })
    .withMessage('Bio must not exceed 2000 characters'),
  body('dateOfBirth').optional().isISO8601().toDate()
    .withMessage('Invalid date format')
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Create author
router.post("/", validateAuthor, validate, upload.single('image'), async (req, res) => {
  try {
    const authorData = {
      name: mongoSanitize(req.body.name),
      bio: mongoSanitize(req.body.bio),
      dateOfBirth: req.body.dateOfBirth
    };

    if (req.file) {
      authorData.profileImage = req.file.path;
    }

    const author = await Author.create(authorData);
    res.status(201).json(author);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all authors
router.get("/", async (req, res) => {
  try {
    const authors = await Author.find().populate('books');
    res.status(200).json(authors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get author by ID
router.get("/:id", async (req, res) => {
  try {
    const author = await Author.findById(mongoSanitize(req.params.id))
      .populate('books');
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }
    res.status(200).json(author);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update author
router.put("/:id", validateAuthor, validate, upload.single('image'), async (req, res) => {
  try {
    const updateData = {
      name: mongoSanitize(req.body.name),
      bio: mongoSanitize(req.body.bio),
      dateOfBirth: req.body.dateOfBirth
    };

    if (req.file) {
      updateData.profileImage = req.file.path;
    }

    const author = await Author.findByIdAndUpdate(
      mongoSanitize(req.params.id),
      updateData,
      { new: true, runValidators: true }
    ).populate('books');

    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    res.status(200).json(author);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete author
router.delete("/:id", async (req, res) => {
  try {
    const sanitizedId = mongoSanitize(req.params.id);
    await Book.deleteMany({ author: sanitizedId });
    const deletedAuthor = await Author.findByIdAndDelete(sanitizedId);

    if (!deletedAuthor) {
      return res.status(404).json({ message: 'Author not found' });
    }

    res.status(200).json({ message: 'Author and associated books deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add this new route for handling image updates
router.patch("/:id/image", [
  param('id').isMongoId()
], validate, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const author = await Author.findByIdAndUpdate(
      mongoSanitize(req.params.id),
      { profileImage: req.file.path },
      { new: true, runValidators: true }
    );

    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    res.status(200).json(author);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update the existing PATCH route for other author details
router.patch("/:id", validateAuthor, validate, async (req, res) => {
  try {
    const updateData = {
      name: mongoSanitize(req.body.name),
      bio: mongoSanitize(req.body.bio)
    };

    const author = await Author.findByIdAndUpdate(
      mongoSanitize(req.params.id),
      updateData,
      { new: true, runValidators: true }
    ).populate('books');

    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    res.status(200).json(author);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
