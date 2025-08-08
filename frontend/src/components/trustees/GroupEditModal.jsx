import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../icons/icons";
import Button from "../shared/Button";
import { useAuth } from "../../contexts/AuthContext";

const GroupEditModal = ({ group, trustees, onClose, onSave }) => {
  const { user } = useAuth();
  const [availableMessages, setAvailableMessages] = useState([]);
  const [availableAssets, setAvailableAssets] = useState([]);
  const [availableCredentials, setAvailableCredentials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fullTrustees = group.trusteeIds
    .map(id => trustees.find(t => t.trusteeId === id))
    .filter(Boolean);

  const getSharedItems = (items) => {
    if (fullTrustees.length === 0) return new Set();
    return fullTrustees.reduce((shared, trustee) => {
      const trusteeItems = trustee[items] || [];
      const trusteeItemIds = new Set(trusteeItems.map(item => item.id));
      if (!shared) return trusteeItemIds;
      return new Set([...shared].filter(id => trusteeItemIds.has(id)));
    }, null) || new Set();
  };

  const sharedMessages = getSharedItems('messages');
  const sharedAssets = getSharedItems('assets');
  const sharedCredentials = getSharedItems('credentials');

  const [selectedMessages, setSelectedMessages] = useState([]);
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [selectedCredentials, setSelectedCredentials] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      setLoading(true);
      setError(null);
      try {
        const headers = { 
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json'
        };
        
        const [messagesRes, assetsRes, credentialsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL || ''}/api/messages/${user.id}`, { headers }),
          axios.get(`${import.meta.env.VITE_API_URL || ''}/api/assets`, { 
            params: { ownerId: user.id },
            headers 
          }),
          axios.get(`${import.meta.env.VITE_API_URL || ''}/api/credentials`, { 
            params: { ownerId: user.id },
            headers 
          })
        ]);

        setAvailableMessages(messagesRes.data);
        setAvailableAssets(assetsRes.data);
        setAvailableCredentials(credentialsRes.data);

        setSelectedMessages(messagesRes.data.filter(m => sharedMessages.has(m.id)));
        setSelectedAssets(assetsRes.data.filter(a => sharedAssets.has(a.id)));
        setSelectedCredentials(credentialsRes.data.filter(c => sharedCredentials.has(c.id)));
      } catch (error) {
        console.error("Error fetching items:", error);
        setError("Failed to load items. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.id]);

  const handleAdd = (type, selected) => {
    if (!selected) return;
    const item = { 
      id: selected.value, 
      subject: selected.label, 
      name: selected.label, 
      title: selected.label 
    };

    switch (type) {
      case "message":
        setSelectedMessages(prev => [...prev, item]);
        break;
      case "asset":
        setSelectedAssets(prev => [...prev, item]);
        break;
      case "credential":
        setSelectedCredentials(prev => [...prev, item]);
        break;
      default:
        break;
    }
  };

const handleRemove = (type, id) => {
  const itemId = String(id);
  
  switch (type) {
    case "message":
      setSelectedMessages(prev => prev.filter(m => String(m.id) !== itemId));
      break;
    case "asset":
      setSelectedAssets(prev => prev.filter(a => String(a.id) !== itemId));
      break;
    case "credential":
      setSelectedCredentials(prev => prev.filter(c => String(c.id) !== itemId));
      break;
    default:
      break;
  }
};

const saveChanges = async () => {
  setLoading(true);
  setError(null);
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    const baseUrl = import.meta.env.VITE_API_URL || '';

const updates = group.trusteeIds.map(trusteeId => {
  const trustee = trustees.find(t => t.trusteeId === trusteeId);
  if (!trustee) return null;

  const originalMessageIds = (trustee.messages || []).map(m => String(m.id));
  const originalAssetIds = (trustee.assets || []).map(a => String(a.id));
  const originalCredentialIds = (trustee.credentials || []).map(c => String(c.id));

  const currentMessageIds = selectedMessages.map(m => String(m.id));
  const currentAssetIds = selectedAssets.map(a => String(a.id));
  const currentCredentialIds = selectedCredentials.map(c => String(c.id));

  return {
    trusteeId,
    updateData: {
      name: trustee.trusteeName,
      email: trustee.trusteeEmail,
      messageIdsToRemove: originalMessageIds.filter(id => !currentMessageIds.includes(id)),
      messageIdsToAdd: currentMessageIds.filter(id => !originalMessageIds.includes(id)),
      assetIdsToRemove: originalAssetIds.filter(id => !currentAssetIds.includes(id)),
      assetIdsToAdd: currentAssetIds.filter(id => !originalAssetIds.includes(id)),
      credentialIdsToRemove: originalCredentialIds.filter(id => !currentCredentialIds.includes(id)),
      credentialIdsToAdd: currentCredentialIds.filter(id => !originalCredentialIds.includes(id))
    },
    updatedTrustee: {
      ...trustee,
      messages: selectedMessages,
      assets: selectedAssets,
      credentials: selectedCredentials
    }
  };
}).filter(Boolean);

    await Promise.all(
      updates.map(({ trusteeId, updateData }) => 
        axios.patch(`${baseUrl}/api/trustees/update/${trusteeId}`, updateData, { headers })
      )
    );

    onSave({
      updatedGroup: {
        ...group,
        sharedMessages: selectedMessages,
        sharedAssets: selectedAssets,
        sharedCredentials: selectedCredentials,
        trusteeIds: group.trusteeIds
      },
      updatedTrustees: trustees.map(trustee => {
        const update = updates.find(u => u.trusteeId === trustee.trusteeId);
        return update ? update.updatedTrustee : trustee;
      })
    });

    onClose();
  } catch (error) {
    console.error("Error saving group changes:", error);
    setError(error.response?.data?.message || "Failed to save changes. Please try again.");
  } finally {
    setLoading(false);
  }
};

  const messageOptions = availableMessages
    .filter(m => !selectedMessages.some(sm => sm.id === m.id))
    .map(m => ({ value: m.id, label: m.subject }));

  const assetOptions = availableAssets
    .filter(a => !selectedAssets.some(sa => sa.id === a.id))
    .map(a => ({ value: a.id, label: a.name }));

  const credentialOptions = availableCredentials
    .filter(c => !selectedCredentials.some(sc => sc.id === c.id))
    .map(c => ({ value: c.id, label: c.title }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        <h2 className="text-2xl font-bold text-brandRose-dark mb-6">Edit Group: {group.name}</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {[
          { label: "Messages", data: selectedMessages, options: messageOptions, type: "message" },
          { label: "Assets", data: selectedAssets, options: assetOptions, type: "asset" },
          { label: "Credentials", data: selectedCredentials, options: credentialOptions, type: "credential" }
        ].map(({ label, data, options, type }) => (
          <div key={type} className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
              <h3 className="text-lg font-medium text-gray-900 mb-2 sm:mb-0">Shared {label}</h3>
              <div className="w-full sm:w-64">
                <Select
                  options={options}
                  onChange={selected => handleAdd(type, selected)}
                  placeholder={loading ? "Loading..." : `Add ${label.toLowerCase()}...`}
                  isLoading={loading}
                  noOptionsMessage={() => `No ${label.toLowerCase()}s available`}
                  styles={{
                    control: base => ({ ...base, borderColor: '#d1d5db', borderRadius: '0.375rem', minHeight: '40px' }),
                    menu: base => ({ ...base, zIndex: 9999 })
                  }}
                />
              </div>
            </div>
            {data.length > 0 ? (
              <div className="space-y-2">
                {data.map(item => (
                  <div key={item.id} className="flex justify-between items-center bg-white p-2 rounded border border-gray-200">
                    <span className="text-sm text-gray-800 truncate pr-2">{item.subject || item.name || item.title}</span>
                    <button
                      onClick={() => handleRemove(type, item.id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-3 text-sm text-gray-500 bg-white rounded-md border border-gray-200">No {label.toLowerCase()}s linked</div>
            )}
          </div>
        ))}

        <div className="flex justify-end mt-6 space-x-3">
          <Button onClick={onClose} color="secondary" className="px-4 py-2" disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={saveChanges} 
            color="primary" 
            className="px-4 py-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <FontAwesomeIcon icon={icons.spinner} spin className="mr-2" />
                Saving...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={icons.save} className="mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

GroupEditModal.propTypes = {
  group: PropTypes.object.isRequired,
  trustees: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired
};

export default GroupEditModal;