// Settings.jsx
import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase'; // Adjust import path as needed
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { updatePassword, signOut } from 'firebase/auth';
import { toast } from 'react-toastify'; // Assumes you have react-toastify installed

const Settings = () => {
  // Settings state
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      projectUpdates: true,
      costAlerts: true
    },
    display: {
      darkMode: false,
      compactView: false,
      currency: 'INR',
      dateFormat: 'DD/MM/YYYY'
    },
    apiKeys: {
      geminiApiKey: ''
    }
  });

  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Form validation state
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Get current user ID
  const userId = auth.currentUser?.uid;

  // Fetch user settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      if (!userId) return;
      
      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists() && userDoc.data().settings) {
          setSettings(prevSettings => ({
            ...prevSettings,
            ...userDoc.data().settings
          }));
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [userId]);

  // Handle notification changes
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [name]: checked
      }
    }));
  };

  // Handle display settings changes
  const handleDisplayChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      display: {
        ...prev.display,
        [name]: type === 'checkbox' ? checked : value
      }
    }));
  };

  // Handle API key changes
  const handleApiKeyChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      apiKeys: {
        ...prev.apiKeys,
        [name]: value
      }
    }));
  };

  // Handle password form changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Save settings
  const saveSettings = async () => {
    if (!userId) return;
    
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', userId), {
        settings: settings
      });
      toast.success('Settings saved successfully');
      
      // Save API key to localStorage for client-side access
      if (settings.apiKeys.geminiApiKey) {
        localStorage.setItem('geminiApiKey', settings.apiKeys.geminiApiKey);
      }
      
      // Apply theme if changed
      if (settings.display.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  // Change password
  const changePassword = async (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {};
    if (!passwordForm.currentPassword) newErrors.currentPassword = 'Current password is required';
    if (!passwordForm.newPassword) newErrors.newPassword = 'New password is required';
    if (passwordForm.newPassword && passwordForm.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setSaving(true);
    try {
      // Firebase requires recent login for sensitive operations like password change
      // In a real app, you might need to re-authenticate the user here
      await updatePassword(auth.currentUser, passwordForm.newPassword);
      toast.success('Password updated successfully');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Failed to change password: ' + error.message);
      if (error.code === 'auth/requires-recent-login') {
        toast.info('Please log out and log back in to change your password');
      }
    } finally {
      setSaving(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Redirect will happen via auth state change listener in your app
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      {/* API Keys Section */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">API Keys</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gemini API Key
          </label>
          <input
            type="password"
            name="geminiApiKey"
            value={settings.apiKeys.geminiApiKey}
            onChange={handleApiKeyChange}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter your Gemini API key"
          />
          <p className="text-sm text-gray-500 mt-1">
            Required for AI optimization features. Get your key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Google AI Studio</a>.
          </p>
        </div>
      </div>
      
      {/* Notification Settings */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Notifications</h2>
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="email"
              name="email"
              checked={settings.notifications.email}
              onChange={handleNotificationChange}
              className="h-4 w-4 text-blue-600"
            />
            <label htmlFor="email" className="ml-2 text-gray-700">Email notifications</label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="push"
              name="push"
              checked={settings.notifications.push}
              onChange={handleNotificationChange}
              className="h-4 w-4 text-blue-600"
            />
            <label htmlFor="push" className="ml-2 text-gray-700">Push notifications</label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="projectUpdates"
              name="projectUpdates"
              checked={settings.notifications.projectUpdates}
              onChange={handleNotificationChange}
              className="h-4 w-4 text-blue-600"
            />
            <label htmlFor="projectUpdates" className="ml-2 text-gray-700">Project updates</label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="costAlerts"
              name="costAlerts"
              checked={settings.notifications.costAlerts}
              onChange={handleNotificationChange}
              className="h-4 w-4 text-blue-600"
            />
            <label htmlFor="costAlerts" className="ml-2 text-gray-700">Cost threshold alerts</label>
          </div>
        </div>
      </div>
      
      {/* Display Settings */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Display Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="darkMode"
              name="darkMode"
              checked={settings.display.darkMode}
              onChange={handleDisplayChange}
              className="h-4 w-4 text-blue-600"
            />
            <label htmlFor="darkMode" className="ml-2 text-gray-700">Dark Mode</label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="compactView"
              name="compactView"
              checked={settings.display.compactView}
              onChange={handleDisplayChange}
              className="h-4 w-4 text-blue-600"
            />
            <label htmlFor="compactView" className="ml-2 text-gray-700">Compact View</label>
          </div>
          
          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
              Currency
            </label>
            <select
              id="currency"
              name="currency"
              value={settings.display.currency}
              onChange={handleDisplayChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="INR">Indian Rupee (₹)</option>
              <option value="USD">US Dollar ($)</option>
              <option value="EUR">Euro (€)</option>
              <option value="GBP">British Pound (£)</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700 mb-1">
              Date Format
            </label>
            <select
              id="dateFormat"
              name="dateFormat"
              value={settings.display.dateFormat}
              onChange={handleDisplayChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Password Management */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Security</h2>
        <form onSubmit={changePassword}>
          <div className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                className={`w-full p-2 border rounded ${errors.currentPassword ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.currentPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                className={`w-full p-2 border rounded ${errors.newPassword ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                className={`w-full p-2 border rounded ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>
            
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
              disabled={saving}
            >
              {saving ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Action Buttons */}
      <div className="flex justify-between">
        <button
          onClick={saveSettings}
          className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition duration-200"
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
        
        <button
          onClick={handleLogout}
          className="bg-gray-100 text-gray-800 py-2 px-6 rounded hover:bg-gray-200 transition duration-200"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Settings;