import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../icons/icons";
import { useState } from "react";

const NotificationsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  // Mock notifications data
  const notifications = [
    { id: 1, text: "New message from John", time: "2 mins ago", read: false },
    { id: 2, text: "Asset upload complete", time: "1 hour ago", read: true },
    { id: 3, text: "New trustee added", time: "3 days ago", read: true }
  ];

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-brandRose transition-colors"
      >
        <FontAwesomeIcon icon={icons.bell} size="lg" />
        {notifications.some(n => !n.read) && (
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        )}
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-lightGray z-20">
          <div className="p-3 border-b border-lightGray font-medium flex justify-between items-center">
            <span>Notifications</span>
            <button className="text-xs text-brandRose hover:underline">
              Mark all as read
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`p-3 border-b border-lightGray hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                >
                  <p className="text-sm">{notification.text}</p>
                  <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-gray-500">
                No new notifications
              </div>
            )}
          </div>
          <div className="p-2 text-center border-t border-lightGray">
            <a href="#" className="text-sm text-brandRose hover:underline">
              View all notifications
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;