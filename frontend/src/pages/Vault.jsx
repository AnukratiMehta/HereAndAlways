import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/shared/Sidebar";
import ProfileBar from "../components/shared/ProfileBar";
import CredentialUploadForm from "../components/vault/CredentialUploadForm";

const Vault = () => {
  const [view, setView] = useState("home");
  const [credentials, setCredentials] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCredential, setEditingCredential] = useState(null);

  const ownerId = "1d28bf25-fce1-4e4f-9309-b3471db1d88b"; // Replace with actual logic later

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        const response = await axios.get("/api/credentials", {
          params: { ownerId },
        });
        setCredentials(response.data);
      } catch (err) {
        console.error("Failed to load credentials", err);
      }
    };

    fetchCredentials();
  }, [ownerId]);

  const handleDelete = (deletedId) => {
    setCredentials((prev) => prev.filter((item) => item.id !== deletedId));
  };

  const handleEditClick = (credential) => {
    setEditingCredential(credential);
  };

  const handleUpdate = (updatedCredential) => {
    setCredentials((prev) =>
      prev.map((item) => (item.id === updatedCredential.id ? updatedCredential : item))
    );
    setEditingCredential(null);
  };

  const handleUploadComplete = (newCredential) => {
    setCredentials((prev) => [...prev, newCredential]);
    setShowModal(false);
  };

  const getFilteredCredentials = () => {
    switch (view) {
      case "social":
        return credentials.filter((c) => c.category === "Social");
      case "bank":
        return credentials.filter((c) => c.category === "Bank");
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

        {showModal && (
  <CredentialUploadForm
    onUploadComplete={handleUploadComplete}
    onCancel={() => setShowModal(false)}
  />
)}


        {editingCredential && (
          <div className="text-gray-600">EditVaultModal goes here...</div>
        )}

        {filteredCredentials.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredCredentials.map((cred) => (
  <VaultCard
    key={cred.id}
    credential={cred}
    onView={(item) => console.log("View", item)}
    onEdit={handleEditClick}
    onDelete={handleDelete}
  />
))}

            <div className="text-gray-600">VaultCard placeholders...</div>
          </div>
        ) : (
          <div className="text-gray-500">No credentials saved yet.</div>
        )}
      </div>

      <ProfileBar
        type="vault"
        ownerName="John Doe"
        view={view}
        setView={setView}
        onNewItem={() => setShowModal(true)}
      />
    </div>
  );
};

export default Vault;
