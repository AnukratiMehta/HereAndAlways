import { useEffect, useState } from "react";
import axios from "axios";
import Table from "../shared/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../icons/icons";
import MessageViewModal from "./MessageViewModal";
import MessageEditModal from "./MessageEditModal";

const RecentMessages = ({ ownerId }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingMessage, setViewingMessage] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);

  useEffect(() => {
    if (!ownerId) return;
    axios
      .get(`/api/messages/${ownerId}`)
      .then((res) => {
        setMessages(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [ownerId]);

  const renderRow = (msg) => (
    <tr key={msg.id} className="hover:bg-gray-50">
      <td className="py-2 px-4">{msg.subject || "Untitled"}</td>
      <td className="py-2 px-4 truncate max-w-xs">
        {msg.body ? msg.body.slice(0, 50) + "..." : "—"}
      </td>
      <td className="py-2 px-4">{msg.deliveryStatus}</td>
      <td className="py-2 px-4">{new Date(msg.createdAt).toLocaleDateString()}</td>
      <td className="py-2 px-4">
        <button
          className="text-brandRose hover:text-brandRose-dark cursor-pointer"
          onClick={() => setViewingMessage(msg)}
        >
          <FontAwesomeIcon icon={icons.eye} /> View
        </button>
      </td>
      <td className="py-2 px-4">
        <button
          className="text-brandRose hover:text-brandRose-dark cursor-pointer"
          onClick={() => setEditingMessage(msg)}
        >
          <FontAwesomeIcon icon={icons.pen} /> Edit
        </button>
      </td>
    </tr>
  );

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Recent Messages</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Table
          columns={["Subject", "Body", "Status", "Created On", "", ""]}
          data={messages}
          renderRow={renderRow}
          pageSize={5}
        />
      )}

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
            axios
              .get(`/api/messages/${ownerId}`)
              .then((res) => setMessages(res.data))
              .catch(console.error)
              .finally(() => setEditingMessage(null));
          }}
        />
      )}
    </div>
  );
};

export default RecentMessages;
