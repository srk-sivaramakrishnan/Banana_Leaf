'use client';
import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import {
  Settings as SettingsIcon,
  Lock,
  UserCircle,
  Bell,
  Shield,
} from 'lucide-react';

export default function Settings() {
  const [activeSection, setActiveSection] = useState<'password' | 'profile' | 'notifications' | 'security'>('password');
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [formErrors, setFormErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmNewPassword?: string;
  }>({});

  // Handle password form input changes
  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    // Clear any existing error for this field
    setFormErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // Validate password form
  const validatePasswordForm = () => {
    const errors: typeof formErrors = {};

    // Current password validation
    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }

    // New password validation
    if (!passwordForm.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters long';
    }

    // Confirm password validation
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      errors.confirmNewPassword = 'Passwords do not match';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle password change submission
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (validatePasswordForm()) {
      // Simulate password change API call
      try {
        // In a real app, this would be an actual API call
        alert('Password successfully updated!');
        
        // Reset form
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: '',
        });
      } catch (error) {
        alert('Failed to update password. Please try again.');
      }
    }
  };

  // Render section navigation
  const renderSectionNavigation = () => {
    const sections = [
      { 
        id: 'password', 
        icon: <Lock className="h-5 w-5 mr-3 text-green-600" />, 
        label: 'Change Password' 
      },
      { 
        id: 'profile', 
        icon: <UserCircle className="h-5 w-5 mr-3 text-green-600" />, 
        label: 'Profile Settings' 
      },
      { 
        id: 'notifications', 
        icon: <Bell className="h-5 w-5 mr-3 text-green-600" />, 
        label: 'Notifications' 
      },
      { 
        id: 'security', 
        icon: <Shield className="h-5 w-5 mr-3 text-green-600" />, 
        label: 'Security' 
      }
    ];

    return (
      <div className="space-y-2 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id as typeof activeSection)}
            className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${
              activeSection === section.id 
                ? 'bg-green-50 text-green-700 font-semibold' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {section.icon}
            {section.label}
          </button>
        ))}
      </div>
    );
  };

  // Render password change section
  const renderPasswordSection = () => {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Change Password</h2>
        
        <form onSubmit={handlePasswordSubmit}>
          <div className="space-y-6">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordInputChange}
                className={`w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 ${
                  formErrors.currentPassword 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'focus:ring-green-500'
                }`}
              />
              {formErrors.currentPassword && (
                <p className="text-red-500 text-sm mt-1">{formErrors.currentPassword}</p>
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
                onChange={handlePasswordInputChange}
                className={`w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 ${
                  formErrors.newPassword 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'focus:ring-green-500'
                }`}
              />
              {formErrors.newPassword && (
                <p className="text-red-500 text-sm mt-1">{formErrors.newPassword}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Password must be at least 8 characters long
              </p>
            </div>

            <div>
              <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmNewPassword"
                name="confirmNewPassword"
                value={passwordForm.confirmNewPassword}
                onChange={handlePasswordInputChange}
                className={`w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 ${
                  formErrors.confirmNewPassword 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'focus:ring-green-500'
                }`}
              />
              {formErrors.confirmNewPassword && (
                <p className="text-red-500 text-sm mt-1">{formErrors.confirmNewPassword}</p>
              )}
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-green-500 text-white font-medium rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <DashboardLayout>
      {/* Hero section */}
      <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-8 mb-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center mb-4">
            <SettingsIcon className="h-8 w-8 text-green-500 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">Account Settings</h1>
          </div>
          <p className="text-lg text-gray-700 mb-6 max-w-3xl">
            Manage your account preferences, security settings, and personal information.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Section Navigation */}
          <div>
            {renderSectionNavigation()}
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-2">
            {activeSection === 'password' && renderPasswordSection()}
            
            {/* Placeholder for other sections */}
            {activeSection === 'profile' && (
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile Settings</h2>
                <p className="text-gray-600">Profile settings coming soon...</p>
              </div>
            )}
            
            {activeSection === 'notifications' && (
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Notifications</h2>
                <p className="text-gray-600">Notification preferences coming soon...</p>
              </div>
            )}
            
            {activeSection === 'security' && (
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Security</h2>
                <p className="text-gray-600">Additional security settings coming soon...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}