import mongoose from 'mongoose';

const testimonialsSchema = new mongoose.Schema(
  {
    name: {
      type: String,      
      trim: true,
    },
    property: {
      type: String,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
    },
    publicId: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      ENUM: ['approved', 'reject', 'pending'],
      default: 'approved',
      lowercase: true,
    },
  },
  {
    timestamps: true,
  },
);

const testimonialsModel = mongoose.model('testimonial', testimonialsSchema);

export default testimonialsModel;



