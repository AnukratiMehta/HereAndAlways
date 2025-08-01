import { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../icons/icons";
import Button from "../shared/Button";
import { useAuth } from "../../contexts/AuthContext";

const TrusteeEditModal = ({ trustee, onClose, onTrusteeUpdated }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState(trustee.messages || []);
  const [assets, setAssets] = useState(trustee.assets || []);
  const [name, setName] = useState(trustee.trusteeName || "");
  const [email, setEmail] = useState(trustee.trusteeEmail || "");
  const [availableMessages, setAvailableMessages] = useState([]);
  const [availableAssets, setAvailableAssets] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      setLoading(true);
      try {
        const [messagesRes, assetsRes] = await Promise.all([
          axios.get(`/api/messages/${user.id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          axios.get(`/api/assets`, {
            params: { ownerId: user.id },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
        ]);

        setAvailableMessages(messagesRes.data);
        setAvailableAssets(assetsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  const handleRemoveMessage = (id) => {
    setMessages(messages.filter((m) => m.id !== id));
  };

  const handleRemoveAsset = (id) => {
    setAssets(assets.filter((a) => a.id !== id));
  };

  const handleAddMessage = (selectedOption) => {
    if (selectedOption && !messages.some(m => m.id === selectedOption.value)) {
      setMessages([...messages, {
        id: selectedOption.value,
        subject: selectedOption.label
      }]);
    }
  };

  const handleAddAsset = (selectedOption) => {
    if (selectedOption && !assets.some(a => a.id === selectedOption.value)) {
      setAssets([...assets, {
        id: selectedOption.value,
        name: selectedOption.label
      }]);
    }
  };

  const messageOptions = availableMessages
    .filter(msg => !messages.some(m => m.id === msg.id))
    .map(msg => ({
      value: msg.id,
      label: msg.subject
    }));

  const assetOptions = availableAssets
    .filter(asset => !assets.some(a => a.id === asset.id))
    .map(asset => ({
      value: asset.id,
      label: asset.name
    }));

  const handleSave = async () => {
    const originalMessageIds = (trustee.messages || []).map((m) => m.id);
    const currentMessageIds = messages.map((m) => m.id);
    const messageIdsToRemove = originalMessageIds.filter(
      (id) => !currentMessageIds.includes(id)
    );

    const originalAssetIds = (trustee.assets || []).map((a) => a.id);
    const currentAssetIds = assets.map((a) => a.id);
    const assetIdsToRemove = originalAssetIds.filter(
      (id) => !currentAssetIds.includes(id)
    );

    const messageIdsToAdd = currentMessageIds.filter(
      (id) => !originalMessageIds.includes(id)
    );
    const assetIdsToAdd = currentAssetIds.filter(
      (id) => !originalAssetIds.includes(id)
    );

    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8081'}/api/trustees/update/${trustee.trusteeId}`,
        {
          name,
          email,
          messageIdsToRemove,
          assetIdsToRemove,
          messageIdsToAdd,
          assetIdsToAdd
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      onTrusteeUpdated();
      onClose();
    } catch (error) {
      console.error("Failed to update trustee:", error);
      alert(error.response?.data?.message || "Something went wrong while saving changes.");
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 relative border border-lightGray">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold text-brandRose-dark mb-6">Edit Trustee</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brandRose focus:border-transparent"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brandRose focus:border-transparent"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
              <h3 className="text-lg font-medium text-gray-900 mb-2 sm:mb-0">Linked Messages</h3>
              <div className="w-full sm:w-64">
                <Select
                  options={messageOptions}
                  onChange={handleAddMessage}
                  placeholder={loading ? "Loading..." : "Add a message..."}
                  isLoading={loading}
                  noOptionsMessage={() => "No messages available"}
                  className="basic-single"
                  classNamePrefix="select"
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderColor: '#d1d5db',
                      borderRadius: '0.375rem',
                      minHeight: '40px',
                      '&:hover': {
                        borderColor: '#d1d5db'
                      }
                    }),
                    menu: (base) => ({
                      ...base,
                      zIndex: 9999
                    })
                  }}
                />
              </div>
            </div>
            
            {messages.length > 0 ? (
              <div className="mt-3 space-y-2">
                {messages.map((msg) => (
                  <div key={msg.id} className="flex justify-between items-center bg-white p-3 rounded-md border border-gray-200">
                    <span className="text-sm text-gray-800 truncate pr-2">{msg.subject}</span>
                    <button
                      onClick={() => handleRemoveMessage(msg.id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-3 text-sm text-gray-500 bg-white rounded-md border border-gray-200">
                No messages linked
              </div>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
              <h3 className="text-lg font-medium text-gray-900 mb-2 sm:mb-0">Linked Assets</h3>
              <div className="w-full sm:w-64">
                <Select
                  options={assetOptions}
                  onChange={handleAddAsset}
                  placeholder={loading ? "Loading..." : "Add an asset..."}
                  isLoading={loading}
                  noOptionsMessage={() => "No assets available"}
                  className="basic-single"
                  classNamePrefix="select"
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderColor: '#d1d5db',
                      borderRadius: '0.375rem',
                      minHeight: '40px',
                      '&:hover': {
                        borderColor: '#d1d5db'
                      }
                    }),
                    menu: (base) => ({
                      ...base,
                      zIndex: 9999
                    })
                  }}
                />
              </div>
            </div>
            
            {assets.length > 0 ? (
              <div className="mt-3 space-y-2">
                {assets.map((asset) => (
                  <div key={asset.id} className="flex justify-between items-center bg-white p-3 rounded-md border border-gray-200">
                    <span className="text-sm text-gray-800 truncate pr-2">{asset.name}</span>
                    <button
                      onClick={() => handleRemoveAsset(asset.id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-3 text-sm text-gray-500 bg-white rounded-md border border-gray-200">
                No assets linked
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <Button 
            onClick={onClose} 
            color="secondary"
            className="px-4 py-2"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            color="primary"
            className="px-4 py-2"
          >
            <FontAwesomeIcon icon={icons.save} className="mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TrusteeEditModal;