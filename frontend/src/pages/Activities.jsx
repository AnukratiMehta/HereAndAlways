import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../icons/icons";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import Sidebar from "../components/shared/Sidebar";
import Header from "../components/shared/Header";
import ErrorBoundary from "../components/shared/ErrorBoundary";
import Button from "../components/shared/Button";

const Activities = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (user?.id) {
      fetchAllActivities();
    }
  }, [user?.id]);

  const fetchAllActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [messages, assets, trustees, credentials] = await Promise.all([
        axios.get(`/api/messages/${user.id}/recent`).then(res => res.data),
        axios.get(`/api/assets?ownerId=${user.id}&limit=20`).then(res => res.data),
        axios.get(`/api/trustees/recent/${user.id}`).then(res => res.data),
        axios.get(`/api/credentials?ownerId=${user.id}&limit=5`).then(res => res.data)
      ]);

      const combined = [
        ...messages.map((item, index) => ({
          ...item,
          type: 'message',
          icon: icons.messages,
          link: '/messages', 
          text: `Created message: ${item.subject || "Untitled message"}`,
          date: item.createdAt,
          uniqueKey: `message-${item.id || index}`
        })),
        ...assets.map((item, index) => ({
          ...item,
          type: 'asset',
          icon: icons.assets,
          link: '/assets', 
          text: `Uploaded asset: ${item.name || "Untitled asset"}`,
          date: item.createdAt,
          uniqueKey: `asset-${item.id || index}`
        })),
        ...trustees.map((item, index) => ({
          ...item,
          type: 'trustee',
          icon: icons.trustees,
          link: '/trustees', 
          text: `Added trustee: ${item.trusteeName || item.trusteeEmail || "Unnamed trustee"}`,
          date: item.invitedAt,
          uniqueKey: `trustee-${item.trusteeId || index}`
        })),
        ...credentials.map((item, index) => ({
          ...item,
          type: 'credential',
          icon: icons.vault,
          link: '/credentials', 
          text: `Added credential: ${item.title || "Untitled credential"}`,
          date: item.createdAt,
          uniqueKey: `credential-${item.id || index}`
        }))
      ];

      setActivities(combined.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (error) {
      console.error("Error fetching activities:", error);
      setError("Failed to load activities. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleActivityClick = (link) => {
    navigate(link);
  };

  const totalPages = Math.ceil(activities.length / itemsPerPage);
  const currentItems = activities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header 
          showSearch={false}
          title="Recent Activities"
        />
        
        <div className="flex-1 p-8 overflow-y-auto">
          <ErrorBoundary fallback={<div className="text-red-500">Error loading activities</div>}>
            <div className="max-w-4xl mx-auto">
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-pulse text-gray-500">Loading activities...</div>
                </div>
              ) : activities.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-8 border border-lightGray text-center">
                  <FontAwesomeIcon 
                    icon={icons.clock} 
                    className="text-4xl text-gray-300 mb-4"
                  />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    No Recent Activities
                  </h3>
                  <p className="text-gray-500">
                    Your recent activities will appear here
                  </p>
                </div>
              ) : (
                <>
                  <div className="bg-white rounded-xl shadow-sm border border-lightGray overflow-hidden">
                    <div className="p-6 border-b border-lightGray">
                      <h1 className="text-xl font-semibold text-charcoal">
                        Recent Activities
                      </h1>
                    </div>
                    
                    <div className="divide-y divide-lightGray">
                      {currentItems.map(activity => (
                        <div
                          key={activity.uniqueKey}
                          onClick={() => handleActivityClick(activity.link)}
                          className="block p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          <div className="flex items-start gap-4">
                            <div className="p-2 rounded-full bg-brandRose-light text-brandRose">
                              <FontAwesomeIcon 
                                icon={activity.icon} 
                                className="text-sm"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-charcoal">
                                {activity.text}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {formatDistanceToNow(new Date(activity.date))} ago
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex justify-between items-center mt-6">
                      <Button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        color="secondary"
                        size="sm"
                      >
                        Previous
                      </Button>
                      
                      <span className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                      </span>
                      
                      <Button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        color="secondary"
                        size="sm"
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};

export default Activities;