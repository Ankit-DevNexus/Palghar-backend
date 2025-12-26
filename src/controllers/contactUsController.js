import conctactusModel from '../models/contactUsModel.js';
import { contactUsEmailTemplate } from '../utils/contactUsEmailTemplate.js';
import { sendEmail } from '../utils/sendEmail.js';

export const createContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    const contact = await conctactusModel.create({
      name,
      email,
      message,
    });

    await sendEmail(email, 'We have received your message', contactUsEmailTemplate({ name, email, message }));

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      contact,
    });
  } catch (error) {
    console.error('Create Contact Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await conctactusModel.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: contacts.length,
      contacts,
    });
  } catch (error) {
    console.error('Get Contacts Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await conctactusModel.findById(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found',
      });
    }

    await contact.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Contact deleted successfully',
    });
  } catch (error) {
    console.error('Delete Contact Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};
