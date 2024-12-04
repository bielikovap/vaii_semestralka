import mongoose from 'mongoose';


const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book', 
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  reviewText: {
    type: String,
    required: false,// Maximum length for review text (optional)
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Automatically update the `updatedAt` field when the document is modified
reviewSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export const Review = mongoose.model('Review', reviewSchema);