import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../icons/icons";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";

const Header = ({ searchPlaceholder, onSearch }) => {
  const { user } = useAuth();
  const location = useLocation();
  
  const getPageTitle = () => {
    const path = location.pathname.substring(1);
    if (!path) return "Dashboard";
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-lightGray w-full">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Page title */}
        <h1 className="text-2xl font-bold text-charcoal min-w-[200px]">
          {getPageTitle()}
        </h1>
        
        {/* Search bar - takes remaining space */}
        <div className="flex-1 mx-4 max-w-2xl">
          <div className="relative">
            <input
              type="text"
              placeholder={searchPlaceholder}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-lightGray rounded-lg focus:outline-none focus:ring-2 focus:ring-brandRose focus:border-transparent"
            />
            <FontAwesomeIcon 
              icon={icons.search} 
              className="absolute left-3 top-3 text-gray-400"
            />
          </div>
        </div>
        
        {/* Right side controls */}
        <div className="flex items-center gap-4 min-w-[200px] justify-end">
          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:text-brandRose transition-colors">
            <FontAwesomeIcon icon={icons.bell} size="lg" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          {/* Divider - now between notification and avatar */}
          <div className="h-8 w-px bg-lightGray"></div>
          
          {/* Avatar */}
          <div className="flex items-center gap-2 pl-2">
            <Link to="/profile" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-brandRose text-white flex items-center justify-center text-lg font-bold shadow">
                {user?.name?.[0] || "U"}
              </div>
              <span className="font-medium text-charcoal hidden md:inline">
                {user?.name || "User"}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;