import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateSettings } from '../store/slices/settingsSlice';

const SettingsForm = () => {
  const dispatch = useDispatch();
  const { goals, pocket_enabled } = useSelector((state) => state.settings);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    goals: goals || '',
    pocket_enabled: pocket_enabled || false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleToggle = () => {
    setFormData({ ...formData, pocket_enabled: !formData.pocket_enabled });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateSettings(formData));
    console.log("Updated settings:", formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
      <label>Name</label>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        style={{ marginBottom: '10px' }}
      />

      <label>Email</label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        style={{ marginBottom: '10px' }}
      />

      <label>Password</label>
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        style={{ marginBottom: '10px' }}
      />

      <label>Goals</label>
      <input
        type="text"
        name="goals"
        value={formData.goals}
        onChange={handleChange}
        style={{ marginBottom: '10px' }}
      />

      <label>Pocket</label>
      <div style={{ marginBottom: '10px' }}>
        <button type="button" onClick={handleToggle}>
          {formData.pocket_enabled ? 'On' : 'Off'}
        </button>
      </div>

      <button type="submit">Add</button>
    </form>
  );
};

export default SettingsForm;
