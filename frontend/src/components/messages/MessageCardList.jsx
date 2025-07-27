import { useEffect, useState } from "react";
import axios from "axios";
import MessageCard from "./MessageCard";
import MessageEditModal from "./MessageEditModal";

const MessageCardList = ({ ownerId, filter, searchQuery }) => {
  const [allMessages, setAllMessages] = useState([]);
  const [displayedMessages, setDisplayedMessages] = useState([]);
  const [editingMessage, setEditingMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4; // cards per page

  // Fetch messages based on ownerId and filter
  useEffect(() => {
    if (!ownerId) return;
    
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/api/messages/${ownerId}`);
        const filtered = res.data.filter((m) => m.deliveryStatus === filter);
        setAllMessages(filtered);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };
    
    fetchMessages();
  }, [ownerId, filter]);

  // Apply search filtering whenever searchQuery or allMessages changes
  useEffect(() => {
    if (!searchQuery) {
      setDisplayedMessages(allMessages);
      setCurrentPage(1); // Reset to first page when search is cleared
      return;
    }

    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = allMessages.filter((message) => {
      const matchesSubject = message.subject?.toLowerCase().includes(lowerCaseQuery);
      const matchesBody = message.body?.toLowerCase().includes(lowerCaseQuery);
      return matchesSubject || matchesBody;
    });

    setDisplayedMessages(filtered);
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchQuery, allMessages]);

  const refreshMessages = async () => {
    try {
      const res = await axios.get(`/api/messages/${ownerId}`);
      const filtered = res.data.filter((m) => m.deliveryStatus === filter);
      setAllMessages(filtered);
    } catch (err) {
      console.error("Error refreshing messages:", err);
    }
  };

  // Pagination logic
  const paginatedMessages = displayedMessages.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(displayedMessages.length / pageSize);

  return (
    <div className="space-y-4">
      {/* Search status indicator */}
      {searchQuery && (
        <div className="text-sm text-gray-500 mb-2">
          Showing {displayedMessages.length} {filter.toLowerCase()} messages matching "{searchQuery}"
        </div>
      )}

      {/* Message cards */}
      {paginatedMessages.map((msg) => (
        <MessageCard
          key={msg.id}
          message={msg}
          onEdit={() => setEditingMessage(msg)}
        />
      ))}

      {/* Empty state */}
      {displayedMessages.length === 0 && (
        <div className="text-gray-500">
          {searchQuery
            ? `No ${filter.toLowerCase()} messages match "${searchQuery}"`
            : `No ${filter.toLowerCase()} messages found`}
        </div>
      )}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded text-sm disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-2 py-1 text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Edit modal */}
      {editingMessage && (
        <MessageEditModal
          message={editingMessage}
          ownerId={ownerId}
          onClose={() => setEditingMessage(null)}
          onSave={() => {
            refreshMessages();
            setEditingMessage(null);
          }}
        />
      )}
    </div>
  );
};

export default MessageCardList;