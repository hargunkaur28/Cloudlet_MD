import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Save, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user, setUser } = useAuth();
  
  // Profile state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [profileLoading, setProfileLoading] = useState(false);

  // Security state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const { data } = await api.put('/auth/profile', profileData);
      if (data.success) {
        setUser(data.user);
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    
    setPasswordLoading(true);
    try {
      const { data } = await api.put('/auth/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      if (data.success) {
        toast.success('Password updated successfully');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold mb-1">Account Settings</h1>
        <p className="text-gray-500 text-sm">Manage your profile details and security preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar info */}
        <div className="space-y-4">
          <div className="p-4 bg-lightSurface dark:bg-darkSurface border border-lightBorder dark:border-darkBorder rounded-xl">
            <h3 className="font-semibold text-sm flex items-center gap-2 mb-3">
              <User size={16} className="text-accent" />
              Public Profile
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Your name and email address are visible to people you share files with.
            </p>
          </div>
          <div className="p-4 bg-lightSurface dark:bg-darkSurface border border-lightBorder dark:border-darkBorder rounded-xl">
            <h3 className="font-semibold text-sm flex items-center gap-2 mb-3">
              <Lock size={16} className="text-accent" />
              Account Security
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              We recommend using a strong password that you don't use elsewhere.
            </p>
          </div>
        </div>

        {/* Main forms */}
        <div className="md:col-span-2 space-y-8">
          {/* Profile Form */}
          <section className="bg-lightBg dark:bg-darkBg border border-lightBorder dark:border-darkBorder rounded-xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-lightBorder dark:border-darkBorder">
              <h2 className="text-lg font-semibold">Profile Information</h2>
            </div>
            <form onSubmit={handleProfileUpdate} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <input 
                  type="text" 
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  className="w-full bg-lightSurface dark:bg-darkSurface border border-lightBorder dark:border-darkBorder rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <input 
                  type="email" 
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  className="w-full bg-lightSurface dark:bg-darkSurface border border-lightBorder dark:border-darkBorder rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                  required
                />
              </div>
              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={profileLoading}
                  className="bg-accent hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <Save size={16} />
                  {profileLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </section>

          {/* Password Form */}
          <section className="bg-lightBg dark:bg-darkBg border border-lightBorder dark:border-darkBorder rounded-xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-lightBorder dark:border-darkBorder">
              <h2 className="text-lg font-semibold">Change Password</h2>
            </div>
            <form onSubmit={handlePasswordUpdate} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Current Password</label>
                <input 
                  type="password" 
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  className="w-full bg-lightSurface dark:bg-darkSurface border border-lightBorder dark:border-darkBorder rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">New Password</label>
                  <input 
                    type="password" 
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    className="w-full bg-lightSurface dark:bg-darkSurface border border-lightBorder dark:border-darkBorder rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Confirm New Password</label>
                  <input 
                    type="password" 
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    className="w-full bg-lightSurface dark:bg-darkSurface border border-lightBorder dark:border-darkBorder rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                    required
                  />
                </div>
              </div>
              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={passwordLoading}
                  className="bg-accent hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <Lock size={16} />
                  {passwordLoading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Settings;
