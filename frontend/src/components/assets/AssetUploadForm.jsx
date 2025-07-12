import { useState, useEffect } from "react";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../icons/icons";
import Button from "../shared/Button";
import axios from "axios";
import { supabase } from "../../utils/supabaseClient";
import { generateAESKey, exportKeyAsBase64 } from "../../utils/encryptionUtils";

const ownerId = "1d28bf25-fce1-4e4f-9309-b3471db1d88b";

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
  const [files, setFiles] = useState([]);
  const [trustees, setTrustees] = useState([]);
  const [messages, setMessages] = useState([]);
  const [linkAllEnabled, setLinkAllEnabled] = useState(false);
  const [selectedTrustees, setSelectedTrustees] = useState([]);
  const [selectedMessageIds, setSelectedMessageIds] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trusteeRes, messageRes] = await Promise.all([
          axios.get(`/api/trustees/${ownerId}`),
          axios.get(`/api/messages/${ownerId}`),
        ]);
        setTrustees(trusteeRes.data);
        setMessages(messageRes.data);
      } catch (err) {
        console.error("Failed to fetch trustees or messages:", err);
      }
    };

    fetchData();
  }, []);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleUpload = async () => {
    try {
      const uploadedAssets = [];

      for (const file of files) {
  const key = await generateAESKey();
  const encryptedKey = await exportKeyAsBase64(key);

  const sanitizedFileName = file.name
    .replace(/\s+/g, "_")
    .replace(/[^\w.\-()]/g, "");

  const filePath = `${crypto.randomUUID()}_${sanitizedFileName}`;
  const assetType = determineAssetType(file.type);

  const { error } = await supabase.storage
    .from("assets")
    .upload(filePath, file, {
      upsert: false,
      contentType: file.type,
      cacheControl: "3600",
      metadata: {
        owner_id: ownerId,
      },
    });

        if (error) {
          console.error("Supabase upload error:", error.message);
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
          `/api/assets?ownerId=${ownerId}`,
          metadata
        );

        uploadedAssets.push(backendResponse.data);
      }

      if (uploadedAssets.length === 0) {
        alert("No assets were uploaded. Check console for details.");
        return;
      }

      setFiles([]);
      setSelectedTrustees([]);
      setSelectedMessageIds([]);
      setLinkAllEnabled(false);

      onUploadComplete(uploadedAssets);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed. Check console for details.");
    }
  };

  return (
    <div className="bg-white shadow rounded-xl p-6 mb-6 border border-lightGray">
      <h2 className="text-xl font-semibold mb-4">Upload Assets</h2>

      <input type="file" multiple onChange={handleFileChange} className="mb-4" />

      {files.length > 0 && (
        <ul className="mb-4 text-sm text-gray-600">
          {files.map((file, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <FontAwesomeIcon icon={icons.save} />
              {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          id="linkAll"
          checked={linkAllEnabled}
          onChange={(e) => setLinkAllEnabled(e.target.checked)}
          className="mr-2"
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
        <Button color="primary" onClick={handleUpload}>
          <FontAwesomeIcon icon={icons.upload} className="mr-2" />
          Upload
        </Button>
        <Button color="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default AssetUploadForm;
