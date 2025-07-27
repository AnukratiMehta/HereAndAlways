import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "../components/shared/Sidebar";
import ProfileBar from "../components/shared/ProfileBar";
import StatCard from "../components/dashboard/StatCard";
import RecentActivitySection from "../components/dashboard/RecentActivitySection";
import MessageEditModal from "../components/messages/MessageEditModal";
import EditAssetModal from "../components/assets/EditAssetModal";
import CredentialEditModal from "../components/vault/CredentialEditModal";
import { icons } from "../icons/icons";

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    stats: null,
    recentMessages: [],
    recentAssets: [],
    recentCredentials: [],
    recentTrustees: []
  });
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("home");
  const [editingItem, setEditingItem] = useState({ 
    type: null, 
    data: null 
  });

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [messagesRes, assetsRes, trusteesRes, credentialsRes] = await Promise.all([
          axios.get(`/api/messages/${user.id}`),
          axios.get(`/api/assets?ownerId=${user.id}`),
          axios.get(`/api/trustees/recent/${user.id}`),
          axios.get(`/api/credentials?ownerId=${user.id}`)
        ]);

        setDashboardData({
          stats: {
            messages: messagesRes.data.length,
            assets: assetsRes.data.length,
            trustees: trusteesRes.data.length,
            credentials: credentialsRes.data.length
          },
          recentMessages: messagesRes.data.slice(0, 5),
          recentAssets: assetsRes.data.slice(0, 5),
          recentTrustees: trusteesRes.data.slice(0, 5),
          recentCredentials: credentialsRes.data.slice(0, 5)
        });
      } catch (error) {
        console.error("Dashboard data error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  const handleItemClick = (type, item) => {
    setEditingItem({ type, data: item });
  };

  const handleModalClose = () => {
    setEditingItem({ type: null, data: null });
    // Refresh data when modals close
    if (user?.id) {
      axios.get(`/api/messages/${user.id}`).then(res => {
        setDashboardData(prev => ({ 
          ...prev, 
          recentMessages: res.data.slice(0, 5) 
        }));
      });
      axios.get(`/api/assets?ownerId=${user.id}`).then(res => {
        setDashboardData(prev => ({ 
          ...prev, 
          recentAssets: res.data.slice(0, 5) 
        }));
      });
      axios.get(`/api/credentials?ownerId=${user.id}`).then(res => {
        setDashboardData(prev => ({ 
          ...prev, 
          recentCredentials: res.data.slice(0, 5) 
        }));
      });
    }
  };

  if (loading || !dashboardData.stats) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="animate-pulse text-gray-500">Loading dashboard...</div>
        </div>
        <ProfileBar type="dashboard" view={view} setView={setView} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <div className="flex-1 p-8 relative">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={icons.messages} 
            title="Messages" 
            value={dashboardData.stats.messages} 
            link="/messages"
          />
          <StatCard 
            icon={icons.assets} 
            title="Memories" 
            value={dashboardData.stats.assets} 
            link="/assets"
            color="bg-purple-100 text-purple-600"
          />
          <StatCard 
            icon={icons.vault} 
            title="Credentials" 
            value={dashboardData.stats.credentials} 
            link="/vault"
            color="bg-green-100 text-green-600"
          />
          <StatCard 
            icon={icons.trustees} 
            title="Trustees" 
            value={dashboardData.stats.trustees} 
            link="/trustees"
            color="bg-orange-100 text-orange-600"
          />
        </div>

        {/* Recent Activity Sections */}
<div className="space-y-8">
  {/* First row with 2 sections */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <RecentActivitySection 
      title="Recent Messages"
      icon={icons.messages}
      items={dashboardData.recentMessages}
      emptyMessage="No recent messages"
      link="/messages"
      onItemClick={(item) => handleItemClick('message', item)}
      getItemTitle={(item) => item.subject || "Untitled message"}
      getItemSubtitle={(item) => item.deliveryStatus}
    />
    <RecentActivitySection 
      title="Recent Memories"
      icon={icons.assets}
      items={dashboardData.recentAssets}
      emptyMessage="No recent memories"
      link="/assets"
      onItemClick={(item) => handleItemClick('asset', item)}
      getItemTitle={(item) => item.name || "Unnamed asset"}
      getItemSubtitle={(item) => item.assetType}
    />
  </div>

  {/* Second row with 2 sections */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <RecentActivitySection 
      title="Recent Credentials"
      icon={icons.vault}
      items={dashboardData.recentCredentials}
      emptyMessage="No recent credentials"
      link="/vault"
      onItemClick={(item) => handleItemClick('credential', item)}
      getItemTitle={(item) => item.title || "Unnamed credential"}
      getItemSubtitle={(item) => item.category}
    />
    <RecentActivitySection 
      title="Recent Trustees"
      icon={icons.trustees}
      items={dashboardData.recentTrustees}
      emptyMessage="No recent trustees"
      link="/trustees"
      getItemTitle={(item) => item.trusteeName || item.trusteeEmail || "Unnamed trustee"}
      getItemSubtitle={(item) => item.status}
    />
  </div>
</div>
      </div>

      <ProfileBar 
        type="dashboard" 
        view={view} 
        setView={setView} 
        onNewItem={() => {}} 
      />

      {/* Edit Modals */}
      {editingItem.type === 'message' && (
        <MessageEditModal
          message={editingItem.data}
          ownerId={user?.id}
          onClose={handleModalClose}
          onSave={handleModalClose}
        />
      )}

      {editingItem.type === 'asset' && (
        <EditAssetModal
          asset={editingItem.data}
          ownerId={user?.id}
          onClose={handleModalClose}
          onSave={handleModalClose}
        />
      )}

      {editingItem.type === 'credential' && (
        <CredentialEditModal
          credential={editingItem.data}
          ownerId={user?.id}
          onClose={handleModalClose}
          onUpdate={handleModalClose}
        />
      )}
    </div>
  );
};

export default Dashboard;