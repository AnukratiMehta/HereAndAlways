import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../icons/icons";
import Button from "../shared/Button";
import { decryptTextWithBase64Key } from "../../utils/encryptionUtils";

const CredentialViewModal = ({ credential, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [decryptedPassword, setDecryptedPassword] = useState(null);
  const [loading, setLoading] = useState(false);

    useEffect(() => {
    console.log('Credential data received:', credential);
    console.log('Credential trustees:', credential?.trustees);
    console.log('Credential trusteeIds:', credential?.trusteeIds);
  }, [credential]);

  const handleReveal = async () => {
    if (showPassword) {
      setShowPassword(false);
      return;
    }

    if (decryptedPassword) {
      setShowPassword(true);
      return;
    }

    setLoading(true);
    try {
      const fileResponse = await fetch(credential.passwordOrPin);
      if (!fileResponse.ok) throw new Error("Failed to fetch encrypted content");
      const encryptedText = await fileResponse.text();

      const decrypted = await decryptTextWithBase64Key(
        encryptedText,
        credential.encryptedKey
      );
      setDecryptedPassword(decrypted);
      setShowPassword(true);
    } catch (err) {
      console.error("Failed to decrypt:", err);
      alert("Failed to reveal password.");
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = () => {
    switch (credential.category) {
      case "SOCIAL": return "Social Media";
      case "BANK": return "Bank Account";
      case "EMAIL": return "Email";
      default: return "Other";
    }
  };

  const getTrusteeNames = () => {
    if (!credential.trustees || credential.trustees.length === 0) return [];
    
    return credential.trustees.map(t => t.name || t.email || `Trustee ID: ${t.id}`);
  };

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg relative border border-lightGray">

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold text-brandRose-dark mb-6">View Credential</h2>

        <div className="space-y-4 text-sm text-gray-700">
          <div>
            <span className="font-medium">Title:</span> {credential.title}
          </div>
          <div>
            <span className="font-medium">Category:</span> {getCategoryName()}
          </div>
          <div>
            <span className="font-medium">Username / Card Number:</span>{" "}
            {credential.usernameOrCardNumber}
          </div>
          <div>
            <span className="font-medium">Password / PIN:</span>{" "}
            {showPassword ? (
              <span className="ml-2 font-mono text-gray-800">
                {decryptedPassword || "[Decryption failed]"}
              </span>
            ) : (
              <span className="ml-2 text-gray-400">••••••••</span>
            )}
            <button
              onClick={handleReveal}
              className="ml-3 text-xs text-brandRose hover:underline cursor-pointer"
              disabled={loading}
            >
              {loading ? "Decrypting..." : showPassword ? "Hide" : "Reveal"}
            </button>
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
            <span className="font-medium">Created:</span>{" "}
            {credential.createdAt ? new Date(credential.createdAt).toLocaleString() : "Unknown"}
          </div>
          <div>
            <span className="font-medium">Linked Trustees:</span>{" "}
            {getTrusteeNames().length > 0 ? (
              <ul className="list-disc pl-5 mt-1">
                {getTrusteeNames().map((name, index) => (
                  <li key={index} className="text-gray-800">{name}</li>
                ))}
              </ul>
            ) : (
              <span className="text-gray-400">None</span>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button 
            onClick={onClose} 
            color="secondary"
            className="px-4 py-2"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CredentialViewModal;