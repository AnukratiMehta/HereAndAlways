import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../icons/icons";
import Button from "../shared/Button";

const MessageCard = ({ message, onEdit }) => {
  return (
    <div className="w-full bg-brandRose-soft rounded-2xl border border-brandRose p-4 shadow transition hover:-translate-y-1 hover:shadow-xl space-y-2">
      <h3 className="text-lg font-semibold text-brandRose-dark">
        {message.subject || "Untitled"}
      </h3>
      <p className="text-sm text-charcoal whitespace-pre-wrap truncate">
        {message.body || "(No content)"}
      </p>
      <div className="text-xs text-gray-600 space-y-1">
        <p>
          <strong>Status:</strong> {message.deliveryStatus}
        </p>
        <p>
          <strong>Created On:</strong>{" "}
          {new Date(message.createdAt).toLocaleDateString()}
        </p>
        <p>
          <strong>Trustee:</strong> {message.trusteeName || "Unassigned"}
        </p>
      </div>
      <div className="pt-2 text-right">
        <Button
          color="secondary"
          size="sm"
          onClick={() => onEdit(message)}
        >
          <FontAwesomeIcon icon={icons.pen} /> Edit
        </Button>
      </div>
    </div>
  );
};

export default MessageCard;
