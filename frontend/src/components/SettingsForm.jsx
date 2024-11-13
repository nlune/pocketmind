import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserSettings } from '../store/slices/settingsSlice';

const SettingsForm = () => {
  const dispatch = useDispatch();
  const { name, email, goals, pocket_enabled } = useSelector((state) => state.settings);

  const [formData, setFormData] = useState({
    name: name ?? '',  // Use nullish coalescing operator (??) to handle undefined
    email: email ?? '',
    goals: goals ?? '',
    pocket_enabled: pocket_enabled ?? false, // Default to false
  });

  // Sync formData with the settings when they are updated
  useEffect(() => {
    console.log('Current settings:', { name, email, goals, pocket_enabled });
    setFormData({
      name: name ?? '',
      email: email ?? '',
      goals: goals ?? '',
      pocket_enabled: pocket_enabled ?? false,
    });
  }, [name, email, goals, pocket_enabled]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleToggle = () => {
    setFormData((prevData) => ({ ...prevData, pocket_enabled: !prevData.pocket_enabled }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUserSettings(formData));
    console.log('Updated settings:', formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
      <label>Name</label>
      <input
        type="text"
        name="name"
        value={formData.name}  // Controlled input
        onChange={handleChange}
        style={{ marginBottom: '10px' }}
      />

      <label>Email</label>
      <input
        type="email"
        name="email"
        value={formData.email}  // Controlled input
        onChange={handleChange}
        style={{ marginBottom: '10px' }}
      />

      <label>Goals</label>
      <input
        type="text"
        name="goals"
        value={formData.goals}  // Controlled input
        onChange={handleChange}
        style={{ marginBottom: '10px' }}
      />

      <label>Pocket Enabled</label>
      <div style={{ marginBottom: '10px' }}>
        <button type="button" onClick={handleToggle}>
          {formData.pocket_enabled ? 'On' : 'Off'}
        </button>
      </div>

      <button type="submit">Save</button>
    </form>
  );
};

export default SettingsForm;
