import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDb from './config/db.js';
import connectCloudinary from './config/cloudinary.js';
import cookieParser from 'cookie-parser';
import userRouter from './routes/userRoutes.js';
import itemRouter from './routes/itemRoutes.js';
import CartRouter from './routes/cartRoutes.js';
import orderRouter from './routes/orderRoutes.js';

const app = express();
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];
await connectDb();
await connectCloudinary();
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => res.send('API WORKING'));
app.use('/api/user', userRouter);
app.use('/api/item', itemRouter);
app.use('/api/cart', CartRouter);
app.use('/api/order', orderRouter);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});
