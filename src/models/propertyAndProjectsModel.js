import mongoose from 'mongoose';

const propertiesSchems = new mongoose.Schema(
  {
    name: { type: String },
    category: { type: String },
    type: { type: String },
    status: { type: String },
    pricing: {
      sale_price: Number,
      rent_price: Number,
    },
    config: { type: String },
    area: {
      carpet_sqft: String,
      plot_sqft: String,
    },
    location: {
      city: String,
      area: String,
      pincode: String,
      geo: {
        latitude: Number,
        longitude: Number,
      },
    },
    images: [
      {
        url: String,
        publicId: String,
      },
    ],
    owner: { type: String },
    description: { type: String },
  },
  { timestamps: true },
);

const projectSchema = new mongoose.Schema(
  {
    name: { type: String },
    address: { type: String },
    images: [
      {
        url: String,
        publicId: String,
      },
    ],
    map_url: { type: String },
    status: { type: String },
  },
  { timestamps: true },
);

const propertiesAndProjectSchema = new mongoose.Schema(
  {
    propertyCategory: { type: String, unique: true, lowercase: true },
    properties: [propertiesSchems],

    projectCategory: { type: String, unique: true, lowercase: true },
    projects: [projectSchema],
  },
  { timestamps: true },
);

const propertiesAndProjectModel = mongoose.model('ProjectAndProperty', propertiesAndProjectSchema);

export default propertiesAndProjectModel;
