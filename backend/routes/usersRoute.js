import express from 'express';
import mongoose from 'mongoose';
import { User } from '../models/userModel.js';
import { Review } from '../models/reviewModel.js';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import sanitize from 'mongo-sanitize';
import { body, param, validationResult } from 'express-validator';

const router = express.Router();

cloudinary.config({
  cloud_name: 'dtcdmwn9z',
  api_key: 	'687785583695473',  
  api_secret: 'SKSrdmTCA0h2c1UiUGoCkdpfr1c'
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'profile_pictures',
    allowed_formats: ['jpg', 'jpeg', 'png']
  }
});

const upload = multer({ storage: storage });

// Validation middleware
const validateUser = [
    body('username').trim().isLength({ min: 3 }).escape(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('firstName').trim().isLength({ min: 2 }).escape(),
    body('lastName').trim().isLength({ min: 2 }).escape(),
    body('role').isIn(['user', 'admin'])
];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

//pridanie pouzivatela 
router.post('/', validateUser, validate, async (req, res) => {
  try {
    const cleanData = sanitize(req.body);
    const user = await User.create(cleanData);
    return res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
  
  //vsetci pouzivatelia
  router.get('/', async (req, res) => {
    try {
      const users = await User.find().populate({
        path: 'reviews',
        populate: {
          path: 'book', 
          select: 'title author', 
        },
        select: 'rating reviewText createdAt', 
      });
  
      //pocet recenzii na uzivatela
      const usersWithReviewCounts = users.map((user) => ({
        ...user.toObject(),
        reviewCount: user.reviews.length,
      }));
  
      return res.status(200).send({
        count: usersWithReviewCounts.length,
        data: usersWithReviewCounts,
      });
    } catch (error) {
      console.error(error.message);
      return res.status(500).send({ message: 'Error fetching users with reviews' });
    }
  });
  
  
  //jeden pouzivatel podla id
  router.get('/:id', [param('id').isMongoId()], validate, async (req, res) => {
    try {
      const user = await User.findById(sanitize(req.params.id));
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  //uprava pouzivatela podla id (ten isty zdroj co v userModel)
  router.put('/:id', [
    param('id').isMongoId(),
    ...validateUser
], validate, async (req, res) => {
  try {
    const cleanData = sanitize(req.body);
    const user = await User.findByIdAndUpdate(
        sanitize(req.params.id),
        cleanData,
        { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch('/:id/profile-image', [
  param('id').isMongoId()
], validate, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    
    const user = await User.findByIdAndUpdate(
        sanitize(req.params.id),
        { profileImage: req.file.path },
        { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', [param('id').isMongoId()], validate, async (req, res) => {
  try {
    const cleanId = sanitize(req.params.id);
    const user = await User.findById(cleanId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await Review.deleteMany({ user: cleanId });
    await user.deleteOne();

    res.status(200).json({ message: 'User and associated reviews deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;