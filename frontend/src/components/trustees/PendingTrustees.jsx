import { useEffect, useState } from "react";
import axios from "axios";
import Table from "../shared/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../icons/icons";
import TrusteeViewModal from "./TrusteeViewModal";
import TrusteeEditModal from "./TrusteeEditModal";

const PendingTrustees = ({ ownerId }) => {
  const [trustees, setTrustees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingTrustee, setViewingTrustee] = useState(null);
  const [editingTrustee, setEditingTrustee] = useState(null);

  const fetchPendingTrustees = () => {
    axios
      .get(`/api/trustees/${ownerId}`)
      .then((res) => {
        const pending = res.data.filter((t) => t.status === "PENDING");
        setTrustees(pending);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (ownerId) fetchPendingTrustees();
  }, [ownerId]);

  const renderRow = (trustee) => (
    <tr key={trustee.trusteeId} className="hover:bg-gray-50">
      <td className="py-2 px-4">{trustee.trusteeName || "—"}</td>
      <td className="py-2 px-4">{trustee.trusteeEmail || "—"}</td>
      <td className="py-2 px-4">{trustee.invitedAt ? new Date(trustee.invitedAt).toLocaleDateString() : "—"}</td>
      <td className="py-2 px-4 text-right space-x-2">
        <button
          className="text-brandRose hover:text-brandRose-dark"
          onClick={() => setViewingTrustee(trustee)}
        >
          <FontAwesomeIcon icon={icons.eye} /> View
        </button>
        <button
          className="text-brandRose hover:text-brandRose-dark"
          onClick={() => setEditingTrustee(trustee)}
        >
          <FontAwesomeIcon icon={icons.pen} /> Edit
        </button>
      </td>
    </tr>
  );

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Pending Trustees</h2>
      {loading ? (
        <div>Loading...</div>
      ) : trustees.length === 0 ? (
        <div className="text-gray-500">No pending trustees.</div>
      ) : (
        <Table
          columns={["Name", "Email", "Invited On", ""]}
          data={trustees}
          renderRow={renderRow}
          pageSize={5}
        />
      )}

      {viewingTrustee && (
        <TrusteeViewModal
          trustee={viewingTrustee}
          onClose={() => setViewingTrustee(null)}
        />
      )}

      {editingTrustee && (
        <TrusteeEditModal
          trustee={editingTrustee}
          onClose={() => setEditingTrustee(null)}
          onSave={() => {
            fetchPendingTrustees();
            setEditingTrustee(null);
          }}
        />
      )}
    </div>
  );
};

export default PendingTrustees;
