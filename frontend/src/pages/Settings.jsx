import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "../components/shared/Sidebar";
import Header from "../components/shared/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../icons/icons";
import Button from "../components/shared/Button";
import ConfirmDeleteModal from "../components/shared/ConfirmDeleteModal";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    notifications: {
      emailEnabled: true,
      frequency: "instant"
    },
    account: {
      recoveryEmail: "",
      recoveryPhone: "",
      inactivityPeriod: 90,
      warningEmails: 3
    }
  });
  const [activeTab, setActiveTab] = useState("notifications");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  // Simulate API delay
  const simulateAPICall = () => {
    return new Promise(resolve => setTimeout(resolve, 1500));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await simulateAPICall();
      setSuccess("Settings saved successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      await simulateAPICall();
      // Show success before logging out
      setSuccess("Account deleted successfully. Redirecting...");
      setTimeout(() => {
        logout();
        navigate("/");
      }, 2000);
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleDeactivateAccount = async () => {
    try {
      setLoading(true);
      await simulateAPICall();
      // Show success before logging out
      setSuccess("Account deactivated successfully. Redirecting...");
      setTimeout(() => {
        logout();
        navigate("/");
      }, 2000);
    } finally {
      setLoading(false);
      setShowDeactivateConfirm(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header 
          showSearch={false}
          title="Account Settings"
        />
        
        <div className="flex-1 p-8 overflow-y-auto">
          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
              {success}
            </div>
          )}

          <div className="max-w-4xl mx-auto">
            {/* Settings Tabs */}
            <div className="flex border-b border-lightGray mb-6">
              <button
                className={`cursor-pointer px-4 py-2 font-medium ${activeTab === "notifications" ? "text-brandRose border-b-2 border-brandRose" : "text-gray-500"}`}
                onClick={() => setActiveTab("notifications")}
              >
                Notifications
              </button>
              <button
                className={`cursor-pointer px-4 py-2 font-medium ${activeTab === "account" ? "text-brandRose border-b-2 border-brandRose" : "text-gray-500"}`}
                onClick={() => setActiveTab("account")}
              >
                Account
              </button>
              <button
                className={`cursor-pointer px-4 py-2 font-medium ${activeTab === "inactivity" ? "text-brandRose border-b-2 border-brandRose" : "text-gray-500"}`}
                onClick={() => setActiveTab("inactivity")}
              >
                Inactivity Settings
              </button>
            </div>

            {/* Notification Preferences */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-lightGray">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FontAwesomeIcon icon={icons.bell} className="text-brandRose" />
                    Email Notifications
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email notifications</p>
                        <p className="text-sm text-gray-500">
                          Receive important account notifications via email
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications.emailEnabled}
                          onChange={() => setSettings({
                            ...settings,
                            notifications: {
                              ...settings.notifications,
                              emailEnabled: !settings.notifications.emailEnabled
                            }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-brandRose transition-colors">
                          <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.notifications.emailEnabled ? 'translate-x-6' : ''}`}></div>
                        </div>
                      </label>
                    </div>

                    <div className="pt-4 border-t border-lightGray">
                      <p className="font-medium mb-2">Notification frequency</p>
                      <div className="space-y-2">
                        {["instant", "daily", "weekly"].map((freq) => (
                          <label key={freq} className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="frequency"
                              checked={settings.notifications.frequency === freq}
                              onChange={() => setSettings({
                                ...settings,
                                notifications: {
                                  ...settings.notifications,
                                  frequency: freq
                                }
                              })}
                              className="text-brandRose focus:ring-brandRose"
                              disabled={!settings.notifications.emailEnabled}
                            />
                            <span className={!settings.notifications.emailEnabled ? "text-gray-400" : ""}>
                              {freq === "instant" ? "Instant notifications" : 
                               freq === "daily" ? "Daily digest" : "Weekly summary"}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Account Settings */}
            {activeTab === "account" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-lightGray">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FontAwesomeIcon icon={icons.userCog} className="text-brandRose" />
                    Account Management
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-2">Recovery Options</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Recovery Email
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="email"
                              value={settings.account.recoveryEmail}
                              onChange={(e) => setSettings({
                                ...settings,
                                account: {
                                  ...settings.account,
                                  recoveryEmail: e.target.value
                                }
                              })}
                              className="flex-1 px-3 py-2 border border-lightGray rounded-md focus:outline-none focus:ring-2 focus:ring-brandRose"
                              placeholder="Add backup email"
                            />
                            <Button 
                              size="sm"
                              onClick={() => {
                                setSuccess("Verification email sent!");
                                setTimeout(() => setSuccess(null), 3000);
                              }}
                            >
                              Verify
                            </Button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Recovery Phone
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="tel"
                              value={settings.account.recoveryPhone}
                              onChange={(e) => setSettings({
                                ...settings,
                                account: {
                                  ...settings.account,
                                  recoveryPhone: e.target.value
                                }
                              })}
                              className="flex-1 px-3 py-2 border border-lightGray rounded-md focus:outline-none focus:ring-2 focus:ring-brandRose"
                              placeholder="Add phone number"
                            />
                            <Button 
                              size="sm"
                              onClick={() => {
                                setSuccess("Verification code sent!");
                                setTimeout(() => setSuccess(null), 3000);
                              }}
                            >
                              Verify
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-lightGray space-y-4">
                      <div>
                        <h3 className="font-medium mb-2">Account Status</h3>
                        <div className="flex flex-col sm:flex-row gap-4">
                          <Button 
                            onClick={() => setShowDeactivateConfirm(true)}
                            color="warning"
                            className="w-full sm:w-auto"
                          >
                            <FontAwesomeIcon icon={icons.pause} className="mr-2" />
                            Deactivate Account
                          </Button>
                          <Button 
                            onClick={() => setShowDeleteConfirm(true)}
                            color="danger"
                            className="w-full sm:w-auto"
                          >
                            <FontAwesomeIcon icon={icons.trash} className="mr-2" />
                            Delete Account Permanently
                          </Button>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                          Deactivating will temporarily disable your account. Deleting is permanent.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Inactivity Settings */}
            {activeTab === "inactivity" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-lightGray">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FontAwesomeIcon icon={icons.clock} className="text-brandRose" />
                    Inactivity Configuration
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Inactivity Period (Days)
                      </label>
                      <p className="text-sm text-gray-500 mb-2">
                        After this period of inactivity, your trustees will be notified
                      </p>
                      <input
                        type="range"
                        min="7"
                        max="365"
                        value={settings.account.inactivityPeriod}
                        onChange={(e) => setSettings({
                          ...settings,
                          account: {
                            ...settings.account,
                            inactivityPeriod: parseInt(e.target.value)
                          }
                        })}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between mt-2">
                        <span>7 days</span>
                        <span className="font-medium">
                          {settings.account.inactivityPeriod} days
                        </span>
                        <span>1 year</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-lightGray">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Warning Emails Before Activation
                      </label>
                      <p className="text-sm text-gray-500 mb-2">
                        Number of reminder emails you'll receive before trustees are notified
                      </p>
                      <div className="flex gap-2">
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                          <button
                            key={num}
                            onClick={() => setSettings({
                              ...settings,
                              account: {
                                ...settings.account,
                                warningEmails: num
                              }
                            })}
                            className={`px-4 py-2 rounded-md border ${
                              settings.account.warningEmails === num
                                ? "bg-brandRose text-white border-brandRose"
                                : "border-lightGray hover:bg-gray-50"
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 flex justify-end">
              <Button 
                onClick={handleSave}
                loading={loading}
                color="primary"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modals */}
      {showDeactivateConfirm && (
        <ConfirmDeleteModal
          isOpen={showDeactivateConfirm}
          onClose={() => setShowDeactivateConfirm(false)}
          onConfirm={handleDeactivateAccount}
          onCancel={() => setShowDeactivateConfirm(false)}
          title="Deactivate Account"
          itemName="your account? This will temporarily disable it."
          confirmText={loading ? "Deactivating..." : "Deactivate"}
          loading={loading}
        />
      )}

      {showDeleteConfirm && (
        <ConfirmDeleteModal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleDeleteAccount}
          onCancel={() => setShowDeleteConfirm(false)}
          title="Delete Account Permanently"
          itemName="your account? This cannot be undone."
          confirmText={loading ? "Deleting..." : "Delete Forever"}
          loading={loading}
        />
      )}
    </div>
  );
};

export default Settings;