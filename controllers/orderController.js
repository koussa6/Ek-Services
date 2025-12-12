import Order from '../models/Order.js';

export const createOrder = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      email,
      address,
      city,
      zipCode,
      paymentMethod,
      subtotal,
      tax,
      total,
      items,
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Invalid or empty items array' });
    }

    const orderItems = items.map(
      ({ item, name, price, imageUrl, quantity }) => {
        const base = item || {};
        return {
          item: {
            name: base.name || name || 'Unknown',
            price: Number(base.price ?? price) || 0,
            imageUrl: base.imageUrl || imageUrl || '',
          },
          quantity: Number(quantity) || 0,
        };
      }
    );
    // DEFAULT SHIPPING COST
    const shippingCost = 0;
    let newOrder;
    newOrder = new Order({
      user: req.user._id,
      firstName,
      lastName,
      phone,
      email,
      address,
      city,
      zipCode,
      paymentMethod,
      subtotal,
      tax,
      total,
      shipping: shippingCost,
      items: orderItems,
      paymentStatus: 'succeeded',
    });

    await newOrder.save();
    return res.status(201).json({ order: newOrder, checkoutUrl: null });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};
export const getOrders = async (req, res) => {
  try {
    const filter = { user: req.user.id };
    const rawOrders = await Order.find(filter).sort({ createdAt: -1 }).lean();

    const formatted = rawOrders.map((o) => ({
      ...o,
      items: o.items.map((i) => ({
        _id: i._id,
        item: i.item,
        quantity: i.quantity,
      })),
      createdAt: o.createdAt,
      paymentStatus: o.paymentStatus,
    }));
    res.json(formatted);
  } catch (error) {
    console.error('CreateOrder Error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
export const getAllOrder = async (req, res) => {
  try {
    const raw = await Order.find({}).sort({ createdAt: -1 }).lean();

    const formatted = raw.map((o) => ({
      _id: o._id,
      user: o.user,
      firstName: o.firstName,
      lastName: o.lastName,
      email: o.email,
      phone: o.phone,
      address: o.address ?? o.shippingAddress,
      city: o.city ?? o.shippingAddress?.city ?? '',
      zipCode: o.zipCode ?? o.shippingAddress?.zipCode ?? '',
      paymentMethod: o.paymentMethod,
      paymentStatus: o.paymentStatus,
      status: o.status,
      createdAt: o.createdAt,
      items: o.items.map((i) => ({
        _id: i._id,
        item: i.item,
        quantity: i.quantity,
      })),
    }));
    res.json(formatted);
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};
// UPDATE ORDER WITHOUT TOKEN FOR ADMIN
export const updateAnyOrder = async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(updated);
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (!order.user.equals(req.user._id)) {
      return res.status(403).json({ message: 'Access Denied' });
    }

    if (req.query.email && order.email !== req.query.email) {
      return res.status(403).json({ message: 'Access Denied' });
    }

    res.json(order);
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};
export const updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (!order.user.equals(req.user._id)) {
      return res.status(403).json({ message: 'Access Denied' });
    }

    if (req.body.email && order.email !== req.body.email) {
      return res.status(403).json({ message: 'Access Denied' });
    }

    const updated = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};
