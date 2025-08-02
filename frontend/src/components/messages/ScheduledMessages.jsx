import { useEffect, useState } from "react";
import axios from "axios";
import Table from "../shared/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../icons/icons";
import MessageViewModal from "./MessageViewModal";
import MessageEditModal from "./MessageEditModal";

const ScheduledMessages = ({ 
  ownerId, 
  searchQuery, 
  newMessage, 
  refreshTrigger, 
  onRefresh, 
  onDeleteMessage,
  // These props come from parent component
  viewingMessage,
  setViewingMessage,
  editingMessage,
  setEditingMessage
}) => {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch messages
  useEffect(() => {
    if (!ownerId) return;
    
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/messages/${ownerId}`);
        const scheduled = response.data
          .filter(msg => msg.deliveryStatus === "QUEUED")
          .sort((a, b) => {
            if (!a.scheduledDelivery) return 1;
            if (!b.scheduledDelivery) return -1;
            return new Date(a.scheduledDelivery) - new Date(b.scheduledDelivery);
          });
        setMessages(scheduled);
      } catch (err) {
        console.error("Failed to fetch scheduled messages:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [ownerId, refreshTrigger]);

  // Handle new messages
  useEffect(() => {
    if (newMessage && newMessage.deliveryStatus === "QUEUED") {
      setMessages(prev => [newMessage, ...prev]);
    }
  }, [newMessage]);

  // Apply search filtering
  useEffect(() => {
    if (!searchQuery) {
      setFilteredMessages(messages);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = messages.filter(msg => 
      (msg.subject?.toLowerCase().includes(query)) ||
      (msg.body?.toLowerCase().includes(query))
    );
    setFilteredMessages(filtered);
  }, [searchQuery, messages]);

  const renderRow = (msg) => (
    <tr key={msg.id} className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {msg.subject || <span className="text-gray-400">Untitled</span>}
      </td>
      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
        <div className="line-clamp-2">
          {msg.body || <span className="text-gray-400">—</span>}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {msg.trusteeNames?.join(", ") || <span className="text-gray-400">Unassigned</span>}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {msg.scheduledDelivery ? 
          new Date(msg.scheduledDelivery).toLocaleDateString() : 
          <span className="text-gray-400">Not scheduled</span>}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium">
        <button
          onClick={() => setViewingMessage(msg)}
          className="text-brandRose hover:text-brandRose-dark cursor-pointer"
          title="View message"
        >
          <FontAwesomeIcon icon={icons.eye} />
        </button>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium">
        <button
          onClick={() => setEditingMessage(msg)}
          className="text-brandRose hover:text-brandRose-dark cursor-pointer"
          title="Edit message"
        >
          <FontAwesomeIcon icon={icons.pen} />
        </button>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium">
        <button
          onClick={() => onDeleteMessage(msg)}
          className="text-red-500 hover:text-red-700 cursor-pointer"
          title="Delete message"
        >
          <FontAwesomeIcon icon={icons.trash} />
        </button>
      </td>
    </tr>
  );

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Scheduled Messages
          {searchQuery && (
            <span className="ml-2 text-sm font-normal text-gray-500">
              (Showing {filteredMessages.length} results)
            </span>
          )}
        </h2>
        {!loading && filteredMessages.length > 0 && (
          <span className="text-sm text-gray-500 mt-1 sm:mt-0">
            {filteredMessages.length} message{filteredMessages.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brandRose"></div>
        </div>
      ) : (
        <Table
          columns={["Subject", "Preview", "Trustees", "Scheduled Date", "", "", ""]}
          data={filteredMessages}
          renderRow={renderRow}
          pageSize={5}
          emptyMessage={
            searchQuery 
              ? `No scheduled messages match "${searchQuery}"`
              : "No scheduled messages found"
          }
        />
      )}

      {/* Modals - now using parent-controlled state */}
      {viewingMessage && (
        <MessageViewModal
          message={viewingMessage}
          onClose={() => setViewingMessage(null)}
          onDelete={onDeleteMessage}
        />
      )}

      {editingMessage && (
        <MessageEditModal
          message={editingMessage}
          ownerId={ownerId}
          onClose={() => setEditingMessage(null)}
          onSave={() => {
            if (onRefresh) onRefresh();
            setEditingMessage(null);
          }}
          onDelete={onDeleteMessage}
        />
      )}
    </div>
  );
};

export default ScheduledMessages;