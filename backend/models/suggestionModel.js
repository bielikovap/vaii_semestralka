import mongoose from 'mongoose';

const suggestionSchema = new mongoose.Schema({
  suggestion: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ["book", "author", "webpage"],
    required: true
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null  
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Suggestion = mongoose.model('Suggestion', suggestionSchema);
