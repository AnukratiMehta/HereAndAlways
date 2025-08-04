import { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../icons/icons";
import Button from "../shared/Button";

const MessageEditModal = ({ message, ownerId, onClose, onSave, onDelete }) => {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [scheduledDelivery, setScheduledDelivery] = useState("");
  const [selectedTrustees, setSelectedTrustees] = useState([]);
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [deliveryStatus, setDeliveryStatus] = useState("DRAFT");
  const [trustees, setTrustees] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);

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

  // Fetch trustees and assets when ownerId changes
  useEffect(() => {
    if (!ownerId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch trustees (original working approach)
        const trusteesRes = await axios.get(`/api/trustees/${ownerId}`);
        setTrustees(trusteesRes.data);

        // Update selected trustees with labels
        setSelectedTrustees(prev => 
          prev.map(t => {
            const full = trusteesRes.data.find(tt => tt.trusteeId === t.value);
            return {
              value: t.value,
              label: full?.trusteeName || full?.trusteeEmail || "Unnamed"
            };
          })
        );

        // Fetch all available assets for the owner
        const assetsRes = await axios.get(`/api/assets?ownerId=${ownerId}`);
        setAssets(assetsRes.data);

        // If editing existing message, fetch its linked assets
        if (message?.id) {
          const linkedAssetsRes = await axios.get(`/api/assets?messageId=${message.id}`);
          setSelectedAssets(
            linkedAssetsRes.data.map(a => ({
              value: a.id,
              label: a.name
            }))
          );
        }
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ownerId, message?.id]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const payload = {
        subject,
        body,
        scheduledDelivery: scheduledDelivery || null,
        trusteeIds: selectedTrustees.map(t => t.value),
        assetIds: selectedAssets.map(a => a.value), // Include asset IDs
        deliveryStatus
      };

      const response = await axios.patch(`/api/messages/${message.id}`, payload);
      onSave();
      onClose();
    } catch (err) {
      console.error("Update error:", err);
      alert(`Update failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!message) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-brandRose-light border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <FontAwesomeIcon icon={icons.pen} className="mr-2 text-brandRose" />
            Edit Message
          </h2>
        </div>

        <div className="p-6 space-y-6">
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brandRose"></div>
            </div>
          )}

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
              <label className="block text-sm font-medium text-gray-700 mb-1">Linked Assets</label>
              <Select
                isMulti
                options={assets.map(a => ({
                  value: a.id,
                  label: a.name,
                }))}
                value={selectedAssets}
                onChange={(selected) => setSelectedAssets(selected || [])}
                placeholder="Select assets to link..."
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trustees</label>
              <Select
                isMulti
                options={trustees.map(t => ({
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

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
          <Button 
            onClick={() => onDelete(message)} 
            color="danger"
            className="px-4 py-2"
            icon={icons.trash}
            disabled={loading}
          >
            Delete
          </Button>
          <div className="flex space-x-3">
            <Button 
              onClick={onClose} 
              color="secondary"
              className="px-4 py-2"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              color="primary"
              className="px-4 py-2"
              disabled={loading}
            >
              <FontAwesomeIcon icon={icons.save} className="mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageEditModal;