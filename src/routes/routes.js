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
import { AllBlogController, BlogController, BlogImageController, DeleteBlogController, EditBlogController, getBlogByIdController } from '../controllers/blogController.js';

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
// router.patch('/propertandprojects/update/:id', upload.single('image'), updateTestimonial);
// router.delete('/propertandprojects/delete/:id', deleteTestimonial);


// ---------------- blogs ---------------------------
router.post("/blog/post",Authenticate,upload.single("featureImage"),BlogController);
router.get("/blog/all", AllBlogController);
router.get("/blog/:id", getBlogByIdController);
router.post("/upload-image", upload.single("image"), BlogImageController);
router.patch("/blog/edit/:id",Authenticate,upload.single("featureImage"),EditBlogController);
router.delete("/blog/delete/:id", Authenticate, DeleteBlogController);

export default router;
