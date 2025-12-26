import crypto from 'crypto';
import nodemailer from 'nodemailer';
import userModel from '../models/userModel.js';
import { generateOTP, sendVerificationOTP } from '../helpers/otpHelper.js';
import { generateAccessToken, generateRefreshToken } from '../config/jwt.js';

// REGISTER ADMIN
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'All fields required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const otp = generateOTP();

    const user = await userModel.create({
      name,
      email,
      password,
      otp,
      otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await sendVerificationOTP(email, otp);

    const saved = await user.save();
    res.status(201).json({
      success: true,
      message: 'OTP sent to email. Please verify to activate account.',
      saved
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// LOGIN (Email or Phone)
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    console.log(user);

    if (!user.isActive) return res.status(403).json({ success: false, message: 'Please verify email first' });

    const isMatch = await user.comparePassword(password);
    console.log(isMatch);

    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // ACCESS TOKEN (short-lived)
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    // REFRESH TOKEN (long-lived)
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

//FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    // Generate token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    console.log('Raw resetToken sent in email:', resetToken);
    console.log('Hashed token saved in DB:', user.resetPasswordToken);

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Async email sending (non-blocking)
    (async () => {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          // secure: false,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        await transporter.sendMail({
          from: `"AsiaGo Travels" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: 'Password Reset - AsiaGo Travels',
          html: `
            <p>Hello ${user.name},</p>
            <p>Click below to reset your password:</p>
            <a href="${resetUrl}" target="_blank">${resetUrl}</a>
            <p>This link expires in 10 minutes.</p>
            `,
        });
      } catch (mailErr) {
        console.error('Email send error:', mailErr.message);
      }
    })();

    res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email (valid for 10 minutes).',
    });
  } catch (error) {
    console.error(' Forgot Password error:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

//  RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    // console.log("Token received from URL:", token);
    // console.log("Hashed token for lookup:", crypto.createHash("sha256").update(token).digest("hex"));

    const { token } = req.params;
    const { password } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, message: 'Token is missing in the URL.' });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    console.log('Token received from URL:', token);
    console.log('Hashed token for lookup:', hashedToken);

    const user = await userModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired token.' });

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful. You can now login with your new password.',
    });
  } catch (error) {
    console.error('Reset Password error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
