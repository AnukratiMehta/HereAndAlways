import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "../components/shared/Sidebar";
import ProfileBar from "../components/shared/ProfileBar";
import AssetUploadForm from "../components/assets/AssetUploadForm";
import AssetCard from "../components/assets/AssetCard";
import EditAssetModal from "../components/assets/EditAssetModal";

const Assets = () => {
  const { user } = useAuth();
  const [view, setView] = useState("home");
  const [showModal, setShowModal] = useState(false);
  const [assets, setAssets] = useState([]);
  const [editingAsset, setEditingAsset] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const getFilteredAssets = () => {
    switch (view) {
      case "messages":
        return assets.filter(a => a.linkedMessages?.length > 0);
      case "trustees":
        return assets.filter(a => a.trustees?.length > 0);
      case "all":
      case "home":
      default:
        return assets;
    }
  };

  const filteredAssets = getFilteredAssets();

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 p-8 relative">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Assets</h1>
        </div>

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
              <AssetUploadForm
                ownerId={user?.id}
                onUploadComplete={handleUploadComplete}
                onCancel={() => setShowModal(false)}
              />
            )}

            {editingAsset && (
              <EditAssetModal
                asset={editingAsset}
                onClose={() => setEditingAsset(null)}
                onSave={handleUpdate}
              />
            )}

            {filteredAssets.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredAssets.map(asset => (
                  <AssetCard
                    key={asset.id}
                    asset={asset}
                    onDelete={handleDelete}
                    onEdit={handleEditClick}
                  />
                ))}
              </div>
            ) : (
              <div className="text-gray-500 py-8 text-center">
                {assets.length === 0 
                  ? "No assets uploaded yet" 
                  : `No assets match the ${view} filter`}
              </div>
            )}
          </>
        )}
      </div>

      <ProfileBar
        type="assets"
        ownerName={user?.name || "Your"}
        view={view}
        setView={setView}
        onNewItem={() => setShowModal(true)}
      />
    </div>
  );
};

export default Assets;