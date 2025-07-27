import { useState, useEffect } from "react";
import Select from "react-select";
import Button from "../shared/Button";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../icons/icons";
import { supabase } from "../../utils/supabaseClient";
import {
  generateAESKey,
  exportKeyAsBase64,
  encryptText,
} from "../../utils/encryptionUtils";

const CredentialUploadForm = ({ ownerId, onUploadComplete, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    usernameOrCardNumber: "",
    passwordOrPin: "",
    category: { value: "SOCIAL", label: "Social Media" },
    notes: "",
  });

  const [trustees, setTrustees] = useState([]);
  const [linkAllEnabled, setLinkAllEnabled] = useState(false);
  const [selectedTrustees, setSelectedTrustees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const categoryOptions = [
    { value: "SOCIAL", label: "Social Media" },
    { value: "BANK", label: "Bank Account" },
    { value: "EMAIL", label: "Email" },
    { value: "OTHER", label: "Other" },
  ];

  useEffect(() => {
    const fetchTrustees = async () => {
      if (!ownerId) return;
      
      try {
        const response = await axios.get(`/api/trustees/${ownerId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const formatted = response.data.map((t) => ({
          value: t.trusteeId,
          label: t.trusteeName || t.trusteeEmail || "Unnamed",
        }));
        setTrustees(formatted);
      } catch (err) {
        console.error("Failed to fetch trustees:", err);
        setError("Failed to load trustees. Please try again.");
      }
    };

    fetchTrustees();
  }, [ownerId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ownerId) return;
    
    setLoading(true);
    setError(null);

    try {
      // 1. Encrypt the password/PIN
      const key = await generateAESKey();
      const encryptedKey = await exportKeyAsBase64(key);
      const encryptedPassword = await encryptText(formData.passwordOrPin, key);

      // 2. Create filename and upload to Supabase
      const safeName = formData.title
        .replace(/\s+/g, "_")
        .replace(/[^\w.-]/g, "")
        .toLowerCase();
      const fileName = `${crypto.randomUUID()}_${safeName}.txt`;

      const { error: uploadError } = await supabase.storage
        .from("vault")
        .upload(fileName, encryptedPassword, {
          upsert: false,
          contentType: "text/plain",
          cacheControl: "3600",
        });

      if (uploadError) throw new Error(`Supabase upload failed: ${uploadError.message}`);

      // 3. Get signed URL
      const { data: urlData, error: urlError } = await supabase.storage
        .from("vault")
        .createSignedUrl(fileName, 7 * 24 * 60 * 60); // 7 days

      if (urlError || !urlData?.signedUrl) {
        throw new Error("Failed to generate download URL");
      }

      // 4. Prepare payload
      const payload = {
        ...formData,
        category: formData.category.value,
        passwordOrPin: urlData.signedUrl,
        encryptedKey,
        trusteeIds: linkAllEnabled ? selectedTrustees.map((t) => t.value) : [],
      };

      const response = await axios.post(`/api/credentials`, payload, {
        params: { ownerId },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      onUploadComplete(response.data);
    } catch (error) {
      console.error("Upload failed:", error);
      setError(error.message || "Failed to save credential. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white shadow-xl rounded-2xl p-6 max-w-lg w-full relative border border-lightGray">
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 text-brandRose hover:text-brandRose-dark text-2xl font-bold"
          aria-label="Close"
          disabled={loading}
        >
          &times;
        </button>

        <h2 className="text-xl font-semibold mb-4">New Credential</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="e.g. Instagram"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Username / Card Number</label>
            <input
              name="usernameOrCardNumber"
              value={formData.usernameOrCardNumber}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password / PIN</label>
            <input
              type="password"
              name="passwordOrPin"
              value={formData.passwordOrPin}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <Select
              value={formData.category}
              onChange={(option) =>
                setFormData((prev) => ({ ...prev, category: option }))
              }
              options={categoryOptions}
              isSearchable
              isDisabled={loading}
            />
          </div>

          <div className="flex items-center mb-2 mt-2">
            <input
              type="checkbox"
              id="linkTrustees"
              checked={linkAllEnabled}
              onChange={(e) => setLinkAllEnabled(e.target.checked)}
              className="mr-2"
              disabled={loading}
            />
            <label htmlFor="linkTrustees" className="text-sm">
              Link to trustees
            </label>
          </div>

          {linkAllEnabled && (
            <div>
              <label className="block font-medium text-sm mb-1">Select Trustees:</label>
              <Select
                isMulti
                options={trustees}
                value={selectedTrustees}
                onChange={(selected) => setSelectedTrustees(selected || [])}
                placeholder="Choose trustees..."
                isDisabled={loading}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Notes (optional)</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows="3"
              className="w-full border border-gray-300 rounded px-3 py-2"
              disabled={loading}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button 
              type="button" 
              onClick={onCancel} 
              color="secondary"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              color="primary" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={icons.spinner} spin className="mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={icons.save} className="mr-2" />
                  Save
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CredentialUploadForm;