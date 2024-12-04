import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,  
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, 
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    password: {
      type: String,
      required: true,
      minlength: 6, 
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'], 
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

userSchema.virtual('reviews', {
  ref: 'Review', 
  localField: '_id', 
  foreignField: 'user',  
  justOne: false  
});

userSchema.set('toJSON', {
  virtuals: true,
});
userSchema.set('toObject', {
  virtuals: true,
});

export const User = mongoose.model('User', userSchema);