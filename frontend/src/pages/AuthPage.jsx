import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
    <div style={styles.container}>
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
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

      <p style={{ marginTop: '10px' }}>
        {isLogin ? "Don't have an account?" : "Already have an account?"}
        <button
          style={styles.toggleBtn}
          type="button"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? 'Register' : 'Login'}
        </button>
      </p>
    </div>
  );
};

const styles = {
  container: { maxWidth: '400px', margin: 'auto', padding: '20px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  toggleBtn: {
    marginLeft: '10px',
    background: 'none',
    border: 'none',
    color: '#1976d2',
    cursor: 'pointer',
    textDecoration: 'underline',
  }
};

export default AuthPage;
