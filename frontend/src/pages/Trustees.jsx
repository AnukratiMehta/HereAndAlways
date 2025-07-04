import { useState } from "react";
import Sidebar from "../components/shared/Sidebar";
import ProfileBar from "../components/shared/ProfileBar"; // you will tweak this for trustees
import RecentTrustees from "../components/trustees/RecentTrustees";
// import PendingInvites from "../components/trustees/PendingInvites";

const Trustees = () => {
  const [view, setView] = useState("home");

    const ownerId = "1d28bf25-fce1-4e4f-9309-b3471db1d88b";

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Trustees</h1>
        </div>

        {view === "home" && (
          <>
<RecentTrustees ownerId={ownerId} />
            {/* <PendingInvites /> */}
          </>
        )}

        {view === "individual" && (
          <div>Individual Trustees view coming soon.</div>
        )}
        {view === "external" && (
          <div>External Trustees view coming soon.</div>
        )}
        {view === "group" && (
          <div>Group Trustees view coming soon.</div>
        )}
      </div>
      <ProfileBar
  type="trustees"
  ownerName="John Doe"
  view={view}
  setView={setView}
  onNewItem={() => setShowInviteModal(true)}
/>

    </div>
  );
};

export default Trustees;
