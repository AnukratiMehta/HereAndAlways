import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../icons/icons";
import Button from "../shared/Button";
import { useAuth } from "../../contexts/AuthContext";
import { useLocation } from "react-router-dom";

const ProfileBar = ({ type = "dashboard", view, setView, onNewItem }) => {
  const { user } = useAuth();
  const location = useLocation();

  // Determine if we're on the dashboard
  const isDashboard = location.pathname === "/dashboard";

  // Configuration for each page type
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
      newItemButton: null // No new item button on dashboard
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
          id: "all",
          label: "All Credentials",
          icon: icons.lock,
          view: "all"
        },
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

  const config = pageConfigs[type] || pageConfigs.dashboard;

  return (
    <aside className="sticky top-20 flex flex-col justify-between w-64 px-4 py-6 rounded-2xl shadow border border-lightGray text-charcoal"
      style={{
        marginRight: "1rem",
        marginBottom: "1rem",
        height: "calc(100vh - 6rem)",
      }}
    >
      <div>
        {/* User info */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-brandRose text-white flex items-center justify-center text-lg font-bold shadow">
            {user?.name?.[0] || "U"}
          </div>
          <div>
            <div className="text-xs text-brandRose-dark">Hey,</div>
            <div className="font-semibold">{user?.name || "User"}!</div>
          </div>
        </div>

        {/* Back button for non-home views */}
        {view !== "home" && !isDashboard && (
          <Button
            onClick={() => setView("home")}
            color="primary"
            className="w-full mb-4"
          >
            <FontAwesomeIcon icon={icons.arrowLeft} className="mr-2" />
            Back to Home
          </Button>
        )}

        {/* New item button */}
        {config.newItemButton && (
          <Button onClick={onNewItem} color="primary" className="w-full mb-4">
            <FontAwesomeIcon icon={config.newItemButton.icon} className="mr-2" />
            {config.newItemButton.label}
          </Button>
        )}

        {/* Filters */}
        <div className="space-y-2 text-sm font-medium">
          {config.filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setView(filter.view)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded transition ${
                view === filter.view
                  ? "bg-brandRose text-white"
                  : "hover:bg-brandRose hover:text-white text-brandRose-dark"
              }`}
            >
              <FontAwesomeIcon icon={filter.icon} />
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom brand */}
      <div className="text-xs text-brandRose-dark text-center mt-6">
        Here & Always
      </div>
    </aside>
  );
};

export default ProfileBar;