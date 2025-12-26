import enquiryModel from '../models/enquiryModel.js';
import { enquiryEmailTemplate } from '../utils/enquiryEmailTemplate.js';
import { sendEmail } from '../utils/sendEmail.js';

export const createEnquiry = async (req, res) => {
  try {
    const { city, countryCode, email, enquiryType, message, phone } = req.body;

    const enquiry = await enquiryModel.create({
      city,
      countryCode,
      email,
      enquiryType,
      message,
      phone,
    });

    await sendEmail(
      email,
      'We have received your enquiry',
      enquiryEmailTemplate({
        email,
        phone,
        countryCode,
        city,
        enquiryType,
        message,
      }),
    );
    const saved = await enquiry.save();

    res.status(201).json({
      success: true,
      message: 'enquiry created successfully',
      enquiry: saved,
    });
  } catch (error) {
    console.log('Create Enquiry Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const getAllEnquiries = async (req, res) => {
  try {
    const enquiry = await enquiryModel.find();

    res.status(200).json({
      success: true,
      message: 'All enquiry fetched successfully',
      totalCount: enquiry.length,
      enquiries: enquiry,
    });
  } catch (error) {
    console.log('Get Enquiry Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};
