import { useState, useEffect } from "react";
import axios from "axios";
import Table from "../shared/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../icons/icons";
import MessageViewModal from "./MessageViewModal";
import MessageEditModal from "./MessageEditModal";

const RecentMessages = ({ ownerId, searchQuery, newMessage }) => {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingMessage, setViewingMessage] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);

  // Fetch and sort messages by lastAccessedAt
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/messages/${ownerId}/recent`);
      setMessages(response.data);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ownerId) fetchMessages();
  }, [ownerId]);

  // Handle new messages from parent
  useEffect(() => {
    if (newMessage) {
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
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
          msg.deliveryStatus === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
          msg.deliveryStatus === 'QUEUED' ? 'bg-green-100 text-green-800' :
          msg.deliveryStatus === 'SENT' ? 'bg-blue-100 text-blue-800' :
          msg.deliveryStatus === 'FAILED' ? 'bg-red-100 text-red-800' :
          'bg-purple-100 text-purple-800'
        }`}>
          {msg.deliveryStatus}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(msg.lastAccessedAt).toLocaleString()}
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
    </tr>
  );

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Recent Messages
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
          columns={["Subject", "Preview", "Status", "Last Accessed", "", ""]}
          data={filteredMessages}
          renderRow={renderRow}
          pageSize={5}
          emptyMessage={
            searchQuery 
              ? `No messages found matching "${searchQuery}"`
              : "No recent messages found"
          }
        />
      )}

      {/* Modals */}
      {viewingMessage && (
        <MessageViewModal
          message={viewingMessage}
          onClose={() => setViewingMessage(null)}
        />
      )}

      {editingMessage && (
        <MessageEditModal
          message={editingMessage}
          ownerId={ownerId}
          onClose={() => setEditingMessage(null)}
          onSave={() => {
            fetchMessages(); // Refresh the list after edit
            setEditingMessage(null);
          }}
        />
      )}
    </div>
  );
};

export default RecentMessages;