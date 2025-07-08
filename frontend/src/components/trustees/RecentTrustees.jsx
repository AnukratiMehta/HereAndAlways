import { useEffect, useState } from "react";
import axios from "axios";
import Table from "../shared/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../icons/icons";
import TrusteeViewModal from "./TrusteeViewModal";
import TrusteeEditModal from "./TrusteeEditModal";

const RecentTrustees = ({ ownerId }) => {
  const [trustees, setTrustees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingTrustee, setViewingTrustee] = useState(null);
  const [editingTrustee, setEditingTrustee] = useState(null);

  useEffect(() => {
    if (!ownerId) return;
    axios
      .get(`/api/trustees/recent/${ownerId}`)
      .then((res) => {
        setTrustees(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [ownerId]);

  const renderRow = (trustee) => (
    <tr key={trustee.trusteeId} className="hover:bg-gray-50">
      <td className="py-2 px-4">{trustee.trusteeName || "—"}</td>
      <td className="py-2 px-4">{trustee.trusteeEmail || "—"}</td>
      <td className="py-2 px-4 capitalize">{trustee.status || "—"}</td>
      <td className="py-2 px-4 text-right space-x-2">
        <button
          className="text-brandRose hover:text-brandRose-dark cursor-pointer"
          onClick={() => setViewingTrustee({ ...trustee })}
        >
          <FontAwesomeIcon icon={icons.eye} /> View
        </button>
        <button
          className="text-brandRose hover:text-brandRose-dark cursor-pointer"
          onClick={() => setEditingTrustee({ ...trustee })}
        >
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
        <Table
          columns={["Name", "Email", "Status", ""]}
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
            axios
              .get(`/api/trustees/recent/${ownerId}`)
              .then((res) => setTrustees(res.data))
              .catch(console.error)
              .finally(() => setEditingTrustee(null));
          }}
        />
      )}
    </div>
  );
};

export default RecentTrustees;
