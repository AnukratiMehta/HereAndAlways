import { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "../components/shared/Sidebar";
import Header from "../components/shared/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../icons/icons";
import Button from "../components/shared/Button";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    name: user?.name || "John Doe",
    email: user?.email || "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    createdAt: new Date().toISOString(),
    membershipType: "Standard",
    passwordUpdatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    twoFactorEnabled: false
  });
  const [loading, setLoading] = useState(false);
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
  const [success, setSuccess] = useState(null);

  // Simulate API delay
  const simulateAPICall = () => {
    return new Promise(resolve => setTimeout(resolve, 1500));
  };

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
      setLoading(true);
      await simulateAPICall();
      const updatedData = { ...profileData, [field]: editValue };
      setProfileData(updatedData);
      updateUser(updatedData);
      setEditingField(null);
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } finally {
      setLoading(false);
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
      setLoading(true);
      await simulateAPICall();
      setSuccess("Profile picture updated successfully!");
      setTimeout(() => setSuccess(null), 3000);
      setAvatarFile(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSuccess("Passwords don't match");
      setTimeout(() => setSuccess(null), 3000);
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setSuccess("Password must be at least 8 characters");
      setTimeout(() => setSuccess(null), 3000);
      return;
    }
    
    try {
      setLoading(true);
      await simulateAPICall();
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      setSuccess("Password changed successfully!");
      setTimeout(() => {
        setSuccess(null);
        setView("personal");
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  const toggleTwoFactor = async () => {
    try {
      setLoading(true);
      await simulateAPICall();
      setProfileData({
        ...profileData,
        twoFactorEnabled: !profileData.twoFactorEnabled
      });
      setSuccess(
        profileData.twoFactorEnabled 
          ? "Two-factor authentication disabled" 
          : "Two-factor authentication enabled"
      );
      setTimeout(() => setSuccess(null), 3000);
    } finally {
      setLoading(false);
    }
  };

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
            {success && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                {success}
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
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    accept="image/*"
                    className="hidden"
                  />
                  {avatarFile && (
                    <div className="mt-2 flex gap-2">
                      <Button 
                        onClick={uploadAvatar}
                        size="sm"
                        loading={loading}
                      >
                        Save Photo
                      </Button>
                      <Button 
                        onClick={() => {
                          setAvatarFile(null);
                          setAvatarPreview(null);
                        }}
                        size="sm"
                        color="secondary"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>

                {/* Profile Summary Cards */}
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
                          5.12 MB
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-brandRose h-2 rounded-full" 
                        style={{ width: `51.2%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      4.88 MB remaining
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
                    <button 
                      className="mt-2 text-xs text-brandRose hover:underline"
                      onClick={() => {
                        setSuccess("Redirecting to upgrade page...");
                        setTimeout(() => navigate("/pricing"), 2000);
                      }}
                    >
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
                              loading={loading}
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
                          loading={loading}
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
                          loading={loading}
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
                            loading={loading}
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
                      onClick={toggleTwoFactor}
                      size="sm"
                      color={profileData?.twoFactorEnabled ? "secondary" : "primary"}
                      loading={loading}
                    >
                      {profileData?.twoFactorEnabled ? "Disable" : "Enable"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;