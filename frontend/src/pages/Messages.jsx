import { useState } from "react";
import Sidebar from "../components/shared/Sidebar";
import ProfileBar from "../components/shared/ProfileBar";
import RecentMessages from "../components/messages/RecentMessages";
import ScheduledMessages from "../components/messages/ScheduledMessages";
import MessageCardList from "../components/messages/MessageCardList";
import NewMessage from "../components/messages/NewMessage";

const Messages = () => {
  const [view, setView] = useState("home"); // 'home', 'drafts', 'scheduled', 'starred'
  const [showModal, setShowModal] = useState(false);

  // TODO: Replace with real user ID later
  const ownerId = "1d28bf25-fce1-4e4f-9309-b3471db1d88b";

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8 relative">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Messages</h1>
        </div>

        {view === "home" && (
          <>
            <RecentMessages ownerId={ownerId} />
            <ScheduledMessages ownerId={ownerId} />
          </>
        )}

        {view === "drafts" && (
          <MessageCardList ownerId={ownerId} filter="DRAFT" />
        )}

        {view === "scheduled" && (
          <MessageCardList ownerId={ownerId} filter="QUEUED" />
        )}

        {view === "starred" && (
          <div>Starred messages view coming soon.</div>
        )}

        {/* new message modal */}
        {showModal && (
          <NewMessage
            ownerId={ownerId}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>

      <ProfileBar
        type="messages"
        ownerName="John Doe"
        view={view}
        setView={setView}
        onNewItem={() => setShowModal(true)}
      />
    </div>
  );
};

export default Messages;
