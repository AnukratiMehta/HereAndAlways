import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../icons/icons";
import Button from "../shared/Button";

const MessageViewModal = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded shadow-lg w-full max-w-xl p-6 relative border border-lightGray">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">{message.subject || "Untitled"}</h2>
        <div className="mb-4 text-gray-700 whitespace-pre-wrap">
          {message.body || "(No content)"}
        </div>
        <div className="text-sm text-gray-500 space-y-1">
          <p>
            <strong>Status:</strong> {message.deliveryStatus}
          </p>
          <p>
            <strong>Created On:</strong>{" "}
            {new Date(message.createdAt).toLocaleString()}
          </p>
          {message.scheduledDelivery && (
            <p>
              <strong>Scheduled For:</strong>{" "}
              {new Date(message.scheduledDelivery).toLocaleString()}
            </p>
          )}
          <p>
            <strong>Trustees:</strong>{" "}
            {message.trusteeNames && message.trusteeNames.length > 0
              ? message.trusteeNames.join(", ")
              : "Unassigned"}
          </p>
        </div>
        <div className="flex justify-end mt-6">
          <Button onClick={onClose} color="primary">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessageViewModal;
