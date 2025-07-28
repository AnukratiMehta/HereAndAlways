export const getTrusteesInGroup = (groupId, groups, allTrustees) => {
  const group = groups.find(g => g.id === groupId);
  if (!group) return [];
  return allTrustees.filter(t => group.trusteeIds.includes(t.id));
};

export const isTrusteeInGroup = (trusteeId, groupId, groups) => {
  const group = groups.find(g => g.id === groupId);
  return group ? group.trusteeIds.includes(trusteeId) : false;
};