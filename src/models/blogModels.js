import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    featureImage: { type: String },
    publicId: { type: String },
    resourceType: { type: String },
    title: {
      type: String,
    },
    blogContent: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const blogModel = mongoose.model('blog', blogSchema);

export default blogModel;
