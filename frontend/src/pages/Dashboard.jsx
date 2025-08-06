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
import Header from "../components/shared/Header";
import ErrorBoundary from "../components/shared/ErrorBoundary";

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
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

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

        // Normalize all data with unique keys
        const normalizeData = (data, prefix) => 
          data.slice(0, 5).map(item => ({
            ...item,
            uniqueKey: `${prefix}-${item.id || item.trusteeId}`
          }));

        setDashboardData({
          stats: {
            messages: messagesRes.data.length,
            assets: assetsRes.data.length,
            trustees: trusteesRes.data.length,
            credentials: credentialsRes.data.length
          },
          recentMessages: normalizeData(messagesRes.data, 'msg'),
          recentAssets: normalizeData(assetsRes.data, 'asset'),
          recentCredentials: normalizeData(credentialsRes.data, 'cred'),
          recentTrustees: normalizeData(trusteesRes.data, 'trustee')
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
    // Refresh data with consistent unique keys
    if (user?.id) {
      const refreshData = (endpoint, prefix) => 
        axios.get(endpoint).then(res => ({
          items: res.data.slice(0, 5).map(item => ({
            ...item,
            uniqueKey: `${prefix}-${item.id || item.trusteeId}`
          }))
        }));

      Promise.all([
        refreshData(`/api/messages/${user.id}`, 'msg'),
        refreshData(`/api/assets?ownerId=${user.id}`, 'asset'),
        refreshData(`/api/credentials?ownerId=${user.id}`, 'cred')
      ]).then(([messages, assets, credentials]) => {
        setDashboardData(prev => ({
          ...prev,
          recentMessages: messages.items,
          recentAssets: assets.items,
          recentCredentials: credentials.items
        }));
      });
    }
  };

  // Filter items based on search query
  const filterItems = (items, getTitleFn) => {
    if (!searchQuery) return items;
    const query = searchQuery.toLowerCase();
    return items.filter(item => 
      getTitleFn(item).toLowerCase().includes(query)
    );
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
      
      <div className="flex-1 flex flex-col">
        <Header 
          searchPlaceholder="Search across dashboard..." 
          onSearch={handleSearch}
        />
        
        <div className="flex flex-1">
          <div className="flex-1 p-8 overflow-y-auto">
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ErrorBoundary fallback={<div className="bg-white rounded-xl shadow-sm p-6 text-red-500">Error loading recent messages</div>}>
                  <RecentActivitySection 
                    title="Recent Messages"
                    icon={icons.messages}
                    items={filterItems(dashboardData.recentMessages, (item) => item.subject || "Untitled message")}
                    emptyMessage={searchQuery ? "No matching messages" : "No recent messages"}
                    link="/messages"
                    onItemClick={(item) => handleItemClick('message', item)}
                    getItemTitle={(item) => item.subject || "Untitled message"}
                    getItemSubtitle={(item) => item.deliveryStatus}
                    itemKey={(item) => item.uniqueKey}
                  />
                </ErrorBoundary>
                <ErrorBoundary fallback={<div className="bg-white rounded-xl shadow-sm p-6 text-red-500">Error loading recent memories</div>}>
                  <RecentActivitySection 
                    title="Recent Memories"
                    icon={icons.assets}
                    items={filterItems(dashboardData.recentAssets, (item) => item.name || "Unnamed asset")}
                    emptyMessage={searchQuery ? "No matching memories" : "No recent memories"}
                    link="/assets"
                    onItemClick={(item) => handleItemClick('asset', item)}
                    getItemTitle={(item) => item.name || "Unnamed asset"}
                    getItemSubtitle={(item) => item.assetType}
                    itemKey={(item) => item.uniqueKey}
                  />
                </ErrorBoundary>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ErrorBoundary fallback={<div className="bg-white rounded-xl shadow-sm p-6 text-red-500">Error loading recent credentials</div>}>
                  <RecentActivitySection 
                    title="Recent Credentials"
                    icon={icons.vault}
                    items={filterItems(dashboardData.recentCredentials, (item) => item.title || "Unnamed credential")}
                    emptyMessage={searchQuery ? "No matching credentials" : "No recent credentials"}
                    link="/vault"
                    onItemClick={(item) => handleItemClick('credential', item)}
                    getItemTitle={(item) => item.title || "Unnamed credential"}
                    getItemSubtitle={(item) => item.category}
                    itemKey={(item) => item.uniqueKey}
                  />
                </ErrorBoundary>
                <ErrorBoundary fallback={<div className="bg-white rounded-xl shadow-sm p-6 text-red-500">Error loading recent trustees</div>}>
                  <RecentActivitySection 
                    title="Recent Trustees"
                    icon={icons.trustees}
                    items={filterItems(dashboardData.recentTrustees, (item) => item.trusteeName || item.trusteeEmail || "Unnamed trustee")}
                    emptyMessage={searchQuery ? "No matching trustees" : "No recent trustees"}
                    link="/trustees"
                    getItemTitle={(item) => item.trusteeName || item.trusteeEmail || "Unnamed trustee"}
                    getItemSubtitle={(item) => item.status}
                    itemKey={(item) => item.uniqueKey}
                  />
                </ErrorBoundary>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modals */}
      {editingItem.type === 'message' && (
        <ErrorBoundary fallback={<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg">Error loading message editor</div>
        </div>}>
          <MessageEditModal
            message={editingItem.data}
            ownerId={user?.id}
            onClose={handleModalClose}
            onSave={handleModalClose}
          />
        </ErrorBoundary>
      )}

      {editingItem.type === 'asset' && (
        <ErrorBoundary fallback={<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg">Error loading asset editor</div>
        </div>}>
          <EditAssetModal
            asset={editingItem.data}
            ownerId={user?.id}
            onClose={handleModalClose}
            onSave={handleModalClose}
          />
        </ErrorBoundary>
      )}

      {editingItem.type === 'credential' && (
        <ErrorBoundary fallback={<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg">Error loading credential editor</div>
        </div>}>
          <CredentialEditModal
            credential={editingItem.data}
            ownerId={user?.id}
            onClose={handleModalClose}
            onUpdate={handleModalClose}
          />
        </ErrorBoundary>
      )}
    </div>
  );
};

export default Dashboard;