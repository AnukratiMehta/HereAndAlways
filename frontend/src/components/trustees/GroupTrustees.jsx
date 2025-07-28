import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../icons/icons";
import Button from "../shared/Button";
import { formatDistanceToNow } from "date-fns";
import { getTrusteesInGroup } from "../../utils/trusteeUtils"

const GroupTrustees = ({ groups, trustees, onCreateGroup, onDeleteGroup }) => {
  const [expandedGroup, setExpandedGroup] = useState(null);

  const toggleExpand = (groupId) => {
    setExpandedGroup(expandedGroup === groupId ? null : groupId);
  };

  if (groups.length === 0) {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Trustee Groups</h2>
          <Button onClick={onCreateGroup} color="primary">
            <FontAwesomeIcon icon={icons.plus} className="mr-2" />
            Create Group
          </Button>
        </div>
        <div className="text-center py-8 text-gray-500">
          No trustee groups created yet
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Trustee Groups</h2>
        <Button onClick={onCreateGroup} color="primary">
          <FontAwesomeIcon icon={icons.plus} className="mr-2" />
          Create Group
        </Button>
      </div>

      <div className="space-y-4">
        {groups.map(group => {
          const groupTrustees = getTrusteesInGroup(group.id, groups, trustees);
          return (
            <div 
              key={group.id}
              className="bg-white rounded-lg border border-lightGray shadow-sm overflow-hidden"
            >
              <div 
                className="p-4 border-b border-lightGray cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleExpand(group.id)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-md font-semibold text-charcoal">
                      {group.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Created {formatDistanceToNow(new Date(group.createdAt))} ago • 
                      {groupTrustees.length} members
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteGroup(group.id);
                      }}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Delete Group"
                    >
                      <FontAwesomeIcon icon={icons.trash} />
                    </button>
                    <FontAwesomeIcon 
                      icon={expandedGroup === group.id ? icons.chevronUp : icons.chevronDown} 
                      className="text-gray-400"
                    />
                  </div>
                </div>
              </div>

              {expandedGroup === group.id && (
                <div className="p-4 space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                      <FontAwesomeIcon icon={icons.users} className="mr-2 text-brandRose" />
                      Group Members
                    </h4>
                    <div className="space-y-2 pl-6">
                      {groupTrustees.map(trustee => (
                        <div key={trustee.id} className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs mr-2">
                            {trustee.trusteeName?.[0]?.toUpperCase() || "T"}
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {trustee.trusteeName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {trustee.trusteeEmail}
                            </p>
                            <p className="text-xs text-gray-400">
                              Status: {trustee.status}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                      <FontAwesomeIcon icon={icons.assets} className="mr-2 text-brandRose" />
                      Linked Assets
                    </h4>
                    <div className="pl-6">
                      {groupTrustees.some(t => t.assets?.length > 0) ? (
                        <ul className="list-disc pl-5 space-y-1">
                          {groupTrustees.flatMap(t => 
                            t.assets?.map(asset => ({
                              ...asset,
                              trusteeName: t.trusteeName
                            })) || []
                          ).map((asset, index) => (
                            <li key={index} className="text-sm">
                              {asset.name} (from {asset.trusteeName || "unknown"})
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500">No assets linked to group members</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                      <FontAwesomeIcon icon={icons.messages} className="mr-2 text-brandRose" />
                      Linked Messages
                    </h4>
                    <div className="pl-6">
                      {groupTrustees.some(t => t.messages?.length > 0) ? (
                        <ul className="list-disc pl-5 space-y-1">
                          {groupTrustees.flatMap(t => 
                            t.messages?.map(message => ({
                              ...message,
                              trusteeName: t.trusteeName
                            })) || []
                          ).map((message, index) => (
                            <li key={index} className="text-sm">
                              {message.subject} (from {message.trusteeName || "unknown"})
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500">No messages linked to group members</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GroupTrustees;