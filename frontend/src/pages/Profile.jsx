import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('/user/me')
      .then(res => {
        setUser(res.data);
        setForm({ name: res.data.name, email: res.data.email });
      })
      .catch(() => setError('Failed to load user info'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await axios.put('/user/me', form);
      setUser(res.data);
      setEditMode(false);
    } catch {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="profile-page"><p>Loading...</p></div>;
  if (error) return <div className="profile-page"><p style={{color:'red'}}>{error}</p></div>;
  if (!user) return null;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <img className="profile-avatar" src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`} alt="avatar" />
        <div>
          {editMode ? (
            <>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </>
          ) : (
            <>
              <h2>{user.name}</h2>
              <p>{user.email}</p>
              <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
            </>
          )}
        </div>
      </div>
      <div className="profile-actions">
        {editMode ? (
          <>
            <button className="profile-btn" onClick={handleSave}>Save</button>
            <button className="profile-btn" onClick={() => setEditMode(false)}>Cancel</button>
          </>
        ) : (
          <>
            <button className="profile-btn" onClick={() => setEditMode(true)}>Edit Profile</button>
            <button className="profile-btn" onClick={async () => { await axios.post('/auth/logout'); window.location.href = '/auth'; }}>Logout</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;

