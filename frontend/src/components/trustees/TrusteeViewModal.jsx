import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../icons/icons";
import Button from "../shared/Button";

const TrusteeViewModal = ({ trustee, onClose }) => {
  if (!trustee) return null;

  return (
<div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">      
  <div className="relative w-full max-w-2xl mx-4 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-brandRose-light border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              <FontAwesomeIcon icon={icons.userShield} className="mr-2 text-brandRose" />
              {trustee.trusteeName || "Unnamed Trustee"}
            </h2>
            
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Trustee Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-start">
                <FontAwesomeIcon icon={icons.envelope} className="mt-1 mr-2 text-gray-500 w-4" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-gray-900">
                    {trustee.trusteeEmail || <span className="text-gray-400">Not provided</span>}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <FontAwesomeIcon icon={icons.calendar} className="mt-1 mr-2 text-gray-500 w-4" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Invited On</p>
                  <p className="text-gray-900">
                    {trustee.invitedAt ? new Date(trustee.invitedAt).toLocaleDateString() : <span className="text-gray-400">Unknown</span>}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-start">
                <FontAwesomeIcon icon={icons.status} className="mt-1 mr-2 text-gray-500 w-4" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    trustee.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                    trustee.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {trustee.status || "Unknown"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Linked Messages Section */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="flex items-center text-sm font-medium text-gray-900 mb-3">
              <FontAwesomeIcon icon={icons.message} className="mr-2 text-brandRose" />
              Linked Messages
            </h3>
            {trustee.messages && trustee.messages.length > 0 ? (
              <ul className="space-y-2">
                {trustee.messages.map((msg, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="flex items-center justify-center h-5 w-5 bg-gray-100 rounded-full mr-2 mt-0.5">
                      <span className="text-xs text-gray-500">{idx + 1}</span>
                    </span>
                    <span className="text-gray-700">{msg.subject}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-gray-500 italic">No messages linked to this trustee</div>
            )}
          </div>

          {/* Linked Assets Section */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="flex items-center text-sm font-medium text-gray-900 mb-3">
              <FontAwesomeIcon icon={icons.box} className="mr-2 text-brandRose" />
              Linked Assets
            </h3>
            {trustee.assets && trustee.assets.length > 0 ? (
              <ul className="space-y-2">
                {trustee.assets.map((asset, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="flex items-center justify-center h-5 w-5 bg-gray-100 rounded-full mr-2 mt-0.5">
                      <span className="text-xs text-gray-500">{idx + 1}</span>
                    </span>
                    <span className="text-gray-700">{asset.name}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-gray-500 italic">No assets linked to this trustee</div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
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

export default TrusteeViewModal;