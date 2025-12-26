import newsletterModel from '../models/newsletterModel.js';


export const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    // Check if email already exists
    const alreadySubscribed = await newsletterModel.findOne({ email });

    if (alreadySubscribed) {
      return res.status(409).json({
        success: false,
        message: 'Email already subscribed',
      });
    }

    const subscriber = await newsletterModel.create({ email });

    res.status(201).json({
      success: true,
      message: 'Subscribed successfully',
      subscriber,
    });
  } catch (error) {
    console.error('Subscribe Newsletter Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};


export const getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await newsletterModel
      .find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: subscribers.length,
      subscribers,
    });
  } catch (error) {
    console.error('Get Subscribers Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};
