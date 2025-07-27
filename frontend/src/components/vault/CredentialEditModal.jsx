import { useState, useEffect } from "react";
import Select from "react-select";
import { supabase } from "../../utils/supabaseClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../icons/icons";
import Button from "../shared/Button";
import {
  generateAESKey,
  exportKeyAsBase64,
  encryptText
} from "../../utils/encryptionUtils";
import axios from "axios";

const categoryOptions = [
  { value: "SOCIAL", label: "Social Media" },
  { value: "BANK", label: "Bank Account" },
  { value: "EMAIL", label: "Email" },
  { value: "OTHER", label: "Other" },
];

const CredentialEditModal = ({ credential, ownerId, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: credential.title,
    usernameOrCardNumber: credential.usernameOrCardNumber,
    passwordOrPin: "",
    category: {
      value: credential.category,
      label:
        categoryOptions.find((c) => c.value === credential.category)?.label ||
        credential.category,
    },
    notes: credential.notes || "",
  });

  const [trustees, setTrustees] = useState([]);
  const [selectedTrustees, setSelectedTrustees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrustees = async () => {
      if (!ownerId) return;
      
      try {
        const res = await axios.get(`/api/trustees/${ownerId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const options = res.data.map((t) => ({
          value: t.trusteeId,
          label: t.trusteeName || t.trusteeEmail || "Unnamed",
        }));
        setTrustees(options);

        // Preselect already linked trustees
        if (credential.trusteeIds?.length > 0) {
          setSelectedTrustees(
            options.filter((opt) => credential.trusteeIds.includes(opt.value))
          );
        }
      } catch (err) {
        console.error("Failed to load trustees", err);
        setError("Failed to load trustees. Please try again.");
      }
    };

    fetchTrustees();
  }, [ownerId, credential.trusteeIds]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ownerId) return;
    
    setLoading(true);
    setError(null);

    try {
      let updatePayload = {
        title: formData.title,
        usernameOrCardNumber: formData.usernameOrCardNumber,
        category: formData.category.value,
        notes: formData.notes,
        trusteeIds: selectedTrustees.map((t) => t.value),
      };

      // Only update password if a new one was provided
      if (formData.passwordOrPin.trim()) {
        const key = await generateAESKey();
        const encryptedKey = await exportKeyAsBase64(key);
        const encryptedPassword = await encryptText(formData.passwordOrPin, key);

        const safeName = formData.title.replace(/\s+/g, "_").toLowerCase();
        const fileName = `${crypto.randomUUID()}_${safeName}.txt`;

        const { error: uploadError } = await supabase.storage
          .from("vault")
          .upload(fileName, encryptedPassword, {
            upsert: false,
            contentType: "text/plain",
            cacheControl: "3600",
          });

        if (uploadError) throw new Error(`Supabase upload failed: ${uploadError.message}`);

        const { data: urlData, error: urlError } = await supabase.storage
          .from("vault")
          .createSignedUrl(fileName, 7 * 24 * 60 * 60);

        if (urlError || !urlData?.signedUrl) {
          throw new Error("Failed to create signed URL");
        }

        updatePayload = {
          ...updatePayload,
          passwordOrPin: urlData.signedUrl,
          encryptedKey
        };
      }

      const response = await axios.put(
        `/api/credentials/${credential.id}`,
        updatePayload,
        {
          params: { ownerId },
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      onUpdate(response.data);
      onClose();
    } catch (err) {
      console.error("Update failed:", err);
      const errorMessage = err.response?.data?.message || 
                         err.response?.data?.error || 
                         err.message || 
                         "Failed to update credential. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 relative border border-lightGray">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-brandRose hover:text-brandRose-dark text-2xl font-bold"
          aria-label="Close"
          disabled={loading}
        >
          &times;
        </button>
        
        <h2 className="text-2xl font-bold text-brandRose-dark mb-6">
          Edit Credential
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-sm text-gray-700">
          <div>
            <label className="block font-medium mb-1">Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Username / Card Number</label>
            <input
              name="usernameOrCardNumber"
              value={formData.usernameOrCardNumber}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">New Password / PIN</label>
            <input
              type="password"
              name="passwordOrPin"
              value={formData.passwordOrPin}
              onChange={handleChange}
              placeholder="Leave empty to keep existing"
              className="w-full border border-gray-300 rounded px-3 py-2"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Category</label>
            <Select
              options={categoryOptions}
              value={formData.category}
              onChange={(option) =>
                setFormData((prev) => ({ ...prev, category: option }))
              }
              isSearchable
              isDisabled={loading}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Linked Trustees</label>
            <Select
              isMulti
              options={trustees}
              value={selectedTrustees}
              onChange={(selected) => setSelectedTrustees(selected || [])}
              placeholder="Select trustees..."
              isDisabled={loading}
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              icon={loading ? icons.spinner : icons.save}
              spin={loading}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CredentialEditModal;