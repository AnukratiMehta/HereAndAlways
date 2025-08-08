import { useState, useEffect } from "react";
import Select from "react-select";
import Button from "../shared/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../icons/icons";
import axios from "axios";

const EditAssetModal = ({ asset, onClose, onSave }) => {
  const [name, setName] = useState(asset.name || "");
  const [description, setDescription] = useState(asset.description || "");
  const [trustees, setTrustees] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedTrustees, setSelectedTrustees] = useState([]);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const ownerId = asset?.legacyOwnerId;

  useEffect(() => {
    const fetchData = async () => {
      if (!ownerId) return;
      
      setIsLoading(true);
      setError(null);
      try {
        const [trusteeRes, messageRes] = await Promise.all([
          axios.get(`/api/trustees/${ownerId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }),
          axios.get(`/api/messages/${ownerId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }),
        ]);

        setTrustees(trusteeRes.data);
        setMessages(messageRes.data);

        if (asset.linkedTrustees) {
          setSelectedTrustees(
            asset.linkedTrustees.map(t => ({
              value: t.id,
              label: t.name || "Unnamed"
            }))
          );
        }

        if (asset.linkedMessages) {
          setSelectedMessages(
            asset.linkedMessages.map(m => ({
              value: m.id,
              label: m.title || "Untitled"
            }))
          );
        }

      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load trustees/messages. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [ownerId, asset]);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const res = await axios.put(`/api/assets/${asset.id}`, {
        name,
        description,
        trusteeIds: selectedTrustees.map(t => t.value),
        messageIds: selectedMessages.map(m => m.value),
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      onSave(res.data);
      onClose();
    } catch (err) {
      console.error("Failed to update asset:", err);
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl border border-lightGray relative">
        <button
          className="absolute top-3 right-4 text-2xl text-brandRose hover:text-brandRose-dark"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Edit Asset</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block font-semibold text-gray-700 mb-1">Name</label>
          <input
            className="border rounded w-full p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold text-gray-700 mb-1">Description</label>
          <textarea
            className="border rounded w-full p-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold text-gray-700 mb-1">Trustees</label>
          <Select
            isMulti
            options={trustees.map(t => ({
              value: t.trusteeId,
              label: t.trusteeName || t.trusteeEmail || "Unnamed",
            }))}
            value={selectedTrustees}
            onChange={(selected) => setSelectedTrustees(selected || [])}
            placeholder="Choose trustees..."
            isLoading={isLoading}
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold text-gray-700 mb-1">Linked Messages</label>
          <Select
            isMulti
            options={messages.map(m => ({
              value: m.id,
              label: m.subject || "Untitled",
            }))}
            value={selectedMessages}
            onChange={(selected) => setSelectedMessages(selected || [])}
            placeholder="Choose messages..."
            isLoading={isLoading}
          />
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            color="primary" 
            onClick={handleSubmit}
            disabled={isLoading}
            icon={isLoading ? icons.spinner : icons.save}
            spin={isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditAssetModal;