import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../icons/icons";
import { supabase } from "../../utils/supabaseClient";
import axios from "axios";

const assetTypeIcons = {
  PASSWORD: icons.key,
  DOCUMENT: icons.fileAlt,
  LINK: icons.link,
  IMAGE: icons.image,
  VIDEO: icons.video,
  MUSIC: icons.music,
  DEFAULT: icons.file,
};

const AssetCard = ({ asset, onDelete }) => {
  const {
    id,
    name,
    assetType,
    createdAt,
    linkedTrustees = [],
    linkedMessages = [],
    downloadUrl,
  } = asset;

  const icon = assetTypeIcons[assetType] || assetTypeIcons.DEFAULT;
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const filePath = downloadUrl?.replace(/^\/?assets\//, "");

  const handleDelete = async () => {
    setDeleting(true);
    try {
      // Step 1: Delete from Supabase storage
      const { error: storageError } = await supabase.storage
        .from("assets")
        .remove([filePath]);

      if (storageError) throw new Error(`Storage delete failed: ${storageError.message}`);

      // Step 2: Delete from backend DB
      await axios.delete(`/api/assets/${id}`);
      
      // Notify parent
      onDelete(id);
    } catch (err) {
      console.error("Deletion error:", err);
      alert("Failed to delete asset. Check console for details.");
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="border border-lightGray rounded-xl p-4 shadow-sm bg-white flex flex-col gap-2 text-sm w-full max-w-sm">
      <div className="flex items-center gap-2 text-brandRose text-lg mb-1">
        <FontAwesomeIcon icon={icon} />
        <span className="font-semibold">{name}</span>
      </div>

      <div className="text-gray-500">
        Uploaded: {createdAt ? new Date(createdAt).toLocaleDateString() : "Unknown"}
      </div>

      <div>
        <span className="font-medium text-charcoal">Trustee: </span>
        {linkedTrustees.length > 0
          ? linkedTrustees.map((t) => t.name).join(", ")
          : <span className="text-gray-400">—</span>}
      </div>

      <div>
        <span className="font-medium text-charcoal">Messages: </span>
        {linkedMessages.length > 0
          ? linkedMessages.map((m) => m.title).join(", ")
          : <span className="text-gray-400">—</span>}
      </div>

      <div className="flex gap-4 mt-2">
        <button onClick={() => window.open(downloadUrl, "_blank")} className="text-blue-600 hover:underline">
          Download
        </button>
        <button onClick={() => setShowConfirm(true)} className="text-red-500 hover:underline">
          Delete
        </button>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h2 className="text-lg font-semibold mb-4 text-red-600">Delete Asset</h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to permanently delete <strong>{name}</strong>?
            </p>
            <div className="flex justify-between gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-1 border border-gray-300 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                {deleting ? "Deleting..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetCard;
