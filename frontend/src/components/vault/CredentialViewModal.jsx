import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../icons/icons";
import Button from "../shared/Button";

const CredentialViewModal = ({ credential, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg relative border border-lightGray">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-brandRose hover:text-brandRose-dark text-2xl font-bold"
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold text-brandRose-dark mb-6">View Credential</h2>

        <div className="space-y-4 text-sm text-gray-700">
          <div>
            <span className="font-medium">Title:</span> {credential.title}
          </div>
          <div>
            <span className="font-medium">Username / Card Number:</span>{" "}
            {credential.usernameOrCardNumber}
          </div>
          <div>
            <span className="font-medium">Password / PIN:</span>{" "}
            {showPassword ? (
              <span className="ml-2 font-mono text-gray-800">
                {credential.decryptedPassword || "[decrypted placeholder]"}
              </span>
            ) : (
              <span className="ml-2 text-gray-400">••••••••</span>
            )}
            <button
              onClick={() => setShowPassword((prev) => !prev)}
              className="ml-3 text-xs text-brandRose hover:underline"
            >
              {showPassword ? "Hide" : "Reveal"}
            </button>
          </div>
          <div>
            <span className="font-medium">Category:</span> {credential.category}
          </div>
          {credential.notes && (
            <div>
              <span className="font-medium">Notes:</span>
              <div className="bg-gray-100 border border-gray-200 rounded p-2 mt-1 whitespace-pre-wrap">
                {credential.notes}
              </div>
            </div>
          )}
          <div>
            <span className="font-medium">Linked Trustees:</span>{" "}
            {credential.trustees && credential.trustees.length > 0
              ? credential.trustees.join(", ")
              : <span className="text-gray-400">None</span>}
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={onClose} label="Close" variant="secondary" />
        </div>
      </div>
    </div>
  );
};

export default CredentialViewModal;
