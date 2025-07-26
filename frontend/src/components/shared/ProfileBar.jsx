import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../icons/icons";
import Button from "../shared/Button";
import { useAuth } from "../../contexts/AuthContext";

const ProfileBar = ({ type = "messages", setView, view, onNewItem }) => {
  const { user } = useAuth();

  const renderFilters = () => {
    if (type === "messages") {
      return (
        <div className="space-y-2 text-sm font-medium">
          <button
            onClick={() => setView("drafts")}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded transition ${
              view === "drafts"
                ? "bg-brandRose text-white"
                : "hover:bg-brandRose hover:text-white text-brandRose-dark"
            }`}
          >
            <FontAwesomeIcon icon={icons.save} />
            Drafts
          </button>
          <button
            onClick={() => setView("scheduled")}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded transition ${
              view === "scheduled"
                ? "bg-brandRose text-white"
                : "hover:bg-brandRose hover:text-white text-brandRose-dark"
            }`}
          >
            <FontAwesomeIcon icon={icons.clock} />
            Scheduled
          </button>
          <button
            onClick={() => setView("starred")}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded transition ${
              view === "starred"
                ? "bg-brandRose text-white"
                : "hover:bg-brandRose hover:text-white text-brandRose-dark"
            }`}
          >
            <FontAwesomeIcon icon={icons.star} />
            Starred
          </button>
        </div>
      );
    }

    if (type === "trustees") {
      return (
        <div className="space-y-2 text-sm font-medium">
          <button
            onClick={() => setView("individual")}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded transition ${
              view === "individual"
                ? "bg-brandRose text-white"
                : "hover:bg-brandRose hover:text-white text-brandRose-dark"
            }`}
          >
            <FontAwesomeIcon icon={icons.userShield} />
            Individual Trustees
          </button>
          <button
            onClick={() => setView("external")}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded transition ${
              view === "external"
                ? "bg-brandRose text-white"
                : "hover:bg-brandRose hover:text-white text-brandRose-dark"
            }`}
          >
            <FontAwesomeIcon icon={icons.globe} />
            External Trustees
          </button>
          <button
            onClick={() => setView("group")}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded transition ${
              view === "group"
                ? "bg-brandRose text-white"
                : "hover:bg-brandRose hover:text-white text-brandRose-dark"
            }`}
          >
            <FontAwesomeIcon icon={icons.users} />
            Group Trustees
          </button>
        </div>
      );
    }

    if (type === "assets") {
      return (
        <div className="space-y-2 text-sm font-medium">
          <button
            onClick={() => setView("all")}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded transition ${
              view === "all"
                ? "bg-brandRose text-white"
                : "hover:bg-brandRose hover:text-white text-brandRose-dark"
            }`}
          >
            <FontAwesomeIcon icon={icons.assets} />
            All Assets
          </button>
          <button
            onClick={() => setView("messages")}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded transition ${
              view === "messages"
                ? "bg-brandRose text-white"
                : "hover:bg-brandRose hover:text-white text-brandRose-dark"
            }`}
          >
            <FontAwesomeIcon icon={icons.messages} />
            Linked to Messages
          </button>
          <button
            onClick={() => setView("trustees")}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded transition ${
              view === "trustees"
                ? "bg-brandRose text-white"
                : "hover:bg-brandRose hover:text-white text-brandRose-dark"
            }`}
          >
            <FontAwesomeIcon icon={icons.userShield} />
            Linked to Trustees
          </button>
        </div>
      );
    }

    if (type === "vault") {
      return (
        <div className="space-y-2 text-sm font-medium">
          <button
            onClick={() => setView("all")}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded transition ${
              view === "all"
                ? "bg-brandRose text-white"
                : "hover:bg-brandRose hover:text-white text-brandRose-dark"
            }`}
          >
            <FontAwesomeIcon icon={icons.lock} />
            All Credentials
          </button>
          <button
            onClick={() => setView("social")}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded transition ${
              view === "social"
                ? "bg-brandRose text-white"
                : "hover:bg-brandRose hover:text-white text-brandRose-dark"
            }`}
          >
            <FontAwesomeIcon icon={icons.instagram} />
            Social Media
          </button>
          <button
            onClick={() => setView("bank")}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded transition ${
              view === "bank"
                ? "bg-brandRose text-white"
                : "hover:bg-brandRose hover:text-white text-brandRose-dark"
            }`}
          >
            <FontAwesomeIcon icon={icons.creditCard} />
            Bank Accounts
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <aside
      className="sticky top-20 flex flex-col justify-between w-64 px-4 py-6 rounded-2xl shadow border border-lightGray text-charcoal"
      style={{
        marginRight: "1rem",
        marginBottom: "1rem",
        height: "calc(100vh - 6rem)",
      }}
    >
      <div>
        {/* user info */}
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
        {view !== "home" && (
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
        <Button onClick={onNewItem} color="primary" className="w-full mb-4">
          <FontAwesomeIcon icon={icons.plus} className="mr-2" />
          {type === "messages"
            ? "New Message"
            : type === "assets"
            ? "Upload Asset"
            : type === "vault"
            ? "New Credential"
            : "Invite Trustee"}
        </Button>

        {/* filters */}
        {renderFilters()}
      </div>

      {/* bottom brand */}
      <div className="text-xs text-brandRose-dark text-center mt-6">
        Here & Always
      </div>
    </aside>
  );
};

export default ProfileBar;
