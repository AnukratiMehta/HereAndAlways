import { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../icons/icons";
import Button from "../shared/Button";
import { useAuth } from "../../contexts/AuthContext";

const CreateGroupModal = ({ onCreate, onClose }) => {
  const { user } = useAuth();
  const [groupName, setGroupName] = useState("");
  const [selectedTrustees, setSelectedTrustees] = useState([]);
  const [trustees, setTrustees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    
    const fetchTrustees = async () => {
      try {
        const response = await axios.get(`/api/trustees/${user.id}`);
        setTrustees(response.data);
      } catch (error) {
        console.error("Failed to fetch trustees:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrustees();
  }, [user?.id]);

  const trusteeOptions = trustees.map(trustee => ({
    value: trustee.trusteeId,  
    label: trustee.trusteeName || trustee.trusteeEmail || "Unnamed",
    trustee 
  }));

  const handleSubmit = () => {
    if (!groupName.trim() || selectedTrustees.length === 0) return;
    
    const selectedTrusteeObjects = selectedTrustees.map(option => 
      trustees.find(t => t.trusteeId === option.value)
    );
    
    onCreate(groupName, selectedTrusteeObjects);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded shadow-lg w-full max-w-xl p-6 relative border border-lightGray">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-brandRose hover:text-brandRose-dark text-2xl"
        >
          &times;
        </button>
        
        <h2 className="text-xl font-bold mb-4">Create Trustee Group</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700">Group Name *</label>
            <input
              type="text"
              className="border rounded w-full p-2"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Family, Friends, etc."
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1">Trustees *</label>
            <Select
              isMulti
              options={trusteeOptions}
              value={selectedTrustees}
              onChange={setSelectedTrustees}
              placeholder={loading ? "Loading trustees..." : "Select trustees..."}
              className="basic-multi-select"
              classNamePrefix="select"
              isLoading={loading}
              noOptionsMessage={() => "No trustees available"}
              getOptionValue={(option) => option.value}
              getOptionLabel={(option) => option.label}
              styles={{
                control: (base) => ({
                  ...base,
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  padding: '0.25rem',
                  minHeight: '42px'
                }),
                menu: (base) => ({
                  ...base,
                  zIndex: 9999
                })
              }}
            />
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              color="primary"
              disabled={!groupName.trim() || selectedTrustees.length === 0}
            >
              <FontAwesomeIcon icon={icons.save} className="mr-2" />
              Create Group
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;