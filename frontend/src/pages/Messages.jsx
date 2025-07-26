import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "../components/shared/Sidebar";
import ProfileBar from "../components/shared/ProfileBar";
import RecentMessages from "../components/messages/RecentMessages";
import ScheduledMessages from "../components/messages/ScheduledMessages";
import MessageCardList from "../components/messages/MessageCardList";
import NewMessage from "../components/messages/NewMessage";

const Messages = () => {
  const { user } = useAuth();
  const [view, setView] = useState("home");
  const [showModal, setShowModal] = useState(false);

  const ownerId = user?.id;

  // Debug logs
  useEffect(() => {
    console.log("=== Debug: useAuth().user ===");
    console.log(user);
    console.log("=== Debug: localStorage.getItem('user') ===");
    console.log(localStorage.getItem("user"));
  }, [user]);

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

        {showModal && (
          <NewMessage
            ownerId={ownerId}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>

      <ProfileBar
        type="messages"
        view={view}
        setView={setView}
        onNewItem={() => setShowModal(true)}
      />
    </div>
  );
};

export default Messages;
