import { useEffect, useState } from "react";
import axios from "axios";
import Table from "../shared/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../icons/icons";
import TrusteeEditModal from "./TrusteeEditModal";
import TrusteeViewModal from "./TrusteeViewModal";

const PendingTrustees = ({ ownerId, reloadKey, onTrusteeUpdated, searchQuery }) => {
  const [trustees, setTrustees] = useState([]);
  const [filteredTrustees, setFilteredTrustees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingTrustee, setViewingTrustee] = useState(null);
  const [editingTrustee, setEditingTrustee] = useState(null);

  useEffect(() => {
    if (!ownerId) return;
    setLoading(true);
    axios
      .get(`/api/trustees/${ownerId}`)
      .then((res) => {
        const pending = res.data.filter((t) => t.status === "PENDING");
        setTrustees(pending);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [ownerId, reloadKey]);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredTrustees(trustees);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = trustees.filter(trustee => 
      trustee.trusteeName?.toLowerCase().includes(query) ||
      trustee.trusteeEmail?.toLowerCase().includes(query)
    );
    setFilteredTrustees(filtered);
  }, [searchQuery, trustees]);

  const renderRow = (trustee) => (
    <tr key={trustee.trusteeId} className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {trustee.trusteeName || "—"}
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">
        {trustee.trusteeEmail || "—"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {trustee.invitedAt ? new Date(trustee.invitedAt).toLocaleDateString() : "—"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium">
        <button 
          onClick={() => setViewingTrustee(trustee)} 
          className="text-brandRose hover:text-brandRose-dark cursor-pointer"
          title="View trustee"
        >
          <FontAwesomeIcon icon={icons.eye} />
        </button>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium">
        <button 
          onClick={() => setEditingTrustee(trustee)} 
          className="text-brandRose hover:text-brandRose-dark cursor-pointer"
          title="Edit trustee"
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
          Pending Trustees
          {searchQuery && (
            <span className="ml-2 text-sm font-normal text-gray-500">
              (Showing {filteredTrustees.length} results)
            </span>
          )}
        </h2>
        {!loading && filteredTrustees.length > 0 && (
          <span className="text-sm text-gray-500 mt-1 sm:mt-0">
            {filteredTrustees.length} trustee{filteredTrustees.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brandRose"></div>
        </div>
      ) : (
        <Table 
          columns={["Name", "Email", "Invited On", "", ""]} 
          data={filteredTrustees} 
          renderRow={renderRow} 
          pageSize={5}
          emptyMessage={
            searchQuery 
              ? `No pending trustees match "${searchQuery}"`
              : "No pending trustees found"
          }
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
          onTrusteeUpdated={onTrusteeUpdated}
        />
      )}
    </div>
  );
};

export default PendingTrustees;