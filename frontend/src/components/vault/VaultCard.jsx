import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../icons/icons";
import axios from "axios";
import ConfirmDeleteModal from "../shared/ConfirmDeleteModal";

const VaultCard = ({ credential, onView, onEdit, onDelete }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axios.delete(`/api/credentials/${credential.id}`);
      onDelete(credential.id);
    } catch (err) {
      console.error("Failed to delete credential:", err);
      alert("Failed to delete. Please try again.");
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col justify-between h-full relative">
      {/* Edit icon top-right */}
      <button
        onClick={() => onEdit?.(credential)}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        title="Edit"
      >
        <FontAwesomeIcon icon={icons.pen} />
      </button>

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

      {/* View + Delete icons */}
      <div className="mt-auto pt-4 flex justify-end gap-4 text-lg">
        <button
          onClick={() => onView?.(credential)}
          title="View"
          className="text-brandRose hover:text-brandRose-dark"
        >
          <FontAwesomeIcon icon={icons.eye} />
        </button>
        <button
          onClick={() => setShowConfirm(true)}
          title="Delete"
          className="text-red-500 hover:text-red-700"
        >
          <FontAwesomeIcon icon={icons.trash} />
        </button>
      </div>

      {showConfirm && (
        <ConfirmDeleteModal
          title="Delete Credential"
          itemName={credential.title}
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
          loading={deleting}
        />
      )}
    </div>
  );
};

export default VaultCard;
