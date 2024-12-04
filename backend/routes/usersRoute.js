import express from 'express';
import mongoose from 'mongoose';
import { User } from '../models/userModel.js';
import { Review } from '../models/reviewModel.js';
import bcrypt from 'bcryptjs'; // hashovanie hesla
import jwt from 'jsonwebtoken'; // autentifikacia

const router = express.Router();


//pridanie pouzivatela (zatial bez overenia???)
router.post('/', async (request, response) => {
    try {
      const { username, email, password, firstName, lastName, role} = request.body;
  
      if (!username || !email || !password || !firstName || !lastName || !role) {
        return response.status(400).send({
          message: 'Send all required fields: username, email, password, firstName, lastName, role',
        });
      }
      
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = {
        username, 
        email, 
        password: hashedPassword, 
        firstName, 
        lastName, 
        role
      };
  
      const user = await User.create(newUser);
  
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
          path: 'book', // Populate book details within reviews
          select: 'title author', // Include specific fields of the Book model
        },
        select: 'rating reviewText createdAt', // Include specific fields of the Review model
      });
  
      // Add review count for each user
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
      console.log(error.message);
      response.status(500).send({ message: error.message });
    }
  });

  //uprava pouzivatela podla id + salt pred hashovanim hesla
  router.put('/:id', async (request, response) => {
    try {
      const { id } = request.params;
      const { username, email, password, firstName, lastName, role } = request.body;
  
      if (!username || !email || !password || !firstName || !lastName) {
        return response.status(400).send({
          message: 'Send all required fields: username, email, password, firstName, lastName',
        });
      }
  
      //????
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { username, email, password: hashedPassword, firstName, lastName, role },
        { new: true } 
      );
  
      if (!updatedUser) {
        return response.status(404).json({ message: 'User not found' });
      }
  
      return response.status(200).json(updatedUser);
    } catch (error) {
      console.log(error.message);
      response.status(500).send({ message: error.message });
    }
  });

//delete pouzivatela podla id
  router.delete('/:id', async (request, response) => {
    try {
      const { id } = request.params;
  
      const result = await User.findByIdAndDelete(id);
  
      if (!result) {
        return response.status(404).json({ message: 'User not found' });
      }
  
      return response.status(200).send({ message: 'User deleted successfully' });
    } catch (error) {
      console.log(error.message);
      response.status(500).send({ message: error.message });
    }
  });

export default router;