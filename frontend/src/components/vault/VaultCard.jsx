import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../icons/icons";

const VaultCard = ({ credential, onView, onEdit, onDelete }) => {
  const getCategoryIcon = (category) => {
    switch (category) {
      case "SOCIAL":
        return icons.instagram;
      case "BANK":
        return icons.creditCard;
      case "EMAIL":
        return icons.envelope;
      default:
        return icons.lock;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col justify-between h-full">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-3 rounded-full bg-brandRose text-white shadow">
          <FontAwesomeIcon icon={getCategoryIcon(credential.category)} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {credential.title}
          </h3>
          <p className="text-sm text-gray-500">{credential.category}</p>
        </div>
      </div>

      <div className="text-sm text-gray-600 mb-4">
        <span className="font-medium">ID:</span>{" "}
        {credential.usernameOrCardNumber
          ? credential.usernameOrCardNumber.replace(/.(?=.{4})/g, "*")
          : "—"}
      </div>

      <div className="flex justify-between items-center mt-auto gap-2">
        <button
          onClick={() => onView?.(credential)}
          className="text-brandRose hover:underline text-sm"
        >
          View
        </button>
        <button
          onClick={() => onEdit?.(credential)}
          className="text-gray-600 hover:text-black text-sm"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete?.(credential.id)}
          className="text-red-500 hover:underline text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default VaultCard;
