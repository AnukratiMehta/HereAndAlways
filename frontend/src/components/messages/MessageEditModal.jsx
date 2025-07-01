import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../icons/icons";
import Button from "../shared/Button";

const MessageEditModal = ({ message, ownerId, onClose, onSave }) => {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [scheduledDelivery, setScheduledDelivery] = useState("");
  const [trusteeId, setTrusteeId] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState("DRAFT");
  const [trustees, setTrustees] = useState([]);

  // populate the form with existing message data
  useEffect(() => {
    if (message) {
      setSubject(message.subject || "");
      setBody(message.body || "");
      setScheduledDelivery(
        message.scheduledDelivery
          ? new Date(message.scheduledDelivery).toISOString().slice(0, 16)
          : ""
      );
      setTrusteeId(message.trusteeId || "");
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
        trusteeId: trusteeId || null,
        deliveryStatus,
      });
      onSave(); // refresh list etc.
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to save changes.");
    }
  };

  if (!message) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div className="bg-white rounded shadow-lg w-full max-w-xl p-6 relative border border-lightGray">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-brandRose hover:text-brandRose-dark cursor-pointer text-2xl"
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
            <label className="block text-gray-700">Trustee</label>
            <select
              className="border rounded w-full p-2"
              value={trusteeId}
              onChange={(e) => setTrusteeId(e.target.value)}
            >
              <option value="">Select Trustee</option>
              {trustees.map((t) => (
                <option key={t.trusteeId} value={t.trusteeId}>
                  {t.trusteeName}
                </option>
              ))}
            </select>
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
  <Button
    onClick={handleSave}
    color="primary"
  >
    <FontAwesomeIcon icon={icons.save} /> Save Changes
  </Button>
</div>
      </div>
    </div>
  );
};

export default MessageEditModal;
