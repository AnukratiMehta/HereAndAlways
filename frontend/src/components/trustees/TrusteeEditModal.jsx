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
  const [credentials, setCredentials] = useState(trustee.credentials || []);
  const [name, setName] = useState(trustee.trusteeName || "");
  const [email, setEmail] = useState(trustee.trusteeEmail || "");
  const [availableMessages, setAvailableMessages] = useState([]);
  const [availableAssets, setAvailableAssets] = useState([]);
  const [availableCredentials, setAvailableCredentials] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
        const [messagesRes, assetsRes, credentialsRes] = await Promise.all([
          axios.get(`/api/messages/${user.id}`, { headers }),
          axios.get(`/api/assets`, { params: { ownerId: user.id }, headers }),
          axios.get(`/api/credentials`, { params: { ownerId: user.id }, headers })
        ]);

        setAvailableMessages(messagesRes.data);
        setAvailableAssets(assetsRes.data);
        setAvailableCredentials(credentialsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.id]);

  const handleRemoveMessage = id => setMessages(messages.filter(m => m.id !== id));
  const handleRemoveAsset = id => setAssets(assets.filter(a => a.id !== id));
  const handleRemoveCredential = id => setCredentials(credentials.filter(c => c.id !== id));

  const handleAddMessage = selected => {
    if (selected && !messages.some(m => m.id === selected.value)) {
      setMessages([...messages, { id: selected.value, subject: selected.label }]);
    }
  };
  const handleAddAsset = selected => {
    if (selected && !assets.some(a => a.id === selected.value)) {
      setAssets([...assets, { id: selected.value, name: selected.label }]);
    }
  };
  const handleAddCredential = selected => {
    if (selected && !credentials.some(c => c.id === selected.value)) {
      setCredentials([...credentials, { id: selected.value, title: selected.label }]);
    }
  };

  const messageOptions = availableMessages.filter(m => !messages.some(sel => sel.id === m.id)).map(m => ({ value: m.id, label: m.subject }));
  const assetOptions = availableAssets.filter(a => !assets.some(sel => sel.id === a.id)).map(a => ({ value: a.id, label: a.name }));
  const credentialOptions = availableCredentials.filter(c => !credentials.some(sel => sel.id === c.id)).map(c => ({ value: c.id, label: c.title }));

  const handleSave = async () => {
    const originalMessageIds = (trustee.messages || []).map(m => m.id);
    const originalAssetIds = (trustee.assets || []).map(a => a.id);
    const originalCredentialIds = (trustee.credentials || []).map(c => c.id);

    const currentMessageIds = messages.map(m => m.id);
    const currentAssetIds = assets.map(a => a.id);
    const currentCredentialIds = credentials.map(c => c.id);

    const messageIdsToRemove = originalMessageIds.filter(id => !currentMessageIds.includes(id));
    const assetIdsToRemove = originalAssetIds.filter(id => !currentAssetIds.includes(id));
    const credentialIdsToRemove = originalCredentialIds.filter(id => !currentCredentialIds.includes(id));

    const messageIdsToAdd = currentMessageIds.filter(id => !originalMessageIds.includes(id));
    const assetIdsToAdd = currentAssetIds.filter(id => !originalAssetIds.includes(id));
    const credentialIdsToAdd = currentCredentialIds.filter(id => !originalCredentialIds.includes(id));

    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8081'}/api/trustees/update/${trustee.trusteeId}`,
        {
          name,
          email,
          messageIdsToRemove,
          assetIdsToRemove,
          credentialIdsToRemove,
          messageIdsToAdd,
          assetIdsToAdd,
          credentialIdsToAdd
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
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        <h2 className="text-2xl font-bold text-brandRose-dark mb-6">Edit Trustee</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brandRose focus:border-transparent" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brandRose focus:border-transparent" />
          </div>
        </div>

        {[{
          label: "Messages", items: messages, options: messageOptions, onAdd: handleAddMessage, onRemove: handleRemoveMessage,
          empty: "No messages linked"
        }, {
          label: "Assets", items: assets, options: assetOptions, onAdd: handleAddAsset, onRemove: handleRemoveAsset,
          empty: "No assets linked"
        }, {
          label: "Credentials", items: credentials, options: credentialOptions, onAdd: handleAddCredential, onRemove: handleRemoveCredential,
          empty: "No credentials linked"
        }].map(({ label, items, options, onAdd, onRemove, empty }) => (
          <div key={label} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
              <h3 className="text-lg font-medium text-gray-900 mb-2 sm:mb-0">Linked {label}</h3>
              <div className="w-full sm:w-64">
                <Select
                  options={options}
                  onChange={onAdd}
                  placeholder={loading ? "Loading..." : `Add a ${label.toLowerCase()}...`}
                  isLoading={loading}
                  noOptionsMessage={() => `No ${label.toLowerCase()}s available`}
                  className="basic-single"
                  classNamePrefix="select"
                  styles={{
                    control: (base) => ({ ...base, borderColor: '#d1d5db', borderRadius: '0.375rem', minHeight: '40px', '&:hover': { borderColor: '#d1d5db' } }),
                    menu: (base) => ({ ...base, zIndex: 9999 })
                  }}
                />
              </div>
            </div>
            {items.length > 0 ? (
              <div className="mt-3 space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center bg-white p-3 rounded-md border border-gray-200">
                    <span className="text-sm text-gray-800 truncate pr-2">{item.subject || item.name || item.title}</span>
                    <button
                      onClick={() => onRemove(item.id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-3 text-sm text-gray-500 bg-white rounded-md border border-gray-200">{empty}</div>
            )}
          </div>
        ))}

        <div className="flex justify-end gap-3 mt-8">
          <Button onClick={onClose} color="secondary" className="px-4 py-2">Cancel</Button>
          <Button onClick={handleSave} color="primary" className="px-4 py-2">
            <FontAwesomeIcon icon={icons.save} className="mr-2" />Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TrusteeEditModal;
