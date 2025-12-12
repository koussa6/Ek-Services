import React, { useState } from 'react';
import { styles } from '../assets/dummyData';
import axios from 'axios';
import { FiHeart, FiStar, FiUpload } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { FaDollarSign } from 'react-icons/fa';
const AddItems = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    rating: 0,
    hearts: 0,
    total: 0,
    images: null,
    preview: '',
  });
  const [categories] = useState([
    'Breakfast',
    'Lunch',
    'Dinner',
    'Mexican',
    'Italian',
    'Desserts',
    'Drinks',
  ]);
  const [hoverRating, setHoverRating] = useState(0);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((form) => ({ ...form, [name]: value }));
  };
  /*Handle Submit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();

      // Append all fields except image
      payload.append('name', formData.name);
      payload.append('description', formData.description);
      payload.append('category', formData.category);
      payload.append('price', formData.price);
      payload.append('rating', formData.rating);
      payload.append('hearts', formData.hearts);
      payload.append('total', formData.total);

      // Append the image with the key 'image' to match multer
      if (formData.images) {
        payload.append('image', formData.images);
      }

      const res = await axios.post(
        'http://localhost:5000/api/item/add-item',
        payload,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      setFormData({
        name: '',
        description: '',
        category: '',
        price: '',
        rating: 0,
        hearts: 0,
        total: 0,
        images: null,
        preview: '',
      });

      toast.success('Item added');
    } catch (error) {
      toast.error(error.message);
    }
  };
  // FOR IMAGE HANDLING
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        images: file,
        preview: URL.createObjectURL(file),
      }));
    }
  };

  const handleRating = (rating) => setFormData((prev) => ({ ...prev, rating }));

  const handleHearts = () =>
    setFormData((prev) => ({ ...prev, hearts: prev.hearts + 1 }));
  return (
    <div className={styles.formWrapper}>
      <div className="max-w-4xl mx-auto">
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>Add New Menu Item</h2>
          <form className="space-y-6 sm:space-y-8" onSubmit={handleSubmit}>
            <div className={styles.uploadWrapper}>
              <label className={styles.uploadLabel}>
                {formData.preview ? (
                  <img
                    src={formData.preview}
                    alt="Preview"
                    className={styles.previewImage}
                  />
                ) : (
                  <div className="text-center p-4">
                    <FiUpload className={styles.uploadIcon} />
                    <p className={styles.uploadText}>
                      Click to upload product image
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  name="image"
                  onChange={handleImageUpload}
                  className="hidden"
                  required
                />
              </label>
            </div>
            <div className="space-y-6">
              <div>
                <label className=" block mb-2 text-base sm:text-lg text-amber-400">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={styles.inputField}
                  placeholder="Enter Product Name"
                  required
                />
              </div>

              <div>
                <label className=" block mb-2 text-base sm:text-lg text-amber-400">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  placeholder="Enter item's descirption"
                  className={styles.inputField + 'h-32 sm:h-40 text-white'}
                ></textarea>
              </div>
              <div className={styles.gridTwoCols}>
                <div>
                  <label className=" block mb-2 text-base sm:text-lg █ text-amber-400">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={styles.inputField}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c} value={c} className=" bg-[#3a2b2b]">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-base sm:text-lg text-amber-400">
                    Price ($)
                  </label>
                  <div className={styles.relativeInput}>
                    {<FaDollarSign className={styles.dollarIcon} />}
                    <input
                      type="Number"
                      name="price"
                      className={
                        styles.inputField + 'pl-10 sm:pl-12 text-white'
                      }
                      placeholder="12.0"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.gridTwoCols}>
                <div>
                  <label className="block mb-2 text-base sm:text-xl text-amber-400  mb-6">
                    Rating
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onMouseEnter={() => setHoverRating(star)}
                        className="text-2xl sm:text-3xl transition-transform hover:scale-110"
                      >
                        <FiStar
                          className={
                            star <= (hoverRating || formData.rating)
                              ? 'text-amber-400 fill-current'
                              : 'text-amber-100/30'
                          }
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div>
                    <label className="block mb-2 text-base sm:text-lg text-amber-400">
                      Popularity
                    </label>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <button
                      type="button"
                      onClick={handleHearts}
                      className="text-2xl sm:text-3xl text-amber-400 hover:text-amber-300 transition-colors animate-pulse"
                    >
                      <FiHeart />
                    </button>
                    <input
                      type="number"
                      name="hearts"
                      value={formData.hearts}
                      onChange={handleChange}
                      className={
                        styles.inputField + 'pl-10 sm:pl-12 text-white'
                      }
                      placeholder="0"
                      required
                    />
                  </div>
                </div>
              </div>
              <button type="submit" className={styles.actionBtn}>
                Add To Menu
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddItems;
