import { generateOTP, sendVerificationOTP } from '../helpers/otpHelper.js';
import userModel from '../models/userModel.js';

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await userModel.findOne({ email });

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    if (user.isActive)
      return res.status(400).json({ success: false, message: "Already verified" });

    if (user.otp !== otp || user.otpExpiresAt < Date.now()) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    user.isActive = true;
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully. You can login now.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: 'Email is required.' });

    const user = await userModel.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Account not found.' });

    if (user.isActive) return res.status(400).json({ message: 'Account already verified.' });

    // Prevent spamming
    if (user.otpExpiresAt) {
      const lastOtpTime = new Date(user.otpExpiresAt).getTime() - 5 * 60 * 1000;
      if (Date.now() - lastOtpTime < 60 * 1000) {
        return res.status(429).json({
          message: 'Please wait 60 seconds before requesting another OTP.',
        });
      }
    }

    const newOtp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min validity

    user.otp = newOtp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    await sendVerificationOTP(email, newOtp);

    res.status(200).json({ success: true, message: 'New OTP sent successfully.' });
  } catch (error) {
    console.error('Error resending OTP:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
