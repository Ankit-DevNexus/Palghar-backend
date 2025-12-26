import testimonialsModel from "../models/testimonialsModel.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import fs from 'fs';


export const createTestimonial = async (req, res) => {
  try {
    const { name, property, rating, review, status } = req.body;

    if ( !name || !rating || !review) {
      return res.status(400).json({
        success: false,
        message: 'Required fields are missing',
      });
    }

    const uploadedImage = await uploadOnCloudinary(req.file.path, "testimonials_image")

    const testimonial = await testimonialsModel.create({
      name,
      property,
      rating,
      review,
      image: uploadedImage.url,
      publicId: uploadedImage.public_id,
      status,
    });

    res.status(201).json({
      success: true,
      message: 'Testimonial created successfully',
      testimonial,
    });
  } catch (error) {
    console.error('Create Testimonial Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await testimonialsModel
      .find()
      .select('-publicId -createdAt -updatedAt -__v')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: testimonials.length,
      testimonials,
    });
  } catch (error) {
    console.error('Get Testimonials Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};


export const getTestimonialById = async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await testimonialsModel
      .findById(id)
      .select('-publicId -createdAt -updatedAt -__v')

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found',
      });
    }

    res.status(200).json({
      success: true,
      testimonial,
    });
  } catch (error) {
    console.error('Get Testimonial Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};


export const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await testimonialsModel.findById(id);
    console.log('Existing testimonial:', testimonial);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found',
      });
    }

    // Update text fields
    const { name, property, rating, review, status } = req.body;

    if (name) testimonial.name = name;
    if (property) testimonial.property = property;
    if (rating) testimonial.rating = rating;
    if (review) testimonial.review = review;
    if (status) testimonial.status = status;

    // Update image if exists
    if (req.file) {
      if (testimonial.publicId) {
        await deleteFromCloudinary(testimonial.publicId, 'testimonials_image');
      }

      const uploaded = await uploadOnCloudinary(
        req.file.path,
        'testimonials_image'
      );

      fs.unlinkSync(req.file.path);

      testimonial.image = uploaded.url;
      testimonial.publicId = uploaded.public_id;
    }

    // SAVE CHANGES
    const updatedTestimonial = await testimonial.save();

    res.status(200).json({
      success: true,
      message: 'Testimonial updated successfully',
      testimonial: updatedTestimonial,
    });
  } catch (error) {
    console.error('Update Testimonial Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};



export const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await testimonialsModel.findById(id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found',
      });
    }

    await testimonial.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Testimonial deleted successfully',
    });
  } catch (error) {
    console.error('Delete Testimonial Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};
