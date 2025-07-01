import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../icons/icons";

const MessageViewModal = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div className="bg-white rounded shadow-lg w-full max-w-xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">{message.subject || "Untitled"}</h2>
        <div className="mb-4 text-gray-700 whitespace-pre-wrap">{message.body || "(No content)"}</div>
        <div className="text-sm text-gray-500">
          <p><strong>Status:</strong> {message.deliveryStatus}</p>
          <p><strong>Created On:</strong> {new Date(message.createdAt).toLocaleString()}</p>
          {message.scheduledDelivery && (
            <p>
              <strong>Scheduled For:</strong>{" "}
              {new Date(message.scheduledDelivery).toLocaleString()}
            </p>
          )}
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-brandRose text-white px-4 py-2 rounded hover:bg-brandRose-dark"
          >
            <FontAwesomeIcon icon={icons.close} /> Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageViewModal;
