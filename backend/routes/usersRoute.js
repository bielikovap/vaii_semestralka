import express from 'express';
import mongoose from 'mongoose';
import { User } from '../models/userModel.js';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

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

//pridanie pouzivatela 
router.post('/', async (request, response) => {
  try {
    const { username, email, password, firstName, lastName, role } = request.body;

    if (!username || !email || !password || !firstName || !lastName || !role) {
      return response.status(400).send({
        message: 'Send all required fields: username, email, password, firstName, lastName, role',
      });
    }

    const user = await User.create({ username, email, password, firstName, lastName, role });

    return response.status(201).send(user);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
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
  router.get('/:id', async (request, response) => {
    try {
      const { id } = request.params;
  
      const user = await User.findById(id);
  
      if (!user) {
        return response.status(404).json({ message: 'User not found' });
      }
  
      return response.status(200).json(user);
    } catch (error) {
      console.log(error.message + "lalal");
      response.status(500).send({ message: error.message });
    }
  });

  //uprava pouzivatela podla id (ten isty zdroj co v userModel)
  router.put('/:id', async (request, response) => {
  try {
    const { id } = request.params;
    const { username, email, password, firstName, lastName, role } = request.body;

    if (!username || !email || !password || !firstName || !lastName) {
      return response.status(400).send({
        message: 'Send all required fields: username, email, password, firstName, lastName',
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return response.status(404).json({ message: 'User not found' });
    }

    user.username = username;
    user.email = email;
    user.password = password; 
    user.firstName = firstName;
    user.lastName = lastName;
    user.role = role;

    await user.save();
    return response.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

router.patch('/:id/profile-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { 
        profileImage: req.file.path 
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await Review.deleteMany({ user: req.params.id }); 
    await user.deleteOne(); 

    res.status(200).json({ message: 'User and associated reviews deleted' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Error deleting user and reviews' });
  }
});

export default router;