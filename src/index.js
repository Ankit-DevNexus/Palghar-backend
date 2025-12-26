import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import express from 'express';
import Routes from './routes/routes.js';
import cookieParser from 'cookie-parser';
import {connectDB} from './config/connectDB.js'
const app = express();
const PORT = process.env.PORT || 9002;


// CONNECT TO MONGO
connectDB(process.env.MONGO_DB_URI);

// CORS CONFIG
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',

];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS: ' + origin));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));


// ROUTES
app.use('/api', Routes);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'API is running' });
});

// START SERVER
app.listen(PORT,  () => {
  console.log(`Server running http://localhost:${PORT}`);
});
