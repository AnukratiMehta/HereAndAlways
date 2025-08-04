import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../icons/icons";
import Button from "../shared/Button";

const assetTypeIcons = {
  IMAGE: icons.image,
  VIDEO: icons.video,
  DOCUMENT: icons.fileAlt,
  MUSIC: icons.music,
  DEFAULT: icons.file,
};

const MessageCard = ({ message, onEdit, onDelete }) => {
  const [linkedAssets, setLinkedAssets] = useState([]);
  const [loadingAssets, setLoadingAssets] = useState(false);

  useEffect(() => {
    if (message?.id) {
      setLoadingAssets(true);
      axios.get(`/api/assets?messageId=${message.id}`)
        .then(res => setLinkedAssets(res.data))
        .catch(console.error)
        .finally(() => setLoadingAssets(false));
    }
  }, [message?.id]);

  const getStatusBadge = (status) => {
    const base = "px-2 py-0.5 rounded-full text-xs font-semibold inline-block";
    switch (status) {
      case "DRAFT":
        return `${base} bg-yellow-200 text-yellow-800`;
      case "QUEUED":
        return `${base} bg-green-200 text-green-900`;
      case "SENT":
        return `${base} bg-blue-200 text-blue-900`;
      case "FAILED":
        return `${base} bg-red-200 text-red-800`;
      default:
        return `${base} bg-gray-200 text-gray-700`;
    }
  };

  return (
    <div className="w-full bg-brandRose-soft rounded-2xl border border-brandRose shadow-md hover:shadow-lg transition-all p-5 space-y-3">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-brandRose-dark leading-snug">
          {message.subject || "Untitled"}
        </h3>
        <span className={getStatusBadge(message.deliveryStatus)}>
          {message.deliveryStatus}
        </span>
      </div>

      <p className="text-sm text-charcoal leading-snug whitespace-pre-wrap line-clamp-3">
        {message.body || "(No content)"}
      </p>

      <div className="text-xs text-gray-700 space-y-1">
        <p>
          <FontAwesomeIcon icon={icons.calendar} className="mr-1 text-xs" />
          <strong>Created:</strong>{" "}
          {new Date(message.createdAt).toLocaleDateString()}
        </p>
        <p>
          <FontAwesomeIcon icon={icons.userShield} className="mr-1 text-xs" />
          <strong>Trustees:</strong> {message.trusteeNames?.join(", ") || "None"}
        </p>
        
        <div className="flex items-start">
          <span className="flex items-center mr-1">
            <FontAwesomeIcon icon={icons.link} className="mr-1 text-xs" />
            <strong>Assets:</strong>
          </span>
          <div className="flex flex-wrap gap-1">
            {loadingAssets ? (
              <span className="text-gray-400 text-xs">Loading assets...</span>
            ) : linkedAssets.length > 0 ? (
              linkedAssets.map(asset => (
                <span 
                  key={asset.id} 
                  className="flex items-center bg-gray-100 px-2 py-0.5 rounded text-xs"
                  title={asset.name}
                >
                  <FontAwesomeIcon 
                    icon={assetTypeIcons[asset.assetType] || assetTypeIcons.DEFAULT} 
                    className="mr-1 text-gray-500 text-xs" 
                  />
                  {asset.name}
                </span>
              ))
            ) : (
              <span className="text-gray-400 text-xs">None</span>
            )}
          </div>
        </div>
      </div>

      <div className="pt-2 flex justify-between">
        <Button 
          color="danger" 
          size="sm" 
          onClick={() => onDelete(message)}
          icon={icons.trash}
        >
          Delete
        </Button>
        <Button 
          color="secondary" 
          size="sm" 
          onClick={() => onEdit(message)}
          icon={icons.pen}
        >
          Edit
        </Button>
      </div>
    </div>
  );
};

export default MessageCard;