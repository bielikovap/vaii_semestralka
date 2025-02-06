import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

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
  }
);

userSchema.virtual('reviews', {
  ref: 'Review', 
  localField: '_id', 
  foreignField: 'user',  
  justOne: false  
});

//https://www.mongodb.com/blog/post/password-authentication-with-mongoose-part-1
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); 

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });
//------------------------------------------------------------

userSchema.pre('remove', async function (next) {
  await Review.deleteMany({ user: this._id });
  next();
});

export const User = mongoose.model('User', userSchema);