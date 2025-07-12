import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/shared/Sidebar";
import ProfileBar from "../components/shared/ProfileBar";
import AssetUploadForm from "../components/assets/AssetUploadForm";
import AssetCard from "../components/assets/AssetCard";
import EditAssetModal from "../components/assets/EditAssetModal";

const Assets = () => {
  const [view, setView] = useState("home");
  const [showModal, setShowModal] = useState(false);
  const [assets, setAssets] = useState([]);
  const [editingAsset, setEditingAsset] = useState(null);

  const ownerId = "1d28bf25-fce1-4e4f-9309-b3471db1d88b";

  const handleDelete = (deletedId) => {
    setAssets((prev) => prev.filter((asset) => asset.id !== deletedId));
  };

  const handleEditClick = (asset) => {
    setEditingAsset(asset);
  };

  const handleUpdate = (updatedAsset) => {
    setAssets((prev) =>
      prev.map((asset) => (asset.id === updatedAsset.id ? updatedAsset : asset))
    );
    setEditingAsset(null);
  };

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await axios.get("/api/assets", {
          params: { ownerId },
        });
        setAssets(response.data);
      } catch (err) {
        console.error("Failed to load assets", err);
      }
    };

    fetchAssets();
  }, [ownerId]);

  const handleUploadComplete = (newAssets) => {
    setAssets((prev) => [...prev, ...newAssets]);
    setShowModal(false);
  };

  const getFilteredAssets = () => {
  switch (view) {
    case "messages":
      return assets.filter((a) => a.linkedMessages?.length > 0);
    case "trustees":
      return assets.filter((a) => a.linkedTrustees?.length > 0);
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

        {showModal && (
          <AssetUploadForm
            onUploadComplete={handleUploadComplete}
            onCancel={() => setShowModal(false)}
          />
        )}

        {editingAsset && (
          <EditAssetModal
            asset={editingAsset}
            ownerId={ownerId}
            onClose={() => setEditingAsset(null)}
            onSave={handleUpdate}
          />
        )}

        {filteredAssets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredAssets.map((asset) => (
              <AssetCard
                key={asset.id}
                asset={asset}
                onDelete={handleDelete}
                onEdit={handleEditClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-gray-500">No assets uploaded yet.</div>
        )}
      </div>

      <ProfileBar
        type="assets"
        ownerName="John Doe"
        view={view}
        setView={setView}
        onNewItem={() => setShowModal(true)}
      />
    </div>
  );
};

export default Assets;
