import express from 'express';
import {
  createItem,
  deleteIte,
  getItem,
} from '../controllers/itemController.js';
import upload from '../config/multer.js';
const itemRouter = express.Router();
itemRouter.post('/add-item', upload.single('image'), createItem);
itemRouter.get('/get-item', getItem);
itemRouter.delete('/:id', deleteIte);
export default itemRouter;
