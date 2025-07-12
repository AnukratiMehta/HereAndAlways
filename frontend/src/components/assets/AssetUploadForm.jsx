import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../icons/icons";
import Button from "../shared/Button";
import axios from "axios";
import { supabase } from "../../utils/supabaseClient";
import { generateAESKey, exportKeyAsBase64 } from "../../utils/encryptionUtils";


const AssetUploadForm = ({ onUploadComplete, onCancel }) => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };


const handleUpload = async () => {
  try {
    const uploadedAssets = [];

    for (const file of files) {
      // 1. Generate AES key and export to base64
      const key = await generateAESKey();
      const encryptedKey = await exportKeyAsBase64(key);

      // 2. Upload file first
      const filePath = `${crypto.randomUUID()}_${file.name}`; // avoid clashes

      const { error } = await supabase.storage
        .from("assets")
        .upload(filePath, file, {
          upsert: false,
          contentType: file.type,
          cacheControl: "3600",
          metadata: {
            owner_id: "1d28bf25-fce1-4e4f-9309-b3471db1d88b",
          },
        });

      if (error) {
        console.error("Supabase upload error:", error.message);
        continue;
      }

      // 3. Now POST to backend with the actual downloadUrl
      const metadata = {
        name: file.name,
        assetType: "DOCUMENT",
        fileSize: file.size,
        mimeType: file.type,
        description: "",
        downloadUrl: `/assets/${filePath}`,
        encryptedKey,
      };

      const backendResponse = await axios.post(
        `/api/assets?ownerId=1d28bf25-fce1-4e4f-9309-b3471db1d88b`,
        metadata
      );

      uploadedAssets.push(backendResponse.data);
    }

    if (uploadedAssets.length === 0) {
      alert("No assets were uploaded. Check console for details.");
      return;
    }

    onUploadComplete(uploadedAssets);
  } catch (err) {
    console.error("Upload failed:", err);
    alert("Upload failed. Check console for details.");
  }
};






  return (
    <div className="bg-white shadow rounded-xl p-6 mb-6 border border-lightGray">
      <h2 className="text-xl font-semibold mb-4">Upload Assets</h2>

      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="mb-4"
      />

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
