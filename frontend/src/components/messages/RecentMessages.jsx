import { useEffect, useState } from "react";
import axios from "axios";
import Table from "../shared/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../icons/icons";

const RecentMessages = ({ ownerId }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <td className="py-2 px-4">{msg.deliveryStatus}</td>
      <td className="py-2 px-4">
        {msg.scheduledDelivery ? new Date(msg.scheduledDelivery).toLocaleString() : "—"}
      </td>
      <td className="py-2 px-4">{new Date(msg.createdAt).toLocaleString()}</td>
      <td className="py-2 px-4 text-right">
        <button className="text-brandRose hover:text-brandRose-dark">
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
  columns={["Subject", "Status", "Scheduled For", "Created At", ""]}
  data={messages}
  renderRow={renderRow}
  pageSize={10}
/>

      )}
    </div>
  );
};

export default RecentMessages;
