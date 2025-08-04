import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../icons/icons";
import Button from "../shared/Button";

const MessageViewModal = ({ message, onClose, onDelete }) => {
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

  if (!message) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xl p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <FontAwesomeIcon 
            icon={icons.messages} 
            className="text-brandRose text-xl"
          />
          <h2 className="text-2xl font-bold text-gray-900">
            {message.subject || "Untitled Message"}
          </h2>
        </div>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg whitespace-pre-wrap text-gray-700 border border-gray-200">
          {message.body || <span className="text-gray-400">(No content)</span>}
        </div>

        <div className="space-y-3 text-sm mb-6">
          <div className="flex items-start">
            <span className="w-32 font-medium text-gray-500 flex items-center gap-2">
              <FontAwesomeIcon icon={icons.circleInfo} className="w-4" />
              Status:
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              message.deliveryStatus === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
              message.deliveryStatus === 'QUEUED' ? 'bg-green-100 text-green-800' :
              message.deliveryStatus === 'SENT' ? 'bg-blue-100 text-blue-800' :
              message.deliveryStatus === 'FAILED' ? 'bg-red-100 text-red-800' :
              'bg-purple-100 text-purple-800'
            }`}>
              {message.deliveryStatus}
            </span>
          </div>

          <div className="flex items-start">
            <span className="w-32 font-medium text-gray-500 flex items-center gap-2">
              <FontAwesomeIcon icon={icons.calendar} className="w-4" />
              Created:
            </span>
            <span className="text-gray-700">
              {new Date(message.createdAt).toLocaleString()}
            </span>
          </div>

          {message.scheduledDelivery && (
            <div className="flex items-start">
              <span className="w-32 font-medium text-gray-500 flex items-center gap-2">
                <FontAwesomeIcon icon={icons.clock} className="w-4" />
                Scheduled:
              </span>
              <span className="text-gray-700">
                {new Date(message.scheduledDelivery).toLocaleString()}
              </span>
            </div>
          )}

          <div className="flex items-start">
            <span className="w-32 font-medium text-gray-500 flex items-center gap-2">
              <FontAwesomeIcon icon={icons.userShield} className="w-4" />
              Trustees:
            </span>
            <span className="text-gray-700">
              {message.trusteeNames?.length > 0
                ? message.trusteeNames.join(", ")
                : <span className="text-gray-400">Unassigned</span>}
            </span>
          </div>

          <div className="flex items-start">
            <span className="w-32 font-medium text-gray-500 flex items-center gap-2">
              <FontAwesomeIcon icon={icons.link} className="w-4" />
              Linked Assets:
            </span>
            <div className="flex-1">
              {loadingAssets ? (
                <span className="text-gray-500">Loading...</span>
              ) : linkedAssets.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {linkedAssets.map(asset => (
                    <span 
                      key={asset.id} 
                      className="bg-gray-100 px-2 py-1 rounded text-xs flex items-center gap-1"
                      title={asset.name}
                    >
                      <FontAwesomeIcon 
                        icon={
                          asset.assetType === 'IMAGE' ? icons.image :
                          asset.assetType === 'VIDEO' ? icons.video :
                          asset.assetType === 'DOCUMENT' ? icons.fileAlt :
                          icons.file
                        } 
                        className="text-gray-500"
                      />
                      {asset.name}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-gray-400">None</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-between border-t border-gray-200 pt-4">
          <Button 
            onClick={() => onDelete(message)} 
            color="danger"
            className="px-4 py-2"
            icon={icons.trash}
          >
            Delete
          </Button>
          <Button 
            onClick={onClose} 
            color="primary"
            className="px-4 py-2"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessageViewModal;