import mongoose from 'mongoose';

const bookSchema = mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
      },
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author', 
        required: true,
      },
      publishYear: {
        type: Number,
        required: true,
      },
      ISBN: {
        type: Number,
        required: true,
        minlength: 10,
        maxlength: 13,
      },
      description: {
        type: String,
        required: true,
        maxlength: 250,
      },
      longDescription: {
        type: String,
        required: true,
        maxlength: 2000
      },
      bookCover: {
        type: String,
        required: true,
      }
    },
    {
      timestamps: true,
    }
  );


  export const Book = mongoose.model('Book', bookSchema);