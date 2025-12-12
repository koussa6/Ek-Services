import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaUser, FaLock } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { useAppContext } from '../context/AppContext';
import toast, { Toaster } from 'react-hot-toast';
const Login = ({ onLoginSuccess }) => {
  const [state, setState] = useState('login');
  const { setShowLoginModal } = useAppContext();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    rememberMe: false,
  });
  const changeHandler = ({ target: { name, value, type, checked } }) => {
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  useEffect(() => {
    const stored = localStorage.getItem('loginData');
    if (stored) {
      const parsed = JSON.parse(stored);
      setFormData((prev) => ({
        ...prev,
        ...parsed,
      }));
    }
  }, []);
  const submitHandler = async (e) => {
    const payload =
      state === 'login'
        ? { email: formData.email, password: formData.password }
        : {
            email: formData.email,
            password: formData.password,
            name: formData.name,
          };
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `http://localhost:5000/api/user/${state}`,
        payload
      );
      if (data.success) {
        localStorage.setItem('authToken', data.token);

        toast.success(`${state === 'login' ? 'Login' : 'SignUp'} Successfully`);
        setFormData((prev) => ({ ...prev, name: '', email: '', password: '' }));
        if (formData.rememberMe) {
          localStorage.setItem(
            'loginData',
            JSON.stringify({ email: formData.email })
          );
        } else {
          localStorage.removeItem('loginData');
        }
        onLoginSuccess();
        setShowLoginModal(false);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <div className="pt-5">
      <form onSubmit={submitHandler} className="flex flex-col gap-7">
        {state === 'signUp' ? (
          <div className="flex flex-row border-2 w-full border-1 border-[#2D1A0A]/50  bg-[#2D1B0E]/50 py-4 border-none hover:scale-105 transition-colors transition-transform duration-200 rounded-lg py-2 text-amber-400 focus:border-amber-500 outline-none">
            <span className=" translate-y-1 translate-x-2">
              <FaUser />
            </span>
            <input
              type="text"
              name="name"
              className="w-full border-none outline-none pl-4"
              value={formData.name}
              onChange={changeHandler}
              placeholder="Username"
            />
          </div>
        ) : (
          ''
        )}
        <div className="flex flex-row border-2 w-full border-1 border-[#2D1A0A]/50  bg-[#2D1B0E]/50 py-4 border-none hover:scale-105 transition-colors transition-transform duration-200 rounded-lg py-2 text-amber-400 focus:border-amber-500 outline-none">
          <span className="pr-2 text-lg translate-y-1 translate-x-2">
            <MdEmail />
          </span>

          <input
            type="text"
            name="email"
            className="w-full border-none outline-none pl-2"
            value={formData.email}
            onChange={changeHandler}
            placeholder="Email@gmail.com"
          />
        </div>
        <div className="flex flex-row border-2 w-full border-1 border-[#2D1A0A]/50  bg-[#2D1B0E]/50 py-4  border-none hover:scale-105 transition-colors transition-transform duration-200 rounded-lg py-2 text-amber-400 focus:border-amber-500 outline-none">
          <span className="pr-2 translate-y-1 translate-x-2">
            <FaLock />
          </span>
          <input
            type="password"
            name="password"
            className="w-full border-none outline-none pl-2"
            value={formData.password}
            onChange={changeHandler}
            placeholder="Password"
          />
        </div>
        {state === 'login' ? (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={changeHandler}
              className="accent-amber-400"
            />
            <label className="text-amber-400">Remember Me</label>
          </div>
        ) : (
          ''
        )}
        <button
          type="submit"
          className="w-full bg-gradient-to-br from-amber-400 rounded-2xl py-3 to-amber-700"
        >
          {state === 'login' ? 'Login' : 'SignUp'}
        </button>
      </form>
      {state === 'login' ? (
        <div
          className="cursor-pointer text-amber-400 pt-5 w-full text-center hover:underline "
          onClick={() => setState('signUp')}
        >
          Create a new account
        </div>
      ) : (
        <div
          className="cursor-pointer text-amber-400 w-full pt-5 text-center hover:underline"
          onClick={() => setState('login')}
        >
          Back to Login
        </div>
      )}
    </div>
  );
};

export default Login;
