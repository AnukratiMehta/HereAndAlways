import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../icons/icons";
import { supabase } from "../../utils/supabaseClient";
import axios from "axios";
import ConfirmDeleteModal from "../shared/ConfirmDeleteModal";
import { useAuth } from "../../contexts/AuthContext";

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
  const { token } = useAuth();
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
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(null);

const handleDownload = async () => {
  if (!downloadUrl) {
    setDownloadError("No download URL available");
    return;
  }

  setDownloading(true);
  setDownloadError(null);

  try {
    const filePath = downloadUrl.replace(/^\/?assets\//, "");
    
    try {
      const { data: { publicUrl } } = supabase.storage
        .from('assets')
        .getPublicUrl(filePath);
      
      window.open(publicUrl, '_blank');
      return;
    } catch (publicUrlError) {
      console.log("Public URL not available, trying authenticated methods");
    }

    try {
      const { data: { signedUrl }, error } = await supabase.storage
        .from('assets')
        .createSignedUrl(filePath, 3600); 
      
      if (!error && signedUrl) {
        window.open(signedUrl, '_blank');
        return;
      }
    } catch (signedUrlError) {
      console.log("Signed URL failed:", signedUrlError);
    }

    try {
      const { data, error } = await supabase.storage
        .from('assets')
        .download(filePath);
      
      if (!error && data) {
        const url = URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = name || `asset-${id.substring(0, 8)}`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 100);
        return;
      }
    } catch (downloadError) {
      console.log("Direct download failed:", downloadError);
    }

    setDownloadError("Could not access file. Please check permissions.");
    
  } catch (err) {
    console.error("Download error:", err);
    setDownloadError(err.message || "Download failed");
  } finally {
    setDownloading(false);
  }
};

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const filePath = downloadUrl?.replace(/^\/?assets\//, "");

      if (filePath) {
        const { error: storageError } = await supabase.storage
          .from("assets")
          .remove([filePath]);

        if (storageError) throw storageError;
      }

      await axios.delete(`/api/assets/${id}`);
      onDelete(id);
    } catch (err) {
      console.error("Deletion error:", err);
      setDownloadError("Failed to delete asset");
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="border border-lightGray rounded-xl p-4 shadow-sm bg-white flex flex-col gap-2 text-sm w-full max-w-md relative">
      <button
        onClick={() => onEdit(asset)}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
        title="Edit asset"
      >
        <FontAwesomeIcon icon={icons.pen} />
      </button>

      <div className="flex items-start gap-2 text-brandRose text-lg mb-1 break-words pr-6">
        <FontAwesomeIcon icon={icon} className="mt-1" />
        <span className="font-semibold break-words break-all whitespace-normal max-w-full">
          {name}
        </span>
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

      <div className="mt-auto pt-4 flex justify-end gap-4">
        <button
          onClick={handleDownload}
          disabled={downloading || !downloadUrl}
          title={downloadUrl ? "Download" : "No file available"}
          className={`${downloadUrl ? "text-brandRose hover:text-brandRose-dark cursor-pointer" : "text-gray-400 cursor-not-allowed"}`}
        >
          {downloading ? (
            <FontAwesomeIcon icon={icons.spinner} spin />
          ) : (
            <FontAwesomeIcon icon={icons.eye} />
          )}
        </button>
        <button
          onClick={() => setShowConfirm(true)}
          title="Delete"
          className="text-red-500 hover:text-red-700 cursor-pointer"
        >
          <FontAwesomeIcon icon={icons.trash} />
        </button>
      </div>

      {downloadError && (
        <div className="text-red-500 text-xs mt-2">
          {downloadError}
          {downloadUrl && (
            <>
              <br />
              <button
                className="text-blue-500 underline text-xs"
                onClick={() => window.open(downloadUrl, "_blank")}
              >
                Try direct download
              </button>
            </>
          )}
        </div>
      )}

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