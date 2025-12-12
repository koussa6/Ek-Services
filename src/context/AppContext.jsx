import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
  useCallback,
} from 'react';
import axios from 'axios';

export const AppContext = createContext();

// ---------------- CART REDUCER ----------------
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'HYDRATE_CART':
      return action.payload;

    case 'ADD_ITEM': {
      const { _id, item, quantity } = action.payload;
      const exists = state.find((ci) => ci._id === _id);

      if (exists) {
        return state.map((ci) => (ci._id === _id ? { ...ci, quantity } : ci));
      }

      return [...state, { _id, item, quantity }];
    }

    case 'REMOVE_ITEM':
      return state.filter((ci) => ci._id !== action.payload);

    case 'UPDATE_ITEM': {
      const { _id, quantity, item } = action.payload;
      if (quantity <= 0) return state.filter((ci) => ci._id !== _id);

      return state.map((ci) =>
        ci._id === _id ? { ...ci, quantity, item } : ci
      );
    }

    case 'CLEAR_CART':
      return [];

    default:
      return state;
  }
};

// ---------------- INITIALIZER ----------------
const initializer = () => {
  if (typeof window !== 'undefined') {
    try {
      return JSON.parse(localStorage.getItem('cart') || '[]');
    } catch {
      return [];
    }
  }
  return [];
};

// ---------------- APP CONTEXT ----------------
export const AppContextProvider = ({ children }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [state, setState] = useState('Login');

  const [cartItems, dispatch] = useReducer(cartReducer, [], initializer);

  // **Save cart to localStorage**
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // **Calculate total price**
  const totalAmount = cartItems.reduce((sum, ci) => {
    return sum + (ci.item?.price || 0) * (ci.quantity || 0);
  }, 0);

  // **Hydrate cart from backend**
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    axios
      .get('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
      .then((res) => {
        const formatted = res.data.map((ci) => ({
          _id: ci._id,
          item: ci.item,
          quantity: ci.quantity,
        }));

        dispatch({ type: 'HYDRATE_CART', payload: formatted });
      })
      .catch(console.error);
  }, []);

  const getCartEntry = (itemId) =>
    cartItems.find((ci) => ci.item._id === itemId);

  // ---------------- ADD TO CART ----------------
  const addToCart = useCallback(
    async (item, qty) => {
      const existing = getCartEntry(item._id);
      if (existing) {
        updateQuantity(existing._id, existing.quantity + qty);
        return;
      }

      try {
        const token = localStorage.getItem('authToken');
        const res = await axios.post(
          'http://localhost:5000/api/cart',
          { itemId: item._id, quantity: qty },
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        const newCartItem = {
          _id: res.data._id,
          item: res.data.item,
          quantity: res.data.quantity,
        };

        dispatch({ type: 'ADD_ITEM', payload: newCartItem });
      } catch (err) {
        console.error(err);
      }
    },
    [cartItems]
  );

  // ---------------- UPDATE QUANTITY ----------------
  const updateQuantity = useCallback(
    async (_id, qty) => {
      const cartEntry = cartItems.find((ci) => ci._id === _id);
      if (!cartEntry) return;

      // Optimistic update
      dispatch({
        type: 'UPDATE_ITEM',
        payload: { _id, quantity: qty, item: cartEntry.item },
      });

      try {
        const token = localStorage.getItem('authToken');
        const res = await axios.put(
          `http://localhost:5000/api/cart/${_id}`,
          { quantity: qty },
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        dispatch({ type: 'UPDATE_ITEM', payload: res.data });
      } catch (err) {
        console.error(err);
      }
    },
    [cartItems]
  );

  // ---------------- REMOVE ITEM ----------------
  const removeFromCart = useCallback(async (_id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: _id });

    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`http://localhost:5000/api/cart/${_id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
    } catch (err) {
      console.error(err);
    }
  }, []);

  // ---------------- CLEAR CART ----------------
  const clearCart = useCallback(async () => {
    dispatch({ type: 'CLEAR_CART' });

    try {
      const token = localStorage.getItem('authToken');
      await axios.post(
        'http://localhost:5000/api/cart/clear',
        {},
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
    } catch (err) {
      console.error(err);
    }
  }, []);

  const value = {
    showLoginModal,
    setShowLoginModal,
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalAmount,
    state,
    setState,
    getCartEntry,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
