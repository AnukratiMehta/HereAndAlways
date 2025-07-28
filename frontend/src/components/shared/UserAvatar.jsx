import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../icons/icons";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import ErrorBoundary from "../shared/ErrorBoundary";

const UserAvatar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate("/login");
    setIsOpen(false);
  };

  return (
    <ErrorBoundary fallback={
      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-charcoal">
        Error
      </div>
    }>
      <div className="relative">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 focus:outline-none group cursor-pointer"
          aria-label="User menu"
        >
          <div className="w-10 h-10 rounded-full bg-brandRose text-white flex items-center justify-center text-lg font-bold shadow-sm group-hover:bg-brandRose-dark transition-colors">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <span className="font-medium text-charcoal hidden md:inline group-hover:text-brandRose transition-colors">
            {user?.name || "User"}
          </span>
        </button>
        
        {isOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-lightGray z-30 overflow-hidden">
            <div className="p-3 border-b border-lightGray bg-brandRose-light">
              <p className="text-xs text-brandRose-dark">Logged in as</p>
              <p className="font-medium text-charcoal truncate">
                {user?.name || user?.email || "User"}
              </p>
            </div>
            
            <Link 
              to="/profile" 
              className="flex items-center px-4 py-3 text-sm text-charcoal hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <FontAwesomeIcon 
                icon={icons.user} 
                className="w-4 h-4 mr-3 text-brandRose" 
              />
              Your Profile
            </Link>
            
            <Link 
              to="/settings" 
              className="flex items-center px-4 py-3 text-sm text-charcoal hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <FontAwesomeIcon 
                icon={icons.settings} 
                className="w-4 h-4 mr-3 text-brandRose" 
              />
              Account Settings
            </Link>
            
            <div className="border-t border-lightGray"></div>
            
            <button
              onClick={handleSignOut}
              className="w-full flex items-center px-4 py-3 text-sm text-charcoal hover:bg-gray-50 transition-colors text-left"
            >
              <FontAwesomeIcon 
                icon={icons.logout} 
                className="w-4 h-4 mr-3 text-brandRose" 
              />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default UserAvatar;