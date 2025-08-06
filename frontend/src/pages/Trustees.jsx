import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "../components/shared/Sidebar";
import ProfileBar from "../components/shared/ProfileBar";
import RecentTrustees from "../components/trustees/RecentTrustees";
import PendingTrustees from "../components/trustees/PendingTrustees";
import InviteTrusteeModal from "../components/trustees/InviteTrusteeModal";
import Header from "../components/shared/Header";
import ErrorBoundary from "../components/shared/ErrorBoundary";
import TrusteeCard from "../components/trustees/TrusteeCard";
import GroupTrustees from "../components/trustees/GroupTrustees";
import CreateGroupModal from "../components/trustees/CreateGroupModal";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

const Trustees = () => {
  const { user } = useAuth();
  const [view, setView] = useState("home");
  const [reloadKey, setReloadKey] = useState(0);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [trustees, setTrustees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState(() => {
    const saved = localStorage.getItem('trusteeGroups');
    return saved ? JSON.parse(saved) : [];
  });
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const ownerId = user?.id;

  const handleSearch = (query) => setSearchQuery(query);

const handleTrusteeUpdate = (updatedTrustees) => {
  setTrustees(prev => prev.map(trustee => {
    const updated = updatedTrustees.find(t => t.trusteeId === trustee.trusteeId);
    return updated || trustee;
  }));
};

  const fetchTrustees = async () => {
    if (!ownerId) return;
    setLoading(true);
    try {
      const response = await axios.get(`/api/trustees/${ownerId}`);
      const formatted = response.data.map(trustee => ({
        id: trustee.trusteeId,
        trusteeId: trustee.trusteeId,
        trusteeName: trustee.trusteeName,
        trusteeEmail: trustee.trusteeEmail,
        status: trustee.status,
        invitedAt: trustee.invitedAt,
        messages: trustee.messages || [],
        assets: trustee.assets || [],
        credentials: trustee.credentials || []
      }));
      setTrustees(formatted);
    } catch (error) {
      console.error("Failed to fetch trustees:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if ((view === "individual" || view === "external" || view === "group") && ownerId && trustees.length === 0) {
      fetchTrustees();
    }
  }, [view, ownerId, reloadKey]);

  useEffect(() => {
    localStorage.setItem('trusteeGroups', JSON.stringify(groups));
  }, [groups]);

  const handleUpdateTrustee = () => {
    setReloadKey(prev => prev + 1);
  };

  const handleRemoveTrustee = async (trustee) => {
    try {
      await axios.delete(`/api/trustees/${trustee.id}`);
      setReloadKey(prev => prev + 1);
    } catch (error) {
      console.error("Failed to remove trustee:", error);
    }
  };

  const handleCreateGroup = (groupName, selectedTrustees) => {
    const newGroup = {
      id: uuidv4(),
      name: groupName,
      trusteeIds: selectedTrustees.map(t => t.trusteeId),
      createdAt: new Date().toISOString()
    };
    setGroups([...groups, newGroup]);
    setShowCreateGroupModal(false);
  };

  const handleDeleteGroup = (groupId) => {
    setGroups(groups.filter(group => group.id !== groupId));
  };

const handleEditGroup = (updatedGroup) => {
  setGroups(prev => prev.map(g => 
    g.id === updatedGroup.id 
      ? {
          ...g,
          sharedMessages: updatedGroup.sharedMessages,
          sharedAssets: updatedGroup.sharedAssets,
          sharedCredentials: updatedGroup.sharedCredentials
        } 
      : g
  ));
};

  const filteredTrustees = trustees.filter(trustee => {
    if (view === "individual") return true;
    if (view === "external") return trustee.status === "PENDING";
    return false;
  });

  const searchedTrustees = filteredTrustees.filter(trustee => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return trustee.trusteeName?.toLowerCase().includes(query) || trustee.trusteeEmail?.toLowerCase().includes(query);
  });

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header searchPlaceholder="Search trustees by name or email..." onSearch={handleSearch} />
        <div className="flex flex-1">
          <div className="flex-1 p-8 overflow-y-auto">
            {view === "home" && (
              <>
                <ErrorBoundary fallback={<div className="mb-8 text-red-500">Error loading recent trustees</div>}>
                  <RecentTrustees ownerId={ownerId} reloadKey={reloadKey} searchQuery={searchQuery} onTrusteeUpdated={handleUpdateTrustee} />
                </ErrorBoundary>
                <ErrorBoundary fallback={<div className="text-red-500">Error loading pending trustees</div>}>
                  <PendingTrustees ownerId={ownerId} reloadKey={reloadKey} searchQuery={searchQuery} onTrusteeUpdated={handleUpdateTrustee} />
                </ErrorBoundary>
              </>
            )}

            {(view === "individual" || view === "external") && (
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  {view === "individual" ? "All Trustees" : "External Trustees"}
                  {searchQuery && (
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      (Showing {searchedTrustees.length} {view === "individual" ? "results" : "pending trustees"})
                    </span>
                  )}
                </h2>
                {loading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brandRose"></div>
                  </div>
                ) : searchedTrustees.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No trustees found</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {searchedTrustees.map(trustee => (
                      <TrusteeCard
                        key={trustee.id}
                        trustee={trustee}
                        onUpdate={handleUpdateTrustee}
                        onRemove={handleRemoveTrustee}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {view === "group" && (
              // In Trustees.jsx, update the GroupTrustees component:
<GroupTrustees
  groups={groups}
  trustees={trustees}
  onCreateGroup={() => setShowCreateGroupModal(true)}
  onDeleteGroup={handleDeleteGroup}
  onEditGroup={handleEditGroup}
  onTrusteeUpdate={handleTrusteeUpdate} // Make sure this is passed
  setReloadKey={setReloadKey}
/>
            )}
          </div>

          <div className="pt-6">
            <ErrorBoundary fallback={<div className="w-64 p-4 text-red-500">Error loading profile bar</div>}>
              <ProfileBar
                type="trustees"
                view={view}
                setView={setView}
                onNewItem={() => setShowInviteModal(true)}
              />
            </ErrorBoundary>
          </div>
        </div>
      </div>

      {showInviteModal && ownerId && (
        <InviteTrusteeModal
          ownerId={ownerId}
          onClose={() => setShowInviteModal(false)}
          onSuccess={() => {
            setReloadKey(prev => prev + 1);
            setShowInviteModal(false);
          }}
        />
      )}

      {showCreateGroupModal && (
        <CreateGroupModal
          trustees={trustees}
          onCreate={handleCreateGroup}
          onClose={() => setShowCreateGroupModal(false)}
        />
      )}
    </div>
  );
};

export default Trustees;
