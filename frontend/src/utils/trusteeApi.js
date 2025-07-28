import axios from "axios";

export const fetchTrusteeById = async (trusteeId) => {
  try {
    const response = await axios.get(`/api/trustees/details/${trusteeId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching trustee:", error);
    return null;
  }
};

export const fetchMultipleTrustees = async (trusteeIds) => {
  try {
    const requests = trusteeIds.map(id => fetchTrusteeById(id));
    const results = await Promise.all(requests);
    return results.filter(trustee => trustee !== null);
  } catch (error) {
    console.error("Error fetching trustees:", error);
    return [];
  }
};