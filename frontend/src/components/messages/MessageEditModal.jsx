import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../icons/icons";
import Button from "../shared/Button";

const MessageEditModal = ({ message, ownerId, onClose, onSave }) => {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [scheduledDelivery, setScheduledDelivery] = useState("");
  const [trusteeIds, setTrusteeIds] = useState([]); // MULTIPLE
  const [deliveryStatus, setDeliveryStatus] = useState("DRAFT");
  const [trustees, setTrustees] = useState([]);

  // populate
  useEffect(() => {
    if (message) {
      setSubject(message.subject || "");
      setBody(message.body || "");
      setScheduledDelivery(
        message.scheduledDelivery
          ? new Date(message.scheduledDelivery).toISOString().slice(0, 16)
          : ""
      );
      setTrusteeIds(message.trusteeIds || []); // MULTIPLE
      setDeliveryStatus(message.deliveryStatus || "DRAFT");
    }
  }, [message]);

  // load trustees
  useEffect(() => {
    if (!ownerId) return;
    axios
      .get(`/api/trustees/${ownerId}`)
      .then((res) => setTrustees(res.data))
      .catch((err) => console.error(err));
  }, [ownerId]);

  const handleSave = async () => {
    try {
      await axios.patch(`/api/messages/${message.id}`, {
        subject,
        body,
        scheduledDelivery: scheduledDelivery || null,
        trusteeIds, // array
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
            <label className="block text-gray-700">Trustees</label>
            <select
              multiple
              className="border rounded w-full p-2"
              value={trusteeIds}
              onChange={(e) =>
                setTrusteeIds(
                  Array.from(e.target.selectedOptions, (opt) => opt.value)
                )
              }
            >
              {trustees.map((t) => (
                <option key={t.trusteeId} value={t.trusteeId}>
                  {t.trusteeName}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple.</p>
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
