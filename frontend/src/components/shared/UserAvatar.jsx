import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../icons/icons";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const UserAvatar = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 focus:outline-none"
      >
        <div className="w-10 h-10 rounded-full bg-brandRose text-white flex items-center justify-center text-lg font-bold shadow">
          {user?.name?.[0] || "U"}
        </div>
        <span className="font-medium text-charcoal hidden md:inline">
          {user?.name || "User"}
        </span>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-lightGray z-20">
          <Link 
            to="/profile" 
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            <FontAwesomeIcon icon={icons.user} className="mr-2" />
            Your Profile
          </Link>
          <Link 
            to="/settings" 
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            <FontAwesomeIcon icon={icons.settings} className="mr-2" />
            Settings
          </Link>
          <div className="border-t border-lightGray"></div>
          <Link 
            to="/logout" 
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            <FontAwesomeIcon icon={icons.logout} className="mr-2" />
            Sign out
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;