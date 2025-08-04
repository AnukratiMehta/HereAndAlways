import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "../components/shared/Sidebar";
import ProfileBar from "../components/shared/ProfileBar";
import AssetUploadForm from "../components/assets/AssetUploadForm";
import AssetCard from "../components/assets/AssetCard";
import EditAssetModal from "../components/assets/EditAssetModal";
import Header from "../components/shared/Header";
import ErrorBoundary from "../components/shared/ErrorBoundary";

const Assets = () => {
  const { user } = useAuth();
  const [view, setView] = useState("home");
  const [showModal, setShowModal] = useState(false);
  const [assets, setAssets] = useState([]);
  const [editingAsset, setEditingAsset] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleDelete = async (deletedId) => {
    try {
      await axios.delete(`/api/assets/${deletedId}`);
      setAssets(prev => prev.filter(asset => asset.id !== deletedId));
    } catch (err) {
      console.error("Failed to delete asset", err);
      setError("Failed to delete asset");
    }
  };

  const handleEditClick = (asset) => {
    setEditingAsset(asset);
  };

  const handleUpdate = async (updatedAsset) => {
    try {
      const response = await axios.put(`/api/assets/${updatedAsset.id}`, updatedAsset);
      setAssets(prev => 
        prev.map(asset => asset.id === updatedAsset.id ? response.data : asset)
      );
      setEditingAsset(null);
    } catch (err) {
      console.error("Failed to update asset", err);
      setError("Failed to update asset");
    }
  };

  useEffect(() => {
    const fetchAssets = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get("/api/assets", {
          params: { ownerId: user.id }
        });
        setAssets(response.data);
      } catch (err) {
        console.error("Failed to load assets", err);
        setError("Failed to load assets");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssets();
  }, [user?.id]);

  const handleUploadComplete = (newAssets) => {
    setAssets(prev => [...prev, ...newAssets]);
    setShowModal(false);
  };

  // Assets.jsx
const getFilteredAssets = () => {
  let filtered = assets;
  
  // Apply view filter
  switch (view) {
    case "messages":
      filtered = filtered.filter(a => a.linkedMessages?.length > 0);
      break;
    case "trustees":
      filtered = filtered.filter(a => a.linkedTrustees?.length > 0);
      break;
    case "all":
    case "home":
    default:
      break;
  }
  
  // Apply search filter
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(asset => 
      asset.name.toLowerCase().includes(query) ||
      (asset.description && asset.description.toLowerCase().includes(query))
    );
  }
  
  return filtered;
};

  const filteredAssets = getFilteredAssets();

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header 
          searchPlaceholder="Search assets by name or description..." 
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
              <div className="text-center py-8">Loading assets...</div>
            ) : (
              <>
                {showModal && (
                  <ErrorBoundary fallback={<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg">Error loading upload form</div>
                  </div>}>
                    <AssetUploadForm
                      ownerId={user?.id}
                      onUploadComplete={handleUploadComplete}
                      onCancel={() => setShowModal(false)}
                    />
                  </ErrorBoundary>
                )}

                {editingAsset && (
                  <ErrorBoundary fallback={<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg">Error loading edit form</div>
                  </div>}>
                    <EditAssetModal
                      asset={editingAsset}
                      onClose={() => setEditingAsset(null)}
                      onSave={handleUpdate}
                    />
                  </ErrorBoundary>
                )}

                {filteredAssets.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {filteredAssets.map(asset => (
                      <ErrorBoundary key={asset.id} fallback={<div className="border border-lightGray rounded-xl p-4 text-red-500">Error displaying asset</div>}>
                        <AssetCard
                          asset={asset}
                          onDelete={handleDelete}
                          onEdit={handleEditClick}
                        />
                      </ErrorBoundary>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 py-8 text-center">
                    {assets.length === 0 
                      ? "No assets uploaded yet" 
                      : searchQuery
                        ? `No assets match "${searchQuery}"`
                        : `No assets match the ${view} filter`}
                  </div>
                )}
              </>
            )}
          </div>

          <div className="pt-6">
            <ErrorBoundary fallback={<div className="w-64 p-4 text-red-500">Error loading profile bar</div>}>
              <ProfileBar
                type="assets"
                view={view}
                setView={setView}
                onNewItem={() => setShowModal(true)}
              />
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assets;