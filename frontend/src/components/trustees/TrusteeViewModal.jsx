import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../icons/icons";
import Button from "../shared/Button";

const TrusteeViewModal = ({ trustee, onClose }) => {
  if (!trustee) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div className="bg-white rounded shadow-lg w-full max-w-xl p-6 relative border border-lightGray">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-4">
          {trustee.trusteeName || "Unnamed Trustee"}
        </h2>

        <div className="mb-4 text-gray-700 space-y-2">
          <p>
            <strong>Email:</strong> {trustee.trusteeEmail || "—"}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span className="capitalize">{trustee.status || "—"}</span>
          </p>
          <p>
            <strong>Invited On:</strong>{" "}
            {trustee.invitedAt
              ? new Date(trustee.invitedAt).toLocaleDateString()
              : "—"}
          </p>
        </div>

       <div className="mb-4 text-gray-700">
  <strong>Linked Messages:</strong>
  {trustee.messages && trustee.messages.length > 0 ? (
    <ul className="list-disc ml-6 mt-1">
      {trustee.messages.map((msg, idx) => (
        <li key={idx}>{msg.subject}</li>
      ))}
    </ul>
  ) : (
    <div className="ml-6 text-sm text-gray-500">No messages linked.</div>
  )}
</div>


  <div className="mb-4 text-gray-700">
  <strong>Linked Assets:</strong>
  {trustee.assets && trustee.assets.length > 0 ? (
    <ul className="list-disc ml-6 mt-1">
      {trustee.assets.map((asset, idx) => (
        <li key={idx}>{asset.name}</li>
      ))}
    </ul>
  ) : (
    <div className="ml-6 text-sm text-gray-500">No assets linked.</div>
  )}
</div>


        <div className="flex justify-end mt-6">
          <Button color="primary" onClick={onClose}>
            <FontAwesomeIcon icon={icons.close} className="mr-2" /> Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TrusteeViewModal;
