import { useState } from "react";
import axios from "axios";
import Button from "../shared/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../icons/icons";

const TrusteeEditModal = ({ trustee, onClose, onSave }) => {
  const [messages, setMessages] = useState(trustee.messages || []);
  const [assets, setAssets] = useState(trustee.assets || []);
  const [name, setName] = useState(trustee.trusteeName || "");
  const [email, setEmail] = useState(trustee.trusteeEmail || "");

  const handleRemoveMessage = (id) => {
    setMessages(messages.filter((m) => m.id !== id));
  };

  const handleRemoveAsset = (id) => {
    setAssets(assets.filter((a) => a.id !== id));
  };

const handleSave = async () => {
  const originalMessageIds = (trustee.messages || []).map((m) => m.id);
  const originalAssetIds = (trustee.assets || []).map((a) => a.id);

  const currentMessageIds = messages.map((m) => m.id);
  const currentAssetIds = assets.map((a) => a.id);

  const messageIdsToRemove = originalMessageIds.filter((id) => !currentMessageIds.includes(id));
  const assetIdsToRemove = originalAssetIds.filter((id) => !currentAssetIds.includes(id));

  console.log("Saving trustee updates:");
  console.log("Trustee ID:", trustee.trusteeId);
  console.log("Updated Name:", name);
  console.log("Updated Email:", email);
  console.log("Message IDs to remove:", messageIdsToRemove);
  console.log("Asset IDs to remove:", assetIdsToRemove);

  try {
    const response = await axios.patch(`/api/trustees/update/${trustee.trusteeId}`, {
      name,
      email,
      messageIdsToRemove,
      assetIdsToRemove,
    });
    console.log("Update response:", response.data);
    onSave();
  } catch (error) {
    console.error("Failed to update trustee:", error);
    alert("Something went wrong while saving changes.");
  }
};


  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded shadow-lg w-full max-w-xl p-6 relative border border-lightGray">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-4">Edit Trustee</h2>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Name</label>
          <input
            className="w-full border border-gray-300 p-2 rounded"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Email</label>
          <input
            className="w-full border border-gray-300 p-2 rounded"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <strong>Linked Messages:</strong>
          {messages.length > 0 ? (
            <ul className="list-disc ml-6 mt-1">
              {messages.map((msg) => (
                <li key={msg.id} className="flex justify-between items-center">
                  {msg.subject}
                  <button
                    onClick={() => handleRemoveMessage(msg.id)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="ml-6 text-sm text-gray-500">No messages linked.</div>
          )}
        </div>

        <div className="mb-4">
          <strong>Linked Assets:</strong>
          {assets.length > 0 ? (
            <ul className="list-disc ml-6 mt-1">
              {assets.map((asset) => (
                <li key={asset.id} className="flex justify-between items-center">
                  {asset.name}
                  <button
                    onClick={() => handleRemoveAsset(asset.id)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="ml-6 text-sm text-gray-500">No assets linked.</div>
          )}
        </div>

        <div className="flex justify-end mt-6 space-x-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button color="primary" onClick={handleSave}>
            <FontAwesomeIcon icon={icons.save} className="mr-2" /> Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TrusteeEditModal;
