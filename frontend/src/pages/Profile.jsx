import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "../components/shared/Sidebar";
import ProfileBar from "../components/shared/ProfileBar";
import Header from "../components/shared/Header";
import ErrorBoundary from "../components/shared/ErrorBoundary";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../icons/icons";
import Button from "../components/shared/Button";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [view, setView] = useState("personal");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/users/${user.id}`);
        setProfileData(response.data);
        if (response.data.avatarUrl) {
          setAvatarPreview(response.data.avatarUrl);
        }
      } catch (err) {
        console.error("Failed to load profile", err);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.id]);

  const handleEditStart = (field, value) => {
    setEditingField(field);
    setEditValue(value);
  };

  const handleEditCancel = () => {
    setEditingField(null);
    setEditValue("");
  };

  const handleEditSave = async (field) => {
    try {
      const updatedData = { ...profileData, [field]: editValue };
      const response = await axios.put(`/api/users/${user.id}`, updatedData);
      setProfileData(response.data);
      updateUser(response.data);
      setEditingField(null);
    } catch (err) {
      console.error("Failed to update profile", err);
      setError("Failed to update profile");
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAvatar = async () => {
    if (!avatarFile) return;
    
    try {
      const formData = new FormData();
      formData.append("avatar", avatarFile);
      
      const response = await axios.post(`/api/users/${user.id}/avatar`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      
      setProfileData(response.data);
      updateUser(response.data);
      setAvatarFile(null);
    } catch (err) {
      console.error("Failed to upload avatar", err);
      setError("Failed to upload avatar");
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
    if (passwordError) setPasswordError(null);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords don't match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }
    
    try {
      await axios.put(`/api/users/${user.id}/password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      setPasswordError(null);
      setPasswordSuccess(true);
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to change password", err);
      setPasswordError(err.response?.data?.message || "Failed to change password");
    }
  };

  if (loading && !profileData) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="animate-pulse text-gray-500">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
       <Header 
  showSearch={false}
  title="Your Profile"
/>
        
        <div className="flex flex-1">
          <div className="flex-1 p-8 overflow-y-auto">
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}

            <div className="max-w-4xl mx-auto">
              {/* Enhanced Profile Header with Stats */}
              <div className="flex items-start gap-6 mb-8">
  {/* Avatar Upload */}
  <div className="relative group">
    <div className="w-24 h-24 rounded-full bg-brandRose text-white flex items-center justify-center text-4xl font-bold overflow-hidden">
      {avatarPreview ? (
        <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
      ) : (
        profileData?.name?.[0] || "U"
      )}
    </div>
    <button
      onClick={() => fileInputRef.current.click()}
      className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
    >
      <FontAwesomeIcon icon={icons.camera} className="text-brandRose" />
    </button>
  </div>

  {/* New: Profile Summary Cards */}
  <div className="flex-1 grid grid-cols-2 gap-4">

    {/* Storage Card */}
    <div className="bg-white p-4 rounded-lg border border-lightGray shadow-sm">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-purple-100 rounded-full text-purple-600">
          <FontAwesomeIcon icon={icons.hdd} />
        </div>
        <div>
          <p className="text-sm text-gray-500">Storage Used</p>
          <p className="font-medium">
            {profileData?.storageUsed 
              ? `${(profileData.storageUsed / (1024 * 1024)).toFixed(2)} MB` 
              : "Calculating..."}
          </p>
        </div>
      </div>
      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-brandRose h-2 rounded-full" 
          style={{ width: `${Math.min((profileData?.storageUsed || 0) / (1024 * 1024 * 10) * 100, 100)}%` }}
        ></div>
      </div>
      <p className="text-xs text-gray-500 mt-1">
        {10 - (profileData?.storageUsed / (1024 * 1024)).toFixed(2)} MB remaining
      </p>
    </div>

    {/* Membership Card */}
    <div className="bg-white p-4 rounded-lg border border-lightGray shadow-sm">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-green-100 rounded-full text-green-600">
          <FontAwesomeIcon icon={icons.crown} />
        </div>
        <div>
          <p className="text-sm text-gray-500">Membership</p>
          <p className="font-medium">
            {profileData?.membershipType || "Standard"}
          </p>
        </div>
      </div>
      <button className="mt-2 text-xs text-brandRose hover:underline">
        Upgrade plan
      </button>
    </div>

   
  </div>
</div>

              {/* Personal Information Section */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-lightGray mb-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FontAwesomeIcon icon={icons.user} className="text-brandRose" />
                  Personal Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Field */}
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        {editingField === 'name' ? (
                          <div className="flex gap-2 mt-1">
                            <input
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="flex-1 px-3 py-1 border border-lightGray rounded-md focus:outline-none focus:ring-2 focus:ring-brandRose"
                              autoFocus
                            />
                            <Button 
                              onClick={() => handleEditSave('name')}
                              size="sm"
                              color="primary"
                            >
                              Save
                            </Button>
                            <Button 
                              onClick={handleEditCancel}
                              size="sm"
                              color="secondary"
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{profileData?.name || "—"}</p>
                            <button
                              onClick={() => handleEditStart('name', profileData?.name)}
                              className="text-gray-400 hover:text-brandRose"
                            >
                              <FontAwesomeIcon icon={icons.pen} size="xs" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Email Field */}
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    {editingField === 'email' ? (
                      <div className="flex gap-2 mt-1">
                        <input
                          type="email"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="flex-1 px-3 py-1 border border-lightGray rounded-md focus:outline-none focus:ring-2 focus:ring-brandRose"
                          autoFocus
                        />
                        <Button 
                          onClick={() => handleEditSave('email')}
                          size="sm"
                          color="primary"
                        >
                          Save
                        </Button>
                        <Button 
                          onClick={handleEditCancel}
                          size="sm"
                          color="secondary"
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{profileData?.email || "—"}</p>
                        <button
                          onClick={() => handleEditStart('email', profileData?.email)}
                          className="text-gray-400 hover:text-brandRose"
                        >
                          <FontAwesomeIcon icon={icons.pen} size="xs" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Phone Field */}
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    {editingField === 'phone' ? (
                      <div className="flex gap-2 mt-1">
                        <input
                          type="tel"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="flex-1 px-3 py-1 border border-lightGray rounded-md focus:outline-none focus:ring-2 focus:ring-brandRose"
                          autoFocus
                        />
                        <Button 
                          onClick={() => handleEditSave('phone')}
                          size="sm"
                          color="primary"
                        >
                          Save
                        </Button>
                        <Button 
                          onClick={handleEditCancel}
                          size="sm"
                          color="secondary"
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{profileData?.phone || "—"}</p>
                        <button
                          onClick={() => handleEditStart('phone', profileData?.phone)}
                          className="text-gray-400 hover:text-brandRose"
                        >
                          <FontAwesomeIcon icon={icons.pen} size="xs" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Member Since */}
                  <div>
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="font-medium">
                      {profileData?.createdAt ? new Date(profileData.createdAt).toLocaleDateString() : "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Security Section */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-lightGray">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FontAwesomeIcon icon={icons.lock} className="text-brandRose" />
                  Security
                </h2>

                <div className="space-y-6">
                  {/* Password Change Section */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <p className="font-medium">Password</p>
                        <p className="text-sm text-gray-500">
                          Last changed: {profileData?.passwordUpdatedAt 
                            ? new Date(profileData.passwordUpdatedAt).toLocaleDateString() 
                            : "Never"}
                        </p>
                      </div>
                      <Button 
                        onClick={() => setView("security")}
                        size="sm"
                        color="primary"
                      >
                        Change Password
                      </Button>
                    </div>

                    {view === "security" && (
                      <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-4">
                        {passwordSuccess && (
                          <div className="p-3 bg-green-100 text-green-700 rounded text-sm">
                            Password changed successfully!
                          </div>
                        )}
                        {passwordError && (
                          <div className="p-3 bg-red-100 text-red-700 rounded text-sm">
                            {passwordError}
                          </div>
                        )}

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Current Password
                          </label>
                          <input
                            type="password"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-3 py-2 border border-lightGray rounded-md focus:outline-none focus:ring-2 focus:ring-brandRose"
                            required
                            autoComplete="current-password"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            New Password
                          </label>
                          <input
                            type="password"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-3 py-2 border border-lightGray rounded-md focus:outline-none focus:ring-2 focus:ring-brandRose"
                            required
                            minLength="8"
                            autoComplete="new-password"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-3 py-2 border border-lightGray rounded-md focus:outline-none focus:ring-2 focus:ring-brandRose"
                            required
                            minLength="8"
                            autoComplete="new-password"
                          />
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                          <Button 
                            type="button"
                            onClick={() => setView("personal")}
                            color="secondary"
                          >
                            Cancel
                          </Button>
                          <Button 
                            type="submit"
                            color="primary"
                          >
                            Change Password
                          </Button>
                        </div>
                      </form>
                    )}
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-500">
                        {profileData?.twoFactorEnabled 
                          ? "Provides an extra layer of security" 
                          : "Add an extra layer of security"}
                      </p>
                    </div>
                    <Button 
                      onClick={() => {/* Implement 2FA toggle */}}
                      size="sm"
                      color={profileData?.twoFactorEnabled ? "secondary" : "primary"}
                    >
                      {profileData?.twoFactorEnabled ? "Disable" : "Enable"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="pt-6">
            <ErrorBoundary fallback={<div className="w-64 p-4 text-red-500">Error loading profile bar</div>}>
              <ProfileBar
                type="profile"
                view={view}
                setView={setView}
                onNewItem={() => {}}
              />
            </ErrorBoundary>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Profile;