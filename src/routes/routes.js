import express from 'express';
import { forgotPassword, loginUser, registerUser, resetPassword } from '../controllers/usersController.js';
import { resendOTP, verifyOTP } from '../controllers/verifyOTPController.js';
import { createEnquiry, getAllEnquiries } from '../controllers/enquiryControllers.js';
import { createContact, deleteContact, getAllContacts } from '../controllers/contactUsController.js';
import { getAllSubscribers, subscribeNewsletter } from '../controllers/newsletterController.js';
import { createTestimonial, deleteTestimonial, getAllTestimonials, getTestimonialById, updateTestimonial } from '../controllers/testimonialsController.js';
import upload from '../middleware/multerMiddleware.js';
import { getAllPropertiesAndProjects, getPropertiesAndProjectsById, propertiesAndProject } from '../controllers/propertyAndProjectsController.js';
import { Authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', registerUser)

router.post('/signin', loginUser)

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);


// ---------------- OTP verification ---------------------------

router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);

// ---------------- enquiry  ---------------------------

router.post('/enquiry/create', createEnquiry);
router.get('/enquiry/get', getAllEnquiries);

// ---------------- get in touch  ---------------------------

router.post('/contact/create', createContact);
router.get('/contact/get', getAllContacts);
router.delete('/contact/delete/:id', deleteContact);


// ---------------- newsletter  ---------------------------

router.post('/subscribe', subscribeNewsletter);
router.get('/subscribers/all', getAllSubscribers);


// ---------------- testimonials  ---------------------------

router.post('/testimonial', upload.single('image'), createTestimonial);
router.get('/testimonials/all', getAllTestimonials);
router.get('/testimonial/:id', getTestimonialById);
router.patch('/testimonial/update/:id', upload.single('image'), updateTestimonial);
router.delete('/testimonial/delete/:id', deleteTestimonial);


// ---------------- properties and project  ---------------------------
router.post('/propertandprojects', Authenticate, propertiesAndProject);
router.get('/propertandprojects/all', getAllPropertiesAndProjects);
router.get('/propertandprojects/:id', getPropertiesAndProjectsById);
// router.post('/propertandprojects/:id', addProperty);
// router.get('/propertandprojects/:id', addProject);
router.patch('/propertandprojects/update/:id', upload.single('image'), updateTestimonial);
// router.delete('/propertandprojects/delete/:id', deleteTestimonial);


export default router;
