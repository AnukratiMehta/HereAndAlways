import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../icons/icons";

const ConfirmDeleteModal = ({
  title = "Delete Item",
  itemName = "this item",
  onConfirm,
  onCancel,
  loading = false,
}) => {
  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
        <div className="text-red-600 text-2xl mb-3">
          <FontAwesomeIcon icon={icons.trash} />
        </div>
        <h2 className="text-lg font-semibold mb-2 text-red-600">{title}</h2>
        <p className="text-gray-700 mb-6 break-words">
          Are you sure you want to permanently delete
          <strong className="block break-words break-all whitespace-normal mt-1">{itemName}</strong>
        </p>

        <div className="flex justify-between gap-4">
          <button
            onClick={onCancel}
            className="flex-1 py-1 border border-gray-300 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            {loading ? "Deleting..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
