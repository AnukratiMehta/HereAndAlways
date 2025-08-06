import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../icons/icons";
import GroupEditModal from "./GroupEditModal";
import { useState } from "react";

const GroupTrustees = ({ 
  groups, 
  trustees, 
  onCreateGroup, 
  onDeleteGroup, 
  onTrusteeClick, 
  onEditGroup,
  onTrusteeUpdate,
  setReloadKey // Added this prop
}) => {
  const [editingGroup, setEditingGroup] = useState(null);
    const [viewingTrustee, setViewingTrustee] = useState(null); // Add this state


  if (!groups || groups.length === 0) {
    return (
      <div className="text-center text-gray-500 italic py-12">
        No trustee groups created yet
        <div className="mt-4">
          <button
            onClick={onCreateGroup}
            className="bg-brandRose text-white px-4 py-2 rounded shadow hover:bg-brandRose-dark"
          >
            Create Group
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Trustee Groups</h2>
        <button
          onClick={onCreateGroup}
          className="bg-brandRose text-white px-4 py-2 rounded shadow hover:bg-brandRose-dark"
        >
          Create New Group
        </button>
      </div>

      {groups.map((group) => {
        const fullTrustees = group.trusteeIds
          .map((id) => trustees.find((t) => t.id === id))
          .filter(Boolean);

        const sharedMessages = fullTrustees.reduce((acc, trustee) => {
          const ids = trustee.messages?.map((m) => m.id) || [];
          return acc === null ? new Set(ids) : new Set(ids.filter((id) => acc.has(id)));
        }, null);

        const sharedAssets = fullTrustees.reduce((acc, trustee) => {
          const ids = trustee.assets?.map((a) => a.id) || [];
          return acc === null ? new Set(ids) : new Set(ids.filter((id) => acc.has(id)));
        }, null);

        const sharedCredentials = fullTrustees.reduce((acc, trustee) => {
          const ids = trustee.credentials?.map((c) => c.id) || [];
          return acc === null ? new Set(ids) : new Set(ids.filter((id) => acc.has(id)));
        }, null);

        const sharedMessageTitles = fullTrustees[0]?.messages?.filter(m => sharedMessages?.has(m.id)).map(m => m.subject) || [];
        const sharedAssetNames = fullTrustees[0]?.assets?.filter(a => sharedAssets?.has(a.id)).map(a => a.name) || [];
        const sharedCredentialTitles = fullTrustees[0]?.credentials?.filter(c => sharedCredentials?.has(c.id)).map(c => c.title) || [];

        return (
          <div
            key={group.id}
            className="relative border border-gray-200 rounded-lg p-6 shadow-sm bg-white"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <FontAwesomeIcon icon={icons.users} className="text-brandRose" />
                  {group.name}
                </h3>
                <p className="text-sm text-gray-500">
                  Created on {new Date(group.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => onDeleteGroup(group.id)}
                className="text-red-500 text-sm hover:underline flex items-center gap-1"
              >
                <FontAwesomeIcon icon={icons.trash} className="text-sm" /> Delete Group
              </button>
            </div>

            {fullTrustees.length > 0 ? (
              <>
                <div className="text-sm text-gray-700 mb-4 space-y-2">
                  <div>
                    <strong>Shared Messages:</strong>
                    <ul className="list-disc ml-5 text-gray-600">
                      {sharedMessageTitles.length > 0 ? sharedMessageTitles.map((title, idx) => (
                        <li key={idx}>{title}</li>
                      )) : <li className="italic">None</li>}
                    </ul>
                  </div>
                  <div>
                    <strong>Shared Assets:</strong>
                    <ul className="list-disc ml-5 text-gray-600">
                      {sharedAssetNames.length > 0 ? sharedAssetNames.map((name, idx) => (
                        <li key={idx}>{name}</li>
                      )) : <li className="italic">None</li>}
                    </ul>
                  </div>
                  <div>
                    <strong>Shared Credentials:</strong>
                    <ul className="list-disc ml-5 text-gray-600">
                      {sharedCredentialTitles.length > 0 ? sharedCredentialTitles.map((title, idx) => (
                        <li key={idx}>{title}</li>
                      )) : <li className="italic">None</li>}
                    </ul>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {fullTrustees.map((trustee) => (
                    <button
                      key={trustee.id}
                      onClick={() => onTrusteeClick?.(trustee)}
                      className="border border-gray-100 rounded-lg p-4 shadow-sm bg-gray-50 cursor-pointer hover:shadow-md text-left"
                    >
                      <div className="font-semibold text-brandRose">
                        {trustee.trusteeName || "Unnamed Trustee"}
                      </div>
                      <div className="text-sm text-gray-600">
                        {trustee.trusteeEmail || "No email provided"}
                      </div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-sm text-gray-500 italic">
                No trustees found for this group.
              </div>
            )}

            <button
              onClick={() => setEditingGroup(group)}
              className="absolute bottom-4 right-4 text-brandRose hover:text-white hover:bg-brandRose bg-white border border-brandRose rounded-full p-2 shadow-md transition-colors"
              title="Edit Group"
            >
              <FontAwesomeIcon icon={icons.pen} className="w-4 h-4" />
            </button>

{editingGroup && (
  <GroupEditModal
    group={editingGroup}
    trustees={trustees}
    onClose={() => setEditingGroup(null)}
    onSave={({ updatedGroup, updatedTrustees }) => {
      // Update the group
      onEditGroup(updatedGroup);
      
      // Update the trustees if onTrusteeUpdate is provided
      if (onTrusteeUpdate && updatedTrustees) {
        onTrusteeUpdate(updatedTrustees);
      }
      
      setEditingGroup(null);
    }}
  />
)}
          </div>
        );
      })}
    </div>
  );
};

GroupTrustees.propTypes = {
  groups: PropTypes.array.isRequired,
  trustees: PropTypes.array.isRequired,
  onCreateGroup: PropTypes.func.isRequired,
  onDeleteGroup: PropTypes.func.isRequired,
  onTrusteeClick: PropTypes.func.isRequired,
  onEditGroup: PropTypes.func,
  onTrusteeUpdate: PropTypes.func, // Add this
  setReloadKey: PropTypes.func.isRequired
};

export default GroupTrustees;