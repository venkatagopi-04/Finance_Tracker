import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AuthPage.css';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true); // toggle state
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/auth/login' : '/auth/register';

    try {
      await axios.post(`http://localhost:5000${endpoint}`, form, { withCredentials: true });
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Auth failed');
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
      <h2>Personal Finance Assistant</h2>
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
        </form>

        <div className="auth-toggle">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
