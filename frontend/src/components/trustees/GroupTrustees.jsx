import PropTypes from "prop-types";

const GroupTrustees = ({ groups, trustees, onCreateGroup, onDeleteGroup }) => {
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

        console.log("Debug: Group", group.name);
        console.log("Debug: Trustee IDs", group.trusteeIds);
        console.log("Debug: Matched Trustees", fullTrustees);

        // Determine intersection of linked items
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

        return (
          <div
            key={group.id}
            className="border border-gray-200 rounded-lg p-6 shadow-sm bg-white"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{group.name}</h3>
                <p className="text-sm text-gray-500">
                  Created on {new Date(group.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => onDeleteGroup(group.id)}
                className="text-red-500 text-sm hover:underline"
              >
                Delete Group
              </button>
            </div>

            {fullTrustees.length > 0 ? (
              <>
                <div className="text-sm text-gray-700 mb-4">
                  <div><strong>Shared Messages:</strong> {sharedMessages?.size || 0}</div>
                  <div><strong>Shared Assets:</strong> {sharedAssets?.size || 0}</div>
                  <div><strong>Shared Credentials:</strong> {sharedCredentials?.size || 0}</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {fullTrustees.map((trustee) => (
                    <div
                      key={trustee.id}
                      className="border border-gray-100 rounded-lg p-4 shadow-sm bg-gray-50"
                    >
                      <div className="font-semibold text-brandRose">
                        {trustee.trusteeName || "Unnamed Trustee"}
                      </div>
                      <div className="text-sm text-gray-600">
                        {trustee.trusteeEmail || "No email provided"}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-sm text-gray-500 italic">
                No trustees found for this group.
              </div>
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
};

export default GroupTrustees;
