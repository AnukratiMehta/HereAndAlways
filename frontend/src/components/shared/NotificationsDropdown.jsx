import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../icons/icons";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import ErrorBoundary from "../shared/ErrorBoundary";

const NotificationsDropdown = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unseenCount, setUnseenCount] = useState(0);
  const [lastViewed, setLastViewed] = useState(() => {
    return localStorage.getItem('notificationsLastViewed') || null;
  });
  const [currentViewTime, setCurrentViewTime] = useState(null);

  useEffect(() => {
    if (user?.id) {
      fetchRecentItems();
    }
  }, [user?.id]);

  useEffect(() => {
    if (recentItems.length > 0) {
      const newUnseen = recentItems.filter(item => 
        !lastViewed || new Date(item.date) > new Date(lastViewed)
      ).length;
      setUnseenCount(newUnseen);
    }
  }, [recentItems, lastViewed]);

  const fetchRecentItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const [messages, assets, trustees, credentials] = await Promise.all([
        axios.get(`/api/messages/${user.id}/recent`).then(res => res.data),
        axios.get(`/api/assets?ownerId=${user.id}&limit=3`).then(res => res.data),
        axios.get(`/api/trustees/recent/${user.id}`).then(res => res.data),
        axios.get(`/api/credentials?ownerId=${user.id}&limit=3`).then(res => res.data)
      ]);

      const combined = [
        ...messages.map((item, index) => ({
          ...item,
          type: 'message',
          icon: icons.messages,
          link: '/messages',
          text: `New message: ${item.subject || "Untitled"}`,
          date: item.createdAt,
          uniqueKey: `message-${item.id || index}`,
          isNew: !lastViewed || new Date(item.createdAt) > new Date(lastViewed)
        })),
        ...assets.map((item, index) => ({
          ...item,
          type: 'asset',
          icon: icons.assets,
          link: '/assets',
          text: `Uploaded: ${item.name || "Untitled asset"}`,
          date: item.createdAt,
          uniqueKey: `asset-${item.id || index}`,
          isNew: !lastViewed || new Date(item.createdAt) > new Date(lastViewed)
        })),
        ...trustees.map((item, index) => ({
          ...item,
          type: 'trustee',
          icon: icons.trustees,
          link: '/trustees',
          text: `Added trustee: ${item.trusteeName || item.trusteeEmail || "Unnamed"}`,
          date: item.invitedAt,
          uniqueKey: `trustee-${item.trusteeId || index}`,
          isNew: !lastViewed || new Date(item.invitedAt) > new Date(lastViewed)
        })),
        ...credentials.map((item, index) => ({
          ...item,
          type: 'credential',
          icon: icons.vault,
          link: '/credentials',
          text: `Added credential: ${item.title || "Untitled credential"}`,
          date: item.createdAt,
          uniqueKey: `credential-${item.id || index}`,
          isNew: !lastViewed || new Date(item.createdAt) > new Date(lastViewed)
        }))
      ];

      const sortedItems = combined
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3);

      setRecentItems(sortedItems);
    } catch (error) {
      console.error("Error fetching recent items:", error);
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleDropdownToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    
    if (newState) {
      // Set current view time when opening
      const now = new Date().toISOString();
      setCurrentViewTime(now);
    } else {
      // Only update lastViewed when closing the dropdown
      if (currentViewTime) {
        localStorage.setItem('notificationsLastViewed', currentViewTime);
        setLastViewed(currentViewTime);
        setUnseenCount(0);
      }
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleDropdownToggle}
        className="cursor-pointer relative p-2 text-gray-600 hover:text-brandRose transition-colors focus:outline-none"
        aria-label="Notifications"
      >
        <FontAwesomeIcon icon={icons.bell} size="lg" />
        {unseenCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white min-w-[16px] text-center leading-tight">
            {unseenCount > 9 ? "9+" : unseenCount}
          </span>
        )}
      </button>

      {isOpen && (
        <ErrorBoundary
          fallback={
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-lightGray z-20 p-3 text-red-500 text-sm">
              Error loading notifications
            </div>
          }
        >
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-lightGray z-20 overflow-hidden">
            <div className="p-4 border-b border-lightGray bg-brandRose-light">
              <h3 className="font-semibold text-charcoal flex items-center gap-2">
                <FontAwesomeIcon icon={icons.bell} className="text-brandRose" />
                Recent Activities
              </h3>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="p-4 flex justify-center">
                  <div className="animate-pulse text-gray-500 text-sm">
                    Loading notifications...
                  </div>
                </div>
              ) : error ? (
                <div className="p-4 text-red-500 text-sm">{error}</div>
              ) : recentItems.length > 0 ? (
                recentItems.map((item) => (
                  <Link
                    to={item.link}
                    key={item.uniqueKey}
                    className={`block p-3 border-b border-lightGray transition-colors ${
                      item.isNew ? 'bg-[#fdfbd4]' : 'bg-white'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full flex-shrink-0 ${
                        item.isNew ? 'bg-yellow-100 text-yellow-600' : 'bg-brandRose-light text-brandRose'
                      }`}>
                        <FontAwesomeIcon icon={item.icon} className="text-sm" />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${
                          item.isNew ? 'text-gray-900' : 'text-charcoal'
                        }`}>
                          {item.text}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDistanceToNow(new Date(item.date))} ago
                        </p>
                      </div>
                      {item.isNew && (
                        <div className="ml-auto w-2 h-2 rounded-full bg-yellow-500 mt-1.5"></div>
                      )}
                    </div>
                  </Link>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500 text-sm">
                  No recent activities
                </div>
              )}
            </div>

            <div className="p-3 border-t border-lightGray bg-gray-50">
              <Link
                to="/activities"
                className="text-sm text-brandRose hover:underline flex items-center justify-center gap-1"
                onClick={() => setIsOpen(false)}
              >
                <FontAwesomeIcon icon={icons.arrowRight} className="text-xs" />
                View all activities
              </Link>
            </div>
          </div>
        </ErrorBoundary>
      )}
    </div>
  );
};

export default NotificationsDropdown;