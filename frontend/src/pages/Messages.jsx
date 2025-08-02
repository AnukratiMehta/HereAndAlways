import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "../components/shared/Sidebar";
import ProfileBar from "../components/shared/ProfileBar";
import Header from "../components/shared/Header";
import RecentMessages from "../components/messages/RecentMessages";
import ScheduledMessages from "../components/messages/ScheduledMessages";
import MessageCardList from "../components/messages/MessageCardList";
import NewMessage from "../components/messages/NewMessage";
import ErrorBoundary from "../components/shared/ErrorBoundary";
import axios from "axios";


const Messages = () => {
  const { user } = useAuth();
  const [view, setView] = useState("home");
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [latestMessage, setLatestMessage] = useState(null);

  const ownerId = user?.id;

useEffect(() => {
  if (!ownerId) return;
  
  const fetchMessages = async () => {
    try {
      const response = await axios.get(`/api/messages/${ownerId}`);
      setMessages(response.data);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };
  
  fetchMessages();
}, [ownerId]);

  const handleSearch = (query) => {
    try {
      setSearchQuery(query);
      // No view switching here - we'll let the components handle the filtering
    } catch (err) {
      setError(err);
      console.error("Search error:", err);
    }
  };

  if (error) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="text-red-500">
            Error loading messages: {error.message}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header 
          searchPlaceholder="Search messages by subject or content..." 
          onSearch={handleSearch}
        />
        
        <div className="flex flex-1">
          <div className="flex-1 pt-6 pl-8 pr-8 overflow-y-auto">
            {view === "home" ? (
              <>
                <ErrorBoundary fallback={<div className="mb-8 text-red-500">Error loading recent messages</div>}>
                  <RecentMessages 
                    ownerId={ownerId} 
                    searchQuery={searchQuery} 
          newMessage={latestMessage}

                  />
                </ErrorBoundary>
                <ErrorBoundary fallback={<div className="text-red-500">Error loading scheduled messages</div>}>
                  <ScheduledMessages 
                    ownerId={ownerId} 
                    searchQuery={searchQuery} 
                  />
                </ErrorBoundary>
              </>
            ) : view === "drafts" ? (
              <ErrorBoundary fallback={<div className="text-red-500">Error loading drafts</div>}>
                <MessageCardList 
                  ownerId={ownerId} 
                  filter="DRAFT" 
                  searchQuery={searchQuery}
                />
              </ErrorBoundary>
            ) : view === "scheduled" ? (
              <ErrorBoundary fallback={<div className="text-red-500">Error loading scheduled messages</div>}>
                <MessageCardList 
                  ownerId={ownerId} 
                  filter="QUEUED" 
                  searchQuery={searchQuery}
                />
              </ErrorBoundary>
            ) : view === "starred" ? (
              <ErrorBoundary fallback={<div className="text-red-500">Error loading starred messages</div>}>
                <MessageCardList 
                  ownerId={ownerId} 
                  filter="STARRED" 
                  searchQuery={searchQuery}
                />
              </ErrorBoundary>
            ) : null}
          </div>

          <div className="pt-6">
            <ErrorBoundary fallback={<div className="w-64 p-4 text-red-500">Error loading profile bar</div>}>
              <ProfileBar
                type="messages"
                view={view}
                setView={setView}
                onNewItem={() => setShowModal(true)}
              />
            </ErrorBoundary>
          </div>
        </div>
      </div>

      {showModal && (
  <ErrorBoundary fallback={<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-8 rounded-lg">Error loading message composer</div>
  </div>}>
    <NewMessage
      ownerId={ownerId}
      onClose={() => setShowModal(false)}
      onSave={(newMessage) => {
        setLatestMessage(newMessage);
        setMessages(prev => [newMessage, ...prev]); // Update both states
        setShowModal(false);
      }}
    />
  </ErrorBoundary>
)}
    </div>
  );
};

export default Messages;