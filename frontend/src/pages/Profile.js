import React, { useState, useEffect } from 'react';
import { authService } from '../services/api';
import { User, Mail, Phone, Shield } from 'lucide-react';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authService.getProfile();
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!profile) return <div className="text-center py-20">Unable to load profile.</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-32 bg-blue-600"></div>
        <div className="px-8 pb-8">
          <div className="relative -mt-16 mb-6">
            <div className="w-32 h-32 bg-white rounded-2xl border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
              {profile.profile_photo ? (
                <img src={profile.profile_photo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-16 h-16 text-gray-300" />
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{profile.first_name} {profile.last_name}</h1>
              <p className="text-gray-500">@{profile.username}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">Email Address</p>
                  <p className="text-gray-900">{profile.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">Phone Number</p>
                  <p className="text-gray-900">{profile.phone_number || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">Account Role</p>
                  <p className="text-gray-900">{profile.role === 1 ? 'Super Admin' : profile.role === 2 ? 'Manager' : 'Customer'}</p>
                </div>
              </div>
            </div>

            <button className="w-full mt-8 bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-black transition">
              Edit Profile Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
