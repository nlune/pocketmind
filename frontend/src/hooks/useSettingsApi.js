import { useDispatch, useSelector } from 'react-redux';
import { fetchUserSettings, updateUserSettings } from '../store/slices/settingsSlice';
import { useEffect } from 'react';

const useSettingsApi = () => {
  const dispatch = useDispatch();
  const settings = useSelector((state) => state.settings);
  
  // Fetch settings when the hook is first used
  useEffect(() => {
    dispatch(fetchUserSettings());
  }, [dispatch]);
  
  // Update settings
  const saveSettings = (updatedUserSettings) => {
    dispatch(updateUserSettings(updatedUserSettings));
  };

  return { settings, saveSettings };
};

export default useSettingsApi;
