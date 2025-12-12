import express from 'express';
import {
  addToCart,
  clearCart,
  deleteCartItem,
  getCart,
  updateCartItem,
} from '../controllers/cartController.js';

import authMiddleware from '../middleware/authUser.js';

const CartRouter = express.Router();

CartRouter.route('/')
  .get(authMiddleware, getCart)
  .post(authMiddleware, addToCart);

CartRouter.post('/clear', authMiddleware, clearCart);

CartRouter.route('/:id')
  .put(authMiddleware, updateCartItem)
  .delete(authMiddleware, deleteCartItem);

export default CartRouter;
