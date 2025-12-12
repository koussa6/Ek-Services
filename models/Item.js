import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  imgUrl: { type: String },
  category: { type: String, required: true },
  hearts: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
});

const Item = mongoose.model('Item', itemSchema);
export default Item;
