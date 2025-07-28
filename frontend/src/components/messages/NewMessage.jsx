import { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../icons/icons";
import Button from "../shared/Button";
import ErrorBoundary from "../shared/ErrorBoundary";

const NewMessage = ({ ownerId, onClose }) => {
  const [formData, setFormData] = useState({
    subject: "",
    body: "",
    scheduledDelivery: "",
    status: "DRAFT",
  });
  const [trustees, setTrustees] = useState([]);
  const [selectedTrustees, setSelectedTrustees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (!ownerId) return;
    
    const fetchTrustees = async () => {
      try {
        const response = await axios.get(`/api/trustees/${ownerId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setTrustees(response.data);
      } catch (err) {
        console.error("Failed to fetch trustees:", err);
        setError("Failed to load trustees. Please try again.");
      }
    };

    fetchTrustees();
  }, [ownerId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        ...formData,
        trusteeIds: selectedTrustees.map(t => t.value),
        deliveryStatus: formData.status,
      };

      await axios.post(`/api/messages/${ownerId}`, payload, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      setSuccess("Message created successfully!");
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      console.error("Failed to create message:", err);
      setError(err.response?.data?.message || "Failed to create message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
<div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm overflow-y-auto p-4">
<div className="bg-white rounded-xl shadow-xl w-full max-w-2xl border border-gray-200 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-brandRose-light border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FontAwesomeIcon icon={icons.envelope} className="text-brandRose" />
            New Message
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
            disabled={loading}
          >
            &times;
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject *
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brandRose focus:border-transparent"
                placeholder="Enter message subject"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message Body *
              </label>
              <textarea
                name="body"
                value={formData.body}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brandRose focus:border-transparent"
                placeholder="Write your message here..."
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scheduled Delivery
                </label>
                <input
                  type="datetime-local"
                  name="scheduledDelivery"
                  value={formData.scheduledDelivery}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brandRose focus:border-transparent"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brandRose focus:border-transparent"
                  disabled={loading}
                >
                  <option value="DRAFT">Draft</option>
                  <option value="QUEUED">Queued for Delivery</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trustees
              </label>
              <Select
                isMulti
                options={trustees.map(t => ({
                  value: t.trusteeId,
                  label: t.trusteeName || t.trusteeEmail || "Unnamed",
                }))}
                value={selectedTrustees}
                onChange={setSelectedTrustees}
                placeholder="Select trustees..."
                isDisabled={loading}
                className="react-select-container"
                classNamePrefix="react-select"
                styles={{
                  control: (base) => ({
                    ...base,
                    borderColor: '#d1d5db',
                    borderRadius: '0.375rem',
                    minHeight: '42px',
                    '&:hover': {
                      borderColor: '#d1d5db'
                    }
                  }),
                  menu: (base) => ({
                    ...base,
                    zIndex: 9999
                  })
                }}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                onClick={onClose}
                color="secondary"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                color="primary"
                disabled={loading || !formData.subject || !formData.body}
                icon={loading ? icons.spinner : icons.save}
                spin={loading}
              >
                {formData.status === 'DRAFT' ? 'Save Draft' : 'Schedule Message'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default function NewMessageWithErrorBoundary(props) {
  return (
    <ErrorBoundary
      fallback={
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg">
            Error loading message composer
          </div>
        </div>
      }
    >
      <NewMessage {...props} />
    </ErrorBoundary>
  );
}
