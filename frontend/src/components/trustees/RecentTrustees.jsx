import { useEffect, useState } from "react";
import axios from "axios";
import Table from "../shared/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../icons/icons";
import TrusteeViewModal from "./TrusteeViewModal";
import TrusteeEditModal from "./TrusteeEditModal";

const RecentTrustees = ({ ownerId, reloadKey, onTrusteeUpdated }) => {
  const [trustees, setTrustees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingTrustee, setViewingTrustee] = useState(null);
  const [editingTrustee, setEditingTrustee] = useState(null);

  useEffect(() => {
    if (!ownerId) return;
    setLoading(true);
    axios
      .get(`/api/trustees/recent/${ownerId}`)
      .then((res) => setTrustees(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [ownerId, reloadKey]);

  const renderRow = (trustee) => (
    <tr key={trustee.trusteeId} className="hover:bg-gray-50">
      <td className="py-2 px-4">{trustee.trusteeName || "—"}</td>
      <td className="py-2 px-4">{trustee.trusteeEmail || "—"}</td>
      <td className="py-2 px-4 capitalize">{trustee.status || "—"}</td>
      <td className="py-2 px-4">
        <button onClick={() => setViewingTrustee(trustee)} className="text-brandRose hover:text-brandRose-dark">
          <FontAwesomeIcon icon={icons.eye} /> View
        </button>
</td>
        <td className="py-2 px-4">
        <button onClick={() => setEditingTrustee(trustee)} className="text-brandRose hover:text-brandRose-dark">
          <FontAwesomeIcon icon={icons.pen} /> Edit
        </button>
      </td>
    </tr>
  );

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Recent Trustees</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Table columns={["Name", "Email", "Status", "", ""]} data={trustees} renderRow={renderRow} pageSize={5} />
      )}

      {viewingTrustee && <TrusteeViewModal trustee={viewingTrustee} onClose={() => setViewingTrustee(null)} />}

      {editingTrustee && (
        <TrusteeEditModal
          trustee={editingTrustee}
          onClose={() => setEditingTrustee(null)}
          onTrusteeUpdated={onTrusteeUpdated}
        />
      )}
    </div>
  );
};

export default RecentTrustees;
