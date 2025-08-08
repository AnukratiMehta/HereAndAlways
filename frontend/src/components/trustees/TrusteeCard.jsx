import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../icons/icons";
import { useState } from "react";
import TrusteeViewModal from "./TrusteeViewModal";
import TrusteeEditModal from "./TrusteeEditModal";
import { formatDistanceToNow } from "date-fns";

const TrusteeCard = ({ trustee, onUpdate, onRemove }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const statusConfig = {
    PENDING: { color: "bg-yellow-100 text-yellow-800", icon: icons.clock },
    APPROVED: { color: "bg-green-100 text-green-800", icon: icons.checkCircle },
    REVOKED: { color: "bg-red-100 text-red-800", icon: icons.timesCircle },
    DEFAULT: { color: "bg-gray-100 text-gray-800", icon: icons.user }
  };

  const { color: statusColor, icon: statusIcon } = statusConfig[trustee.status] || statusConfig.DEFAULT;

  return (
    <div 
      className="h-full bg-white rounded-lg border border-lightGray shadow-sm hover:shadow-md transition-all overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative p-4 border-b border-lightGray">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-brandRose-light text-brandRose-dark flex items-center justify-center font-bold flex-shrink-0">
            {trustee.trusteeName?.[0]?.toUpperCase() || "T"}
          </div>
          
          <div className="min-w-0 flex-1">
            <h3 className="text-md font-semibold text-charcoal truncate">
              {trustee.trusteeName || "Unnamed Trustee"}
            </h3>
            <p className="text-xs text-gray-500 truncate">
              {trustee.trusteeEmail || "No email provided"}
            </p>
          </div>
        </div>
        
        <div className={`absolute top-3 right-3 px-2 py-1 text-xs rounded-full flex items-center ${statusColor}`}>
          <FontAwesomeIcon icon={statusIcon} className="mr-1 text-xs" />
          {trustee.status || "UNKNOWN"}
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-2 text-sm">
          <div className="flex items-center text-gray-600">
            <FontAwesomeIcon icon={icons.calendar} className="mr-2 text-gray-400 w-4" />
            <span>Invited {trustee.invitedAt ? formatDistanceToNow(new Date(trustee.invitedAt)) + " ago" : "Unknown date"}</span>
          </div>
          
          <div className="flex space-x-4 pt-1">
            <div className="flex items-center text-gray-600">
              <FontAwesomeIcon icon={icons.messages} className="mr-2 text-gray-400 w-4" />
              <span>{trustee.messages?.length || 0}</span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <FontAwesomeIcon icon={icons.assets} className="mr-2 text-gray-400 w-4" />
              <span>{trustee.assets?.length || 0}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pb-3 border-t border-lightGray bg-gray-50">
        <div className={`text-center py-1 ${isHovered ? 'hidden' : 'block'}`}>
          <span className="text-xs text-gray-400">Hover for actions</span>
        </div>

        <div className={`flex justify-end space-x-2 ${isHovered ? 'block' : 'hidden'}`}>
          <button 
            onClick={() => setShowViewModal(true)}
            className="p-1.5 text-brandRose hover:text-white hover:bg-brandRose rounded-md transition-colors"
            title="View Details"
          >
            <FontAwesomeIcon icon={icons.eye} className="w-4 h-4" />
          </button>
          
          <button 
            onClick={() => setShowEditModal(true)}
            className="p-1.5 text-brandRose hover:text-white hover:bg-brandRose rounded-md transition-colors"
            title="Edit Trustee"
          >
            <FontAwesomeIcon icon={icons.pen} className="w-4 h-4" />
          </button>
          
          <button 
            onClick={() => onRemove(trustee)}
            className="p-1.5 text-red-500 hover:text-white hover:bg-red-500 rounded-md transition-colors"
            title="Remove Trustee"
          >
            <FontAwesomeIcon icon={icons.trash} className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showViewModal && (
        <TrusteeViewModal 
          trustee={trustee} 
          onClose={() => setShowViewModal(false)} 
        />
      )}

      {showEditModal && (
        <TrusteeEditModal
          trustee={trustee}
          onClose={() => setShowEditModal(false)}
          onTrusteeUpdated={(updatedTrustee) => {
            onUpdate(updatedTrustee);
            setShowEditModal(false);
          }}
        />
      )}
    </div>
  );
};

export default TrusteeCard;