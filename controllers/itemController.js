import Item from '../models/Item.js';
import { v2 as cloudinary } from 'cloudinary';
export const createItem = async (req, res) => {
  try {
    const { name, description, category, price, rating, hearts } = req.body;

    const file = req.file; // single file
    if (!file)
      return res
        .status(400)
        .json({ success: false, message: 'Image is required' });

    const uploaded = await cloudinary.uploader.upload(file.path, {
      resource_type: 'image',
    });

    const imgUrl = uploaded.secure_url;
    const total = Number(price);

    const newItem = await Item.create({
      name,
      description,
      category,
      price,
      rating,
      hearts,
      imgUrl,
      total,
    });

    return res.status(201).json({ success: true, message: 'Item Created' });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

export const getItem = async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

export const deleteIte = async (req, res) => {
  try {
    const deleteItem = await Item.findByIdAndDelete(req.params.id);
    if (!deleteItem) {
      return res.json({ success: false, message: 'Item not found' });
    }
    return res.json({ success: true, message: 'Item deleted' });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};
