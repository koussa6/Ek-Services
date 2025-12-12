import asyncHandler from 'express-async-handler';
import Cart from '../models/Cart.js';

// GET CART
export const getCart = asyncHandler(async (req, res) => {
  const items = await Cart.find({ user: req.user._id }).populate('item');
  const formatted = items.map((ci) => ({
    _id: ci._id.toString(),
    item: ci.item,
    quantity: ci.quantity,
  }));
  res.json(formatted);
});

// ADD TO CART
export const addToCart = asyncHandler(async (req, res) => {
  const { itemId, quantity } = req.body;

  if (!itemId || typeof quantity !== 'number') {
    res.status(400);
    throw new Error('itemId and quantity are required');
  }

  let cartItem = await Cart.findOne({ user: req.user._id, item: itemId });

  if (cartItem) {
    cartItem.quantity += quantity;

    // Remove if quantity <= 0
    if (cartItem.quantity <= 0) {
      await cartItem.deleteOne();
      return res.json({
        _id: cartItem._id.toString(),
        item: cartItem.item,
        quantity: 0,
      });
    }

    await cartItem.save();
    await cartItem.populate('item');

    return res.json({
      _id: cartItem._id.toString(),
      item: cartItem.item,
      quantity: cartItem.quantity,
    });
  }

  cartItem = await Cart.create({ user: req.user._id, item: itemId, quantity });
  await cartItem.populate('item');

  res.status(201).json({
    _id: cartItem._id.toString(),
    item: cartItem.item,
    quantity: cartItem.quantity,
  });
});

// UPDATE CART ITEM
export const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;

  const cartItem = await Cart.findOne({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!cartItem) {
    res.status(404);
    throw new Error('Cart item not found');
  }

  cartItem.quantity = quantity <= 0 ? 0 : quantity;

  if (cartItem.quantity === 0) {
    await cartItem.deleteOne();
    // Return item info even if deleted
    return res.json({
      _id: cartItem._id.toString(),
      item: cartItem.item,
      quantity: 0,
    });
  }

  await cartItem.save();
  await cartItem.populate('item');

  res.json({
    _id: cartItem._id.toString(),
    item: cartItem.item,
    quantity: cartItem.quantity,
  });
});

// DELETE CART ITEM
export const deleteCartItem = asyncHandler(async (req, res) => {
  const cartItem = await Cart.findOne({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!cartItem) {
    res.status(404);
    throw new Error('Cart item not found');
  }

  await cartItem.deleteOne();
  res.json({ _id: req.params.id, item: cartItem.item, quantity: 0 });
});

// CLEAR CART
export const clearCart = asyncHandler(async (req, res) => {
  await Cart.deleteMany({ user: req.user._id });
  res.json({ message: 'Cart cleared', cart: [] });
});
