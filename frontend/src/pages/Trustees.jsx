import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "../components/shared/Sidebar";
import ProfileBar from "../components/shared/ProfileBar";
import RecentTrustees from "../components/trustees/RecentTrustees";
import PendingTrustees from "../components/trustees/PendingTrustees";
import InviteTrusteeModal from "../components/trustees/InviteTrusteeModal";
import Header from "../components/shared/Header";
import ErrorBoundary from "../components/shared/ErrorBoundary";

const Trustees = () => {
  const { user } = useAuth();
  const [view, setView] = useState("home");
  const [reloadKey, setReloadKey] = useState(0);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const ownerId = user?.id;

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header 
          searchPlaceholder="Search trustees by name or email..." 
          onSearch={handleSearch}
        />
        
        <div className="flex flex-1">
          <div className="flex-1 p-8 overflow-y-auto">
            {view === "home" && (
              <>
                <ErrorBoundary fallback={<div className="mb-8 text-red-500">Error loading recent trustees</div>}>
                  <RecentTrustees 
                    ownerId={ownerId} 
                    reloadKey={reloadKey}
                    searchQuery={searchQuery}
                    onTrusteeUpdated={() => setReloadKey(prev => prev + 1)} 
                  />
                </ErrorBoundary>
                <ErrorBoundary fallback={<div className="text-red-500">Error loading pending trustees</div>}>
                  <PendingTrustees 
                    ownerId={ownerId} 
                    reloadKey={reloadKey}
                    searchQuery={searchQuery}
                    onTrusteeUpdated={() => setReloadKey(prev => prev + 1)} 
                  />
                </ErrorBoundary>
              </>
            )}

            {view === "individual" && <div>Individual Trustees view coming soon.</div>}
            {view === "external" && <div>External Trustees view coming soon.</div>}
            {view === "group" && <div>Group Trustees view coming soon.</div>}
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

      {/* Trustee Invitation Modal */}
      {showInviteModal && ownerId && (
        <ErrorBoundary fallback={<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg">Error loading invite form</div>
        </div>}>
          <InviteTrusteeModal
            ownerId={ownerId}
            onClose={() => setShowInviteModal(false)}
            onSuccess={() => {
              setReloadKey(prev => prev + 1);
              setShowInviteModal(false);
            }}
          />
        </ErrorBoundary>
      )}
    </div>
  );
};

export default Trustees;