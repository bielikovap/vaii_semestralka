import mongoose from 'mongoose';

const authorSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: false,
      maxlength: 2000,
    },
    dateOfBirth: {
      type: Date,
      required: false,
    },
    profilePicture: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);


authorSchema.virtual('books', {
  ref: 'Book', 
  localField: '_id', 
  foreignField: 'author', 
});

export const Author = mongoose.model('Author', authorSchema);