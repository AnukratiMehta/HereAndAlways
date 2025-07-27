import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../icons/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import UserAvatar from "../shared/UserAvatar";
import NotificationsDropdown from "../shared/NotificationsDropdown";

const Header = ({ 
  showSearch = true, 
  title, 
  searchPlaceholder, 
  onSearch = () => {} 
}) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const getPageTitle = () => {
    const path = location.pathname.substring(1);
    if (!path) return "Dashboard";
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-lightGray w-full">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Page title - now accepts prop or falls back to path-based title */}
        <h1 className="text-2xl font-bold text-charcoal min-w-[200px]">
          {title || getPageTitle()}
        </h1>
        
        {/* Conditionally rendered search bar */}
        {showSearch && (
          <div className="flex-1 mx-4 max-w-2xl">
            <div className="relative">
              <input
                type="text"
                placeholder={searchPlaceholder || "Search..."}
                onChange={(e) => onSearch(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-lightGray rounded-lg focus:outline-none focus:ring-2 focus:ring-brandRose focus:border-transparent"
              />
              <FontAwesomeIcon 
                icon={icons.search} 
                className="absolute left-3 top-3 text-gray-400"
              />
            </div>
          </div>
        )}

        {/* Right side controls */}
        <div className={`flex items-center gap-4 ${showSearch ? 'min-w-[200px]' : ''} justify-end`}>
          <NotificationsDropdown />
          
          {/* Divider - only shown when notifications are present */}
          <div className="h-8 w-px bg-lightGray"></div>
          
          <UserAvatar />
        </div>
      </div>
    </header>
  );
};

export default Header;