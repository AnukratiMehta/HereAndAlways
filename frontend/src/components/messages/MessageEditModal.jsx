import { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../icons/icons";
import Button from "../shared/Button";

const MessageEditModal = ({ message, ownerId, onClose, onSave }) => {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [scheduledDelivery, setScheduledDelivery] = useState("");
  const [selectedTrustees, setSelectedTrustees] = useState([]);
  const [deliveryStatus, setDeliveryStatus] = useState("DRAFT");
  const [trustees, setTrustees] = useState([]);

  // Populate fields when message is passed
  useEffect(() => {
    if (message) {
      setSubject(message.subject || "");
      setBody(message.body || "");
      setScheduledDelivery(
        message.scheduledDelivery
          ? new Date(message.scheduledDelivery).toISOString().slice(0, 16)
          : ""
      );
      setSelectedTrustees(
        message.trusteeIds?.map((id) => ({
          value: id,
          label: "", // Will be updated after fetching full trustee data
        })) || []
      );
      setDeliveryStatus(message.deliveryStatus || "DRAFT");
    }
  }, [message]);

  // Fetch trustees and match them to pre-selected IDs
  useEffect(() => {
    if (!ownerId) return;
    axios
      .get(`/api/trustees/${ownerId}`)
      .then((res) => {
        setTrustees(res.data);

        // Map selectedTrustees to full labels
        setSelectedTrustees((prev) =>
          prev.map((t) => {
            const full = res.data.find((tt) => tt.trusteeId === t.value);
            return {
              value: t.value,
              label: full?.trusteeName || full?.trusteeEmail || "Unnamed",
            };
          })
        );
      })
      .catch((err) => console.error(err));
  }, [ownerId]);

  const handleSave = async () => {
    try {
      await axios.patch(`/api/messages/${message.id}`, {
        subject,
        body,
        scheduledDelivery: scheduledDelivery || null,
        trusteeIds: selectedTrustees.map((t) => t.value),
        deliveryStatus,
      });
      onSave();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to save changes.");
    }
  };

  if (!message) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded shadow-lg w-full max-w-xl p-6 relative border border-lightGray">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-brandRose hover:text-brandRose-dark text-2xl"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Edit Message</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700">Subject</label>
            <input
              className="border rounded w-full p-2"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700">Body</label>
            <textarea
              className="border rounded w-full p-2"
              rows="4"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            ></textarea>
          </div>
          <div>
            <label className="block text-gray-700">Scheduled Delivery</label>
            <input
              type="datetime-local"
              className="border rounded w-full p-2"
              value={scheduledDelivery}
              onChange={(e) => setScheduledDelivery(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Trustees</label>
            <Select
              isMulti
              options={trustees.map((t) => ({
                value: t.trusteeId,
                label: t.trusteeName || t.trusteeEmail || "Unnamed",
              }))}
              value={selectedTrustees}
              onChange={(selected) => setSelectedTrustees(selected || [])}
              placeholder="Choose trustees..."
            />
          </div>
          <div>
            <label className="block text-gray-700">Status</label>
            <select
              className="border rounded w-full p-2"
              value={deliveryStatus}
              onChange={(e) => setDeliveryStatus(e.target.value)}
            >
              <option value="DRAFT">Draft</option>
              <option value="QUEUED">Queued</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={handleSave} color="primary">
            <FontAwesomeIcon icon={icons.save} /> Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessageEditModal;
