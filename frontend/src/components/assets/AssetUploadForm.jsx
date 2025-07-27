import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../icons/icons";
import Button from "../shared/Button";
import axios from "axios";
import { supabase } from "../../utils/supabaseClient";
import { generateAESKey, exportKeyAsBase64 } from "../../utils/encryptionUtils";

// Utility to determine assetType from MIME type
const determineAssetType = (mimeType) => {
  if (!mimeType) return "DOCUMENT";

  if (mimeType.startsWith("image/")) return "IMAGE";
  if (mimeType.startsWith("video/")) return "VIDEO";
  if (mimeType.startsWith("audio/")) return "MUSIC";
  if (mimeType === "application/pdf" || mimeType.includes("document")) return "DOCUMENT";
  if (mimeType === "text/plain" || mimeType === "application/json") return "DOCUMENT";
  if (mimeType.includes("zip") || mimeType.includes("compressed")) return "DOCUMENT";
  if (mimeType.includes("msword") || mimeType.includes("wordprocessingml")) return "DOCUMENT";
  if (mimeType.includes("spreadsheetml") || mimeType.includes("excel")) return "DOCUMENT";

  return "DOCUMENT";
};

const AssetUploadForm = ({ onUploadComplete, onCancel }) => {
  const { user } = useAuth(); // Get authenticated user
  const [files, setFiles] = useState([]);
  const [trustees, setTrustees] = useState([]);
  const [messages, setMessages] = useState([]);
  const [linkAllEnabled, setLinkAllEnabled] = useState(false);
  const [selectedTrustees, setSelectedTrustees] = useState([]);
  const [selectedMessageIds, setSelectedMessageIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const ownerId = user?.id; // Use dynamic ownerId

  useEffect(() => {
    const fetchData = async () => {
      if (!ownerId) return;
      
      setIsLoading(true);
      setError(null);
      try {
        const [trusteeRes, messageRes] = await Promise.all([
          axios.get(`/api/trustees/${ownerId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }),
          axios.get(`/api/messages/${ownerId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }),
        ]);
        setTrustees(trusteeRes.data);
        setMessages(messageRes.data);
      } catch (err) {
        console.error("Failed to fetch trustees or messages:", err);
        setError("Failed to load trustees/messages. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [ownerId]);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleUpload = async () => {
    if (!ownerId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const uploadedAssets = [];

      for (const file of files) {
        try {
          const key = await generateAESKey();
          const encryptedKey = await exportKeyAsBase64(key);

          const sanitizedFileName = file.name
            .replace(/\s+/g, "_")
            .replace(/[^\w.\-()]/g, "");

          const filePath = `${crypto.randomUUID()}_${sanitizedFileName}`;
          const assetType = determineAssetType(file.type);

          const { error: uploadError } = await supabase.storage
            .from("assets")
            .upload(filePath, file, {
              upsert: false,
              contentType: file.type,
              cacheControl: "3600",
              metadata: {
                owner_id: ownerId,
              },
            });

          if (uploadError) {
            console.error("Supabase upload error:", uploadError.message);
            continue;
          }

          const metadata = {
            name: file.name,
            assetType,
            fileSize: file.size,
            mimeType: file.type,
            description: "",
            downloadUrl: `/assets/${filePath}`,
            encryptedKey,
            trusteeIds: linkAllEnabled ? selectedTrustees.map(t => t.value) : [],
            messageIds: linkAllEnabled ? selectedMessageIds.map((m) => m.value) : [],
          };

          const backendResponse = await axios.post(
            `/api/assets`,
            metadata,
            {
              params: { ownerId },
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            }
          );

          uploadedAssets.push(backendResponse.data);
        } catch (fileError) {
          console.error(`Error processing file ${file.name}:`, fileError);
          continue;
        }
      }

      if (uploadedAssets.length === 0) {
        setError("No assets were uploaded. Please check file types and try again.");
        return;
      }

      setFiles([]);
      setSelectedTrustees([]);
      setSelectedMessageIds([]);
      setLinkAllEnabled(false);

      onUploadComplete(uploadedAssets);
    } catch (err) {
      console.error("Upload failed:", err);
      setError(err.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-xl p-6 mb-6 border border-lightGray">
      <h2 className="text-xl font-semibold mb-4">Upload Assets</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label
          htmlFor="file-upload"
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-gray-700 bg-white rounded-md shadow-sm text-sm font-medium cursor-pointer hover:bg-gray-100 transition"
        >
          Choose Files
        </label>

        <input
          id="file-upload"
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />

        {files.length > 0 && (
          <ul className="mt-2 text-sm text-gray-600">
            {files.map((file, idx) => (
              <li key={idx}>
                {file.name} <span className="text-xs text-gray-400">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {isLoading && (
        <div className="mb-4 text-center py-2">
          <FontAwesomeIcon icon={icons.spinner} spin className="mr-2" />
          Processing files...
        </div>
      )}

      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          id="linkAll"
          checked={linkAllEnabled}
          onChange={(e) => setLinkAllEnabled(e.target.checked)}
          className="mr-2"
          disabled={isLoading}
        />
        <label htmlFor="linkAll" className="text-sm">
          Link all files to the same trustees and/or message
        </label>
      </div>

      {linkAllEnabled && (
        <>
          <div className="mb-4">
            <label className="block font-medium text-sm mb-1">Select Trustees:</label>
            <Select
              isMulti
              options={trustees.map((t) => ({
                value: t.trusteeId,
                label: t.trusteeName || t.trusteeEmail || "Unnamed",
              }))}
              value={selectedTrustees}
              onChange={(selected) => setSelectedTrustees(selected || [])}
              placeholder="Choose trustees..."
              isDisabled={isLoading}
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium text-sm mb-1">Select Message:</label>
            <Select
              isMulti
              options={messages.map((m) => ({
                value: m.id,
                label: m.subject,
              }))}
              value={selectedMessageIds}
              onChange={(selected) => setSelectedMessageIds(selected || [])}
              placeholder="Choose message..."
              isDisabled={isLoading}
            />
            {selectedMessageIds.length > 1 && (
              <p className="text-xs text-gray-500 mt-1">
                Only the first selected message will be used for linking.
              </p>
            )}
          </div>
        </>
      )}

      <div className="flex gap-4">
        <Button 
          color="primary" 
          onClick={handleUpload}
          disabled={files.length === 0 || isLoading}
        >
          {isLoading ? (
            <>
              <FontAwesomeIcon icon={icons.spinner} spin className="mr-2" />
              Uploading...
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={icons.upload} className="mr-2" />
              Upload
            </>
          )}
        </Button>
        <Button 
          color="secondary" 
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default AssetUploadForm;