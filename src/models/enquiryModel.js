import mongoose, { Types } from 'mongoose';

const enquirySchema = new mongoose.Schema({
  city: {
    type: String,
  },
  countryCode: {
    type: String,
  },
  email: {
    type: String,
    lowercase: true
  },
  enquiryType: {
    type: String,
  },
  message: {
    type: String,
  },
  phone: {
    type: Number,
  },
});


const enquiryModel = mongoose.model('enquiry', enquirySchema);

export default enquiryModel