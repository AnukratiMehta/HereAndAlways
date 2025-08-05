import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "../components/shared/Sidebar";
import ProfileBar from "../components/shared/ProfileBar";
import CredentialUploadForm from "../components/vault/CredentialUploadForm";
import CredentialEditModal from "../components/vault/CredentialEditModal";
import CredentialViewModal from "../components/vault/CredentialViewModal";
import VaultCard from "../components/vault/VaultCard";
import Header from "../components/shared/Header";
import ErrorBoundary from "../components/shared/ErrorBoundary";

const Vault = () => {
  const { user } = useAuth();
  const [view, setView] = useState("home");
  const [credentials, setCredentials] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCredential, setEditingCredential] = useState(null);
  const [viewingCredential, setViewingCredential] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const ownerId = user?.id;

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  useEffect(() => {
    const fetchCredentials = async () => {
      if (!ownerId) return;
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

  const handleUpdate = async (updatedCredential) => {
    try {
      const response = await axios.put(
        `/api/credentials/${updatedCredential.id}`,
        updatedCredential,
        {
          params: { ownerId },
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
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
      setError(err.response?.data?.message || "Failed to update credential. Please try again.");
    }
  };

  const handleDelete = async (deletedId) => {
    try {
      await axios.delete(`/api/credentials/${deletedId}`, {
        params: { ownerId },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCredentials((prev) => prev.filter((item) => item.id !== deletedId));
    } catch (err) {
      console.error("Failed to delete credential", err);
      setError(err.response?.data?.message || "Failed to delete credential. Please try again.");
    }
  };

  const handleEditClick = (credential) => {
    setEditingCredential(credential);
  };

  const handleUploadComplete = (newCredential) => {
    setCredentials((prev) => [...prev, newCredential]);
    setShowModal(false);
  };

  const getFilteredCredentials = () => {
    let filtered = credentials;

    switch (view) {
      case "email":
        filtered = filtered.filter((c) => c.category === "EMAIL");
        break;
      case "others":
        filtered = filtered.filter((c) => c.category == "OTHER");
        break;
      case "social":
        filtered = filtered.filter((c) => c.category === "SOCIAL");
        break;
      case "bank":
        filtered = filtered.filter((c) => c.category === "BANK");
        break;
      case "all":
      case "home":
      default:
        break;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(cred =>
        cred.serviceName?.toLowerCase().includes(query) ||
        cred.username?.toLowerCase().includes(query) ||
        cred.description?.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  const filteredCredentials = getFilteredCredentials();

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header 
          searchPlaceholder="Search credentials by service, username..." 
          onSearch={handleSearch}
        />

        <div className="flex flex-1">
          <div className="flex-1 p-8 overflow-y-auto">
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
                      <ErrorBoundary key={cred.id} fallback={<div className="border border-lightGray rounded-xl p-4 text-red-500">Error displaying credential</div>}>
                        <VaultCard
                          credential={cred}
                          onView={(c) => setViewingCredential(c)}
                          onEdit={handleEditClick}
                          onDelete={handleDelete}
                        />
                      </ErrorBoundary>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 py-8 text-center">
                    {credentials.length === 0 
                      ? "No credentials saved yet" 
                      : searchQuery
                        ? `No credentials match "${searchQuery}"`
                        : `No credentials match the ${view} filter`}
                  </div>
                )}
              </>
            )}
          </div>

          <div className="pt-6">
            <ErrorBoundary fallback={<div className="w-64 p-4 text-red-500">Error loading profile bar</div>}>
              <ProfileBar
                type="vault"
                view={view}
                setView={setView}
                onNewItem={() => setShowModal(true)}
              />
            </ErrorBoundary>
          </div>
        </div>
      </div>

      {showModal && ownerId && (
        <ErrorBoundary fallback={<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg">Error loading upload form</div>
        </div>}>
          <CredentialUploadForm
            ownerId={ownerId}
            onUploadComplete={handleUploadComplete}
            onCancel={() => setShowModal(false)}
          />
        </ErrorBoundary>
      )}

      {editingCredential && (
        <ErrorBoundary fallback={<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg">Error loading edit form</div>
        </div>}>
          <CredentialEditModal
            credential={editingCredential}
            ownerId={ownerId}
            onClose={() => setEditingCredential(null)}
            onUpdate={handleUpdate}
          />
        </ErrorBoundary>
      )}

      {viewingCredential && (
        <ErrorBoundary fallback={<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg">Error loading credential view</div>
        </div>}>
          <CredentialViewModal
            credential={viewingCredential}
            onClose={() => setViewingCredential(null)}
          />
        </ErrorBoundary>
      )}
    </div>
  );
};

export default Vault;
