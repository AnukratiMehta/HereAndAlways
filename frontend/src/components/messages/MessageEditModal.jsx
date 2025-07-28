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
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 border border-gray-200 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-brandRose-light border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <FontAwesomeIcon icon={icons.edit} className="mr-2 text-brandRose" />
            Edit Message
          </h2>
          
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brandRose focus:border-transparent"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Message subject"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brandRose focus:border-transparent min-h-[120px]"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your message here..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Delivery</label>
                <input
                  type="datetime-local"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brandRose focus:border-transparent"
                  value={scheduledDelivery}
                  onChange={(e) => setScheduledDelivery(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brandRose focus:border-transparent"
                  value={deliveryStatus}
                  onChange={(e) => setDeliveryStatus(e.target.value)}
                >
                  <option value="DRAFT">Draft</option>
                  <option value="QUEUED">Queued</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trustees</label>
              <Select
                isMulti
                options={trustees.map((t) => ({
                  value: t.trusteeId,
                  label: t.trusteeName || t.trusteeEmail || "Unnamed",
                }))}
                value={selectedTrustees}
                onChange={(selected) => setSelectedTrustees(selected || [])}
                placeholder="Select trustees..."
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
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

export default MessageEditModal;
