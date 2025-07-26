import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "../components/shared/Sidebar";
import ProfileBar from "../components/shared/ProfileBar";
import RecentTrustees from "../components/trustees/RecentTrustees";
import PendingTrustees from "../components/trustees/PendingTrustees";
import InviteTrusteeModal from "../components/trustees/InviteTrusteeModal";

const Trustees = () => {
  const { user } = useAuth();
  const [view, setView] = useState("home");
  const [reloadKey, setReloadKey] = useState(0);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const ownerId = user?.id;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Trustees</h1>
        </div>

        {view === "home" && (
          <>
            <RecentTrustees 
              ownerId={ownerId} 
              reloadKey={reloadKey} 
              onTrusteeUpdated={() => setReloadKey(prev => prev + 1)} 
            />
            <PendingTrustees 
              ownerId={ownerId} 
              reloadKey={reloadKey} 
              onTrusteeUpdated={() => setReloadKey(prev => prev + 1)} 
            />
          </>
        )}

        {view === "individual" && <div>Individual Trustees view coming soon.</div>}
        {view === "external" && <div>External Trustees view coming soon.</div>}
        {view === "group" && <div>Group Trustees view coming soon.</div>}

        {/* Trustee Invitation Modal */}
        {showInviteModal && ownerId && (
          <InviteTrusteeModal
            ownerId={ownerId}
            onClose={() => setShowInviteModal(false)}
            onSuccess={() => {
              setReloadKey(prev => prev + 1); // Refresh lists
              setShowInviteModal(false);
            }}
          />
        )}
      </div>

      <ProfileBar
        type="trustees"
        ownerName={user?.name || "Your"}
        view={view}
        setView={setView}
        onNewItem={() => setShowInviteModal(true)}
      />
    </div>
  );
};

export default Trustees;