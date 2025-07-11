import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../icons/icons";
import Button from "../shared/Button";

const AssetUploadForm = ({ onUploadComplete, onCancel }) => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleUpload = () => {

    const uploadedAssets = files.map((file) => ({
      fileName: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
      linkedTrustee: null,
      linkedMessage: null
    }));
    onUploadComplete(uploadedAssets);
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
              <FontAwesomeIcon icon={icons.file} />
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
