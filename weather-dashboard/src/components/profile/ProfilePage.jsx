import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { profileService } from '../../services/profileService';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    website: '',
    phone_number: '',
    location: ''
  });

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await profileService.getProfile(user.id);
    
    if (data) {
      setProfile(data);
      setFormData({
        full_name: data.full_name || user.user_metadata?.full_name || '',
        bio: data.bio || '',
        website: data.website || '',
        phone_number: data.phone_number || '',
        location: data.location || ''
      });
      setAvatarPreview(data.avatar_url || user.user_metadata?.avatar_url || '');
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Upload avatar if changed
      let avatarUrl = profile?.avatar_url;
      if (avatarFile) {
        const { url, error: uploadError } = await profileService.uploadAvatar(user.id, avatarFile);
        if (uploadError) throw new Error(uploadError);
        avatarUrl = url;
      }

      // Update profile
      const { error: updateError } = await profileService.updateProfile(user.id, {
        ...formData,
        avatar_url: avatarUrl
      });

      if (updateError) throw new Error(updateError);

      setSuccess('Profile updated successfully!');
      setEditing(false);
      loadProfile(); // Reload profile
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8">
          <h1 className="text-2xl font-bold text-white">My Profile</h1>
        </div>

        {/* Profile Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          {!editing ? (
            // View Mode
            <div>
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar */}
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg">
                    {avatarPreview ? (
                      <img 
                        src={avatarPreview} 
                        alt={formData.full_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-blue-500 flex items-center justify-center">
                        <span className="text-4xl text-white">
                          {formData.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    {formData.full_name || 'No name set'}
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-gray-700">{user.email}</p>
                    </div>
                    
                    {formData.phone_number && (
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="text-gray-700">{formData.phone_number}</p>
                      </div>
                    )}
                    
                    {formData.location && (
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="text-gray-700">{formData.location}</p>
                      </div>
                    )}
                    
                    {formData.website && (
                      <div>
                        <p className="text-sm text-gray-500">Website</p>
                        <a 
                          href={formData.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-600"
                        >
                          {formData.website}
                        </a>
                      </div>
                    )}
                  </div>

                  {formData.bio && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">Bio</p>
                      <p className="text-gray-700">{formData.bio}</p>
                    </div>
                  )}

                  <button
                    onClick={() => setEditing(true)}
                    className="mt-6 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // Edit Mode
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Avatar Upload */}
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mb-4">
                  {avatarPreview ? (
                    <img 
                      src={avatarPreview} 
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-500 flex items-center justify-center">
                      <span className="text-4xl text-white">
                        {formData.full_name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                </div>
                <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg">
                  <span className="text-sm text-gray-700">Change Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white" 
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    placeholder="+1 234 567 8900"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white" 
                    placeholder="City, Country"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white" 
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"  
                  placeholder="Tell us about yourself..."
                />
              </div>
              <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  <input className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600" />
</div>

              {/* Form Actions */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    loadProfile();
                  }}
                  className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;