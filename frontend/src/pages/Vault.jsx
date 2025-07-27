import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "../components/shared/Sidebar";
import ProfileBar from "../components/shared/ProfileBar";
import CredentialUploadForm from "../components/vault/CredentialUploadForm";
import CredentialEditModal from "../components/vault/CredentialEditModal";
import CredentialViewModal from "../components/vault/CredentialViewModal";
import VaultCard from "../components/vault/VaultCard";

const Vault = () => {
  const { user } = useAuth(); // Get authenticated user from context
  const [view, setView] = useState("home");
  const [credentials, setCredentials] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCredential, setEditingCredential] = useState(null);
  const [viewingCredential, setViewingCredential] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const ownerId = user?.id; // Use dynamic ownerId from auth

  useEffect(() => {
    const fetchCredentials = async () => {
      if (!ownerId) return; // Don't fetch if no user is logged in
      
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get("/api/credentials", {
          params: { ownerId },
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setCredentials(response.data);
      } catch (err) {
        console.error("Failed to load credentials", err);
        setError("Failed to load credentials. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCredentials();
  }, [ownerId]);

  useEffect(() => {
    const modalOpen = showModal || editingCredential || viewingCredential;
    document.body.style.overflow = modalOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal, editingCredential, viewingCredential]);

  const handleDelete = async (deletedId) => {
    try {
      await axios.delete(`/api/credentials/${deletedId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCredentials((prev) => prev.filter((item) => item.id !== deletedId));
    } catch (err) {
      console.error("Failed to delete credential", err);
      setError("Failed to delete credential. Please try again.");
    }
  };

  const handleEditClick = (credential) => {
    setEditingCredential(credential);
  };

  const handleUpdate = async (updatedCredential) => {
    try {
      const response = await axios.put(
        `/api/credentials/${updatedCredential.id}`,
        updatedCredential,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setCredentials((prev) =>
        prev.map((item) =>
          item.id === updatedCredential.id ? response.data : item
        )
      );
      setEditingCredential(null);
    } catch (err) {
      console.error("Failed to update credential", err);
      setError("Failed to update credential. Please try again.");
    }
  };

  const handleUploadComplete = (newCredential) => {
    setCredentials((prev) => [...prev, newCredential]);
    setShowModal(false);
  };

  const getFilteredCredentials = () => {
    switch (view) {
      case "social":
        return credentials.filter((c) => c.category === "SOCIAL");
      case "bank":
        return credentials.filter((c) => c.category === "BANK");
      case "all":
      case "home":
      default:
        return credentials;
    }
  };

  const filteredCredentials = getFilteredCredentials();

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 p-8 relative">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Secure Vault</h1>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-8">Loading credentials...</div>
        ) : (
          <>
            {filteredCredentials.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredCredentials.map((cred) => (
                  <VaultCard
                    key={cred.id}
                    credential={cred}
                    onView={(c) => setViewingCredential(c)}
                    onEdit={handleEditClick}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            ) : (
              <div className="text-gray-500 py-8 text-center">
                {credentials.length === 0 
                  ? "No credentials saved yet" 
                  : `No credentials match the ${view} filter`}
              </div>
            )}
          </>
        )}
      </div>

      <ProfileBar
        type="vault"
        ownerName={user?.name || "Your"} // Dynamic owner name
        view={view}
        setView={setView}
        onNewItem={() => setShowModal(true)}
      />

      {/* Upload form modal */}
      {showModal && ownerId && (
        <CredentialUploadForm
          ownerId={ownerId}
          onUploadComplete={handleUploadComplete}
          onCancel={() => setShowModal(false)}
        />
      )}

      {/* Edit modal */}
      {editingCredential && (
        <CredentialEditModal
          credential={editingCredential}
          ownerId={ownerId}
          onClose={() => setEditingCredential(null)}
          onUpdate={handleUpdate}
        />
      )}

      {/* View modal */}
      {viewingCredential && (
        <CredentialViewModal
          credential={viewingCredential}
          onClose={() => setViewingCredential(null)}
        />
      )}
    </div>
  );
};

export default Vault;