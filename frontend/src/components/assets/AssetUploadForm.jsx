import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../icons/icons";
import Button from "../shared/Button";
import axios from "axios";
import { supabase } from "../../utils/supabaseClient";
import { v4 as uuidv4 } from "uuid";

const AssetUploadForm = ({ onUploadComplete, onCancel }) => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

const handleUpload = async () => {
  if (files.length === 0) {
    alert("Please select at least one file to upload.");
    return;
  }

  try {
    const uploadedAssets = [];

    for (const file of files) {
      console.log("Uploading file:", file.name);

      const filePath = `${uuidv4()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("assets")
        .upload(filePath, file);

      if (uploadError) {
        console.error("Supabase upload error:", uploadError.message);
        continue;
      }

      const { data: urlData, error: urlError } = supabase.storage
        .from("assets")
        .getPublicUrl(filePath);

      if (urlError) {
        console.error("URL fetch error:", urlError.message);
        continue;
      }

      const metadata = {
        name: file.name,
        assetType: "DOCUMENT",
        downloadUrl: urlData.publicUrl,
        encryptedKey: "placeholder-key",
        fileSize: file.size,
        mimeType: file.type,
        description: "",
      };

      const response = await axios.post(
        `/api/assets?ownerId=1d28bf25-fce1-4e4f-9309-b3471db1d88b`,
        metadata
      );

      console.log("Backend response:", response.data);
      uploadedAssets.push(response.data);
    }

    if (uploadedAssets.length > 0) {
      onUploadComplete(uploadedAssets);
    } else {
      alert("No assets were uploaded. Check console for errors.");
    }
  } catch (err) {
    console.error("Upload failed:", err);
    alert("Upload failed. See console for details.");
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
