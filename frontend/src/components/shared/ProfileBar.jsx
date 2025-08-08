import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../icons/icons";
import Button from "../shared/Button";
import { useAuth } from "../../contexts/AuthContext";
import { useLocation } from "react-router-dom";
import PropTypes from 'prop-types';
import ErrorBoundary from "../shared/ErrorBoundary";

const ProfileBar = ({ type = "dashboard", view, setView, onNewItem }) => {
  const { user } = useAuth();
  const location = useLocation();

  const isDashboard = location.pathname === "/dashboard";

  const pageConfigs = {
    dashboard: {
      filters: [
        {
          id: "overview",
          label: "Overview",
          icon: icons.dashboard,
          view: "overview"
        },
        {
          id: "activity",
          label: "Recent Activity",
          icon: icons.clock,
          view: "activity"
        }
      ],
      newItemButton: null
    },
    messages: {
      filters: [
        {
          id: "drafts",
          label: "Drafts",
          icon: icons.save,
          view: "drafts"
        },
        {
          id: "scheduled",
          label: "Scheduled",
          icon: icons.clock,
          view: "scheduled"
        },
        {
          id: "starred",
          label: "Starred",
          icon: icons.star,
          view: "starred"
        }
      ],
      newItemButton: {
        label: "New Message",
        icon: icons.plus
      }
    },
    assets: {
      filters: [
        {
          id: "all",
          label: "All Assets",
          icon: icons.assets,
          view: "all"
        },
        {
          id: "messages",
          label: "Linked to Messages",
          icon: icons.messages,
          view: "messages"
        },
        {
          id: "trustees",
          label: "Linked to Trustees",
          icon: icons.userShield,
          view: "trustees"
        }
      ],
      newItemButton: {
        label: "Upload Asset",
        icon: icons.upload
      }
    },
    vault: {
      filters: [
        {
          id: "social",
          label: "Social Media",
          icon: icons.instagram,
          view: "social"
        },
        {
          id: "bank",
          label: "Bank Accounts",
          icon: icons.creditCard,
          view: "bank"
        },
        {
      id: "email",
      label: "Email Accounts",
      icon: icons.envelope,
      view: "email"
    },
    {
      id: "others",
      label: "Other Credentials",
      icon: icons.lock,
      view: "others"
    }
      ],
      newItemButton: {
        label: "New Credential",
        icon: icons.plus
      }
    },
    trustees: {
      filters: [
        {
          id: "individual",
          label: "Individual",
          icon: icons.userShield,
          view: "individual"
        },
        {
          id: "external",
          label: "External",
          icon: icons.globe,
          view: "external"
        },
        {
          id: "group",
          label: "Group",
          icon: icons.users,
          view: "group"
        }
      ],
      newItemButton: {
        label: "Invite Trustee",
        icon: icons.plus
      }
    }
  };

  const config = pageConfigs[type] || pageConfigs.dashboard || { 
    filters: [], 
    newItemButton: null 
  };

  return (
    <ErrorBoundary fallback={<div className="p-4 text-red-500">Profile panel temporarily unavailable</div>}>
      <aside 
        className="sticky top-20 flex flex-col justify-between w-64 px-4 py-6 rounded-2xl shadow border border-lightGray bg-white"
        style={{
          marginRight: "1rem",
          marginBottom: "1rem",
          height: "calc(100vh - 6rem)",
        }}
      >
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-brandRose text-white flex items-center justify-center text-lg font-bold shadow">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <div className="text-xs text-brandRose-dark">Hey,</div>
              <div className="font-semibold">  {(user?.name?.split(" ")[0] || "User")}!</div>
            </div>
          </div>

          <div className="space-y-3 mb-6 border-b border-lightGray pb-4">
            {view !== "home" && !isDashboard && (
  <Button
    onClick={() => setView("home")}
    variant="tertiary"
    className="w-full transition-all shadow-xs"
  >
    <FontAwesomeIcon 
      icon={icons.arrowLeft} 
      className="mr-2 transition-transform group-hover:-translate-x-0.5" 
    />
    Back to Home
  </Button>
)}

            {config.newItemButton && (
              <Button 
                onClick={onNewItem} 
                color="primary" 
                className="w-full shadow-sm hover:shadow-md transition-all"
              >
                <FontAwesomeIcon icon={config.newItemButton.icon} className="mr-2" />
                {config.newItemButton.label}
              </Button>
            )}
          </div>

          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">
              View Options
            </h3>
            <div className="space-y-2">
              {config.filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setView(filter.view)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all cursor-pointer ${
                    view === filter.view
                      ? "bg-brandRose text-white shadow-inner"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <FontAwesomeIcon 
                    icon={filter.icon} 
                    className={`text-sm ${view === filter.view ? 'text-white' : 'text-brandRose'}`}
                  />
                  <span>{filter.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="text-xs text-brandRose-dark text-center mt-6">
          Here & Always
        </div>
      </aside>
    </ErrorBoundary>
  );
};

ProfileBar.propTypes = {
  type: PropTypes.oneOf(['dashboard', 'messages', 'assets', 'vault', 'trustees']),
  view: PropTypes.string,
  setView: PropTypes.func.isRequired,
  onNewItem: PropTypes.func
};

export default ProfileBar;