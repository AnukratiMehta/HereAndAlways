import { useState, useEffect } from "react";
import Select from "react-select";
import Button from "../shared/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../icons/icons";
import axios from "axios";

const EditAssetModal = ({ asset, ownerId, onClose, onSave }) => {
  const [name, setName] = useState(asset.name || "");
  const [trusteeIds, setTrusteeIds] = useState(
    asset.linkedTrustees?.map((t) => ({ value: t.id, label: t.name })) || []
  );
  const [messageIds, setMessageIds] = useState(
    asset.linkedMessages?.map((m) => ({ value: m.id, label: m.title })) || []
  );
  const [trustees, setTrustees] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!ownerId) return;

    const fetchData = async () => {
      try {
        const [trusteeRes, messageRes] = await Promise.all([
          axios.get(`/api/trustees/${ownerId}`),
          axios.get(`/api/messages/${ownerId}`),
        ]);
        setTrustees(trusteeRes.data);
        setMessages(messageRes.data);
      } catch (err) {
        console.error("Failed to load trustees/messages:", err);
      }
    };

    fetchData();
  }, [ownerId]);

  const handleSubmit = async () => {
    try {
      const res = await axios.put(`/api/assets/${asset.id}`, {
        name,
        trusteeIds: trusteeIds.map((t) => t.value),
        messageIds: messageIds.map((m) => m.value),
      });
      onSave(res.data); // ✅ pass updated asset to parent
      onClose();
    } catch (err) {
      console.error("Failed to update asset:", err);
      alert("Something went wrong.");
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

        <div className="mb-4">
          <label className="block font-semibold text-gray-700 mb-1">Name</label>
          <input
            className="border rounded w-full p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold text-gray-700 mb-1">Trustees</label>
          <Select
            isMulti
            value={trusteeIds}
            onChange={(selected) => setTrusteeIds(selected || [])}
            options={trustees.map((t) => ({
              value: t.trusteeId,
              label: t.trusteeName || t.trusteeEmail || "Unnamed",
            }))}
            placeholder="Choose trustees..."
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold text-gray-700 mb-1">Messages</label>
          <Select
            isMulti
            value={messageIds}
            onChange={(selected) => setMessageIds(selected || [])}
            options={messages.map((m) => ({
              value: m.id,
              label: m.subject,
            }))}
            placeholder="Choose messages..."
          />
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button onClick={onClose}>Cancel</Button>
          <Button color="primary" onClick={handleSubmit}>
            <FontAwesomeIcon icon={icons.save} className="mr-2" /> Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditAssetModal;
