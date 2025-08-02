import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../icons/icons";
import Button from "../shared/Button";

const MessageCard = ({ message, onEdit, onDelete }) => {
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
          <strong>Trustee:</strong> {message.trusteeName || "Unassigned"}
        </p>
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
