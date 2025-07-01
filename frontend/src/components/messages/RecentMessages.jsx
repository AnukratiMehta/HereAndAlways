import { useEffect, useState } from "react";
import axios from "axios";
import Table from "../shared/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../icons/icons";
import MessageViewModal from "./MessageViewModal";

const RecentMessages = ({ ownerId }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

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
      <td className="py-2 px-4">
        {msg.body ? (msg.body.length > 30 ? msg.body.slice(0, 30) + "..." : msg.body) : "—"}
      </td>
      <td className="py-2 px-4">{msg.deliveryStatus}</td>
      <td className="py-2 px-4">{new Date(msg.createdAt).toLocaleDateString()}</td>
      <td className="py-2 px-4 text-right">
        <button
          className="text-brandRose hover:text-brandRose-dark"
          onClick={() => setSelectedMessage(msg)}
        >
          <FontAwesomeIcon icon={icons.eye} /> View
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
          columns={["Subject", "Body", "Status", "Created On", ""]}
          data={messages}
          renderRow={renderRow}
          pageSize={5}
        />
      )}

      {selectedMessage && (
        <MessageViewModal
          message={selectedMessage}
          onClose={() => setSelectedMessage(null)}
        />
      )}
    </div>
  );
};

export default RecentMessages;
