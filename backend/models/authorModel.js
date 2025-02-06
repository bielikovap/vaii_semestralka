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
    profileImage: {
      type: String,
      default: 'https://static.vecteezy.com/system/resources/thumbnails/029/470/675/small_2x/ai-generated-ai-generative-purple-pink-color-sunset-evening-nature-outdoor-lake-with-mountains-landscape-background-graphic-art-photo.jpg',
      validate: {
        validator: function(v) {
          return /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i.test(v);
        },
        message: props => `${props.value} is not a valid image URL!`
      }
    }
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