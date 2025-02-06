import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';
import mongoSanitize from 'mongo-sanitize'; 

const router = express.Router();

router.post("/", async (req, res) => {
    console.log("Login attempt received with data:", req.body);
    const { email, password } = req.body;

    try {

        const user = await User.findOne({ email });
        console.log("User found:", user);

        if (!user) {
            console.log("User not found");
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password match:", isMatch);

        if (!isMatch) {
            console.log("Password mismatch");
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ userId: user._id, role: user.role }, 'your_jwt_secret', {
            expiresIn: '1h',
        });

        res.json({ token });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
