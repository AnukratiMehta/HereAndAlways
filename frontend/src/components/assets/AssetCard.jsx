import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../icons/icons";
import { supabase } from "../../utils/supabaseClient";
import axios from "axios";
import ConfirmDeleteModal from "../shared/ConfirmDeleteModal";

const assetTypeIcons = {
  PASSWORD: icons.key,
  DOCUMENT: icons.fileAlt,
  LINK: icons.link,
  IMAGE: icons.image,
  VIDEO: icons.video,
  MUSIC: icons.music,
  DEFAULT: icons.file,
};

const AssetCard = ({ asset, onDelete, onEdit }) => {
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
      const { error: storageError } = await supabase.storage
        .from("assets")
        .remove([filePath]);

      if (storageError) throw new Error(`Storage delete failed: ${storageError.message}`);

      await axios.delete(`/api/assets/${id}`);
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
    <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow transition-shadow duration-150 flex flex-col h-full">
      {/* Edit Button */}
      <button
        onClick={() => onEdit(asset)}
        className="absolute top-3 right-3 text-gray-500 hover:text-brandRose cursor-pointer p-1"
        title="Edit asset"
      >
        <FontAwesomeIcon icon={icons.pen} size="sm" />
      </button>

      {/* Asset Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="text-brandRose">
          <FontAwesomeIcon icon={icon} size="lg" />
        </div>
        <h3 className="text-base font-semibold text-gray-900 line-clamp-2">
          {name}
        </h3>
      </div>

      {/* Metadata */}
      <div className="space-y-2 text-sm text-gray-700 mb-4">
        <div>
          <span className="text-gray-500">Uploaded: </span>
          {createdAt ? new Date(createdAt).toLocaleDateString() : "Unknown"}
        </div>

        <div>
          <span className="text-gray-500">Trustee: </span>
          {linkedTrustees.length > 0 ? (
            <span className="text-gray-800">
              {linkedTrustees.map((t) => t.name).join(", ")}
            </span>
          ) : (
            <span className="text-gray-400">—</span>
          )}
        </div>

        <div>
          <span className="text-gray-500">Messages: </span>
          {linkedMessages.length > 0 ? (
            <span className="text-gray-800">
              {linkedMessages.map((m) => m.title).join(", ")}
            </span>
          ) : (
            <span className="text-gray-400">—</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-auto pt-3 flex justify-end gap-3">
        <button
          onClick={() => window.open(downloadUrl, "_blank")}
          className="text-blue-600 hover:text-blue-800 cursor-pointer"
          title="Download"
        >
          <FontAwesomeIcon icon={icons.download} />
        </button>
        <button
          onClick={() => setShowConfirm(true)}
          className="text-red-500 hover:text-red-700 cursor-pointer"
          title="Delete"
        >
          <FontAwesomeIcon icon={icons.trash} />
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <ConfirmDeleteModal
          title="Delete Asset"
          itemName={name}
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
          loading={deleting}
        />
      )}
    </div>
  );
};

export default AssetCard;