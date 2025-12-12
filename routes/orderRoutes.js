import express from 'express';
import {
  createOrder,
  getAllOrder,
  getOrderById,
  getOrders,
  updateAnyOrder,
  updateOrder,
} from '../controllers/orderController.js';
import authUser from '../middleware/authUser.js';
const orderRouter = express.Router();
orderRouter.get('/get-all', getAllOrder);
orderRouter.put('/get-all/:id', updateAnyOrder);
orderRouter.post('/', authUser, createOrder);
orderRouter.get('/', authUser, getOrders);
orderRouter.get('/:id', authUser, getOrderById);
orderRouter.put('/:id', authUser, updateOrder);
export default orderRouter;
