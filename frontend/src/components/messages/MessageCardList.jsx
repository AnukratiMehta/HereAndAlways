import { useEffect, useState } from "react";
import axios from "axios";
import MessageCard from "./MessageCard";
import MessageEditModal from "./MessageEditModal";

const MessageCardList = ({ ownerId, filter }) => {
  const [messages, setMessages] = useState([]);
  const [editingMessage, setEditingMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4; // cards per page

  useEffect(() => {
    if (!ownerId) return;
    axios
      .get(`/api/messages/${ownerId}`)
      .then((res) => {
        const filtered = res.data.filter((m) => m.deliveryStatus === filter);
        setMessages(filtered);
      })
      .catch(console.error);
  }, [ownerId, filter]);

  const refreshMessages = () => {
    axios
      .get(`/api/messages/${ownerId}`)
      .then((res) => {
        const filtered = res.data.filter((m) => m.deliveryStatus === filter);
        setMessages(filtered);
      })
      .catch(console.error);
  };

  const paginatedMessages = messages.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(messages.length / pageSize);

  return (
    <div className="space-y-4">
      {paginatedMessages.map((msg) => (
        <MessageCard
          key={msg.id}
          message={msg}
          onEdit={() => setEditingMessage(msg)}
        />
      ))}

      {messages.length === 0 && (
        <div className="text-gray-500">No messages found.</div>
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
