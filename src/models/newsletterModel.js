import mongoose from 'mongoose';

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
    trim: true,
  },
});

const newsletterModel = mongoose.model('newsletter', newsletterSchema);

export default newsletterModel;
