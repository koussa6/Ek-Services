import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { FaPlus, FaMinus } from 'react-icons/fa';
import './OurHomeMenu.css';
import axios from 'axios';

const categories = [
  'breakfast',
  'Lunch',
  'Dinner',
  'Mexican',
  'Italian',
  'Desserts',
  'Drinks',
];

const OurHomeMenu = () => {
  const [activateCategory, setActivateCategory] = useState(categories[0]);
  const [menuData, setMenuData] = useState({});
  const { cartItems, addToCart, removeFromCart, updateQuantity, getCartEntry } =
    useAppContext();

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/item/get-item')
      .then((res) => {
        const grouped = res.data.reduce((acc, item) => {
          acc[item.category] = acc[item.category] || [];
          acc[item.category].push(item);
          return acc;
        }, {});
        setMenuData(grouped);
      })
      .catch(console.error);
  }, []);

  const getQuantity = (id) => getCartEntry(id)?.quantity || 0;
  const displayItems = (menuData[activateCategory] || []).slice(0, 4);

  return (
    <div className="bg-gradient-to-br from-[#1a120b] via-[#2a1e14] to-[#3e2b1d] min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200">
          <span className="font-dancingscript block text-5xl sm:text-6xl md:text-7xl mb-2">
            Our Exquisite Menu
          </span>
          <span className="block text-xl sm:text-2xl md:text-3xl font-cinzel mt-4 text-amber-100/80">
            A Symphony Of Flavors
          </span>
        </h2>

        {/* CATEGORY BUTTONS */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActivateCategory(cat)}
              className={`px-4 sm:px-6 py-2 rounded-full border-2 transition-all duration-300 transform font-cinzel text-sm sm:text-lg tracking-widest backdrop-blur-sm ${
                activateCategory === cat
                  ? 'bg-gradient-to-r from-amber-900/80 to-amber-700/80 border-amber-800 scale-105 shadow-xl shadow-amber-900/30'
                  : 'bg-amber-900/20 border-amber-800/30 text-amber-100/80 hover:bg-amber-800/40 hover:scale-95'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* MENU GRID */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {displayItems.map((item, i) => {
            const qty = getQuantity(item._id);
            const cartEntry = getCartEntry(item._id);

            return (
              <div
                key={item._id}
                className="relative bg-amber-900/20 rounded-2xl overflow-hidden border border-amber-800 backdrop-blur-sm flex flex-col transition-all duration-500"
                style={{ '--index': i }}
              >
                <div className="relative h-48 sm:h-56 md:h-60 flex items-center justify-center bg-black/10">
                  <img
                    src={item.imgUrl}
                    alt={item.name}
                    className="max-h-full max-w-full object-contain transition-all duration-700"
                  />
                </div>

                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-amber-800/50 to-transparent opacity-50" />

                <div className="p-4 sm:p-6 flex flex-col flex-grow">
                  <h3 className="text-xl sm:text-2xl mb-2 font-dancingscript text-amber-100">
                    {item.name}
                  </h3>
                  <p className="text-amber-100/80 text-xs sm:text-sm mb-4 font-cinzel leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center mx-auto gap-4 justify-between">
                    <div className="bg-amber-100/10 backdrop-blur-sm px-3 py-1 rounded-2xl shadow-lg">
                      <span className="text-xl font-bold text-amber-300 font-dancingscript">
                        ${Number(item.price).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {qty > 0 ? (
                        <>
                          <button
                            className="w-8 h-8 rounded-full bg-amber-900/40 flex items-center justify-center hover:bg-amber-800/50"
                            onClick={() => {
                              if (!cartEntry) return;
                              qty > 1
                                ? updateQuantity(cartEntry._id, qty - 1)
                                : removeFromCart(cartEntry._id);
                            }}
                          >
                            <FaMinus className="text-amber-100" />
                          </button>

                          <span className="w-8 text-center text-amber-100">
                            {qty}
                          </span>

                          <button
                            className="w-8 h-8 rounded-full bg-amber-900/40 flex items-center justify-center hover:bg-amber-800/50"
                            onClick={() =>
                              cartEntry
                                ? updateQuantity(cartEntry._id, qty + 1)
                                : addToCart(item, 1)
                            }
                          >
                            <FaPlus className="text-amber-100" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => addToCart(item, 1)}
                          className="bg-amber-900/40 px-4 py-1.5 rounded-full font-cinzel text-xs uppercase transition-transform duration-500 hover:scale-110 hover:shadow-lg border border-amber-800/50"
                        >
                          <span className="relative z-10 text-xs text-black">
                            Add to Cart
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center mt-16">
          <Link
            className="bg-amber-900/30 border-2 border-amber-800/30 text-amber-100 px-8 sm:px-10 py-3 rounded-full font-cinzel uppercase tracking-widest transition-all duration-300 hover:bg-amber-800/40 hover:scale-105 backdrop-blur-sm"
            to="/menu"
          >
            Explore full Menu
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OurHomeMenu;
