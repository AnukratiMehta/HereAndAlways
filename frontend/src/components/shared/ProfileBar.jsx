import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../icons/icons";
import Button from "../shared/Button";

const ProfileBar = ({
  type = "messages",
  setView,
  view,
  onNewItem,
  ownerName
}) => {
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

    return null;
  };

  return (
    <aside
      className="sticky top-20 flex flex-col justify-between w-64 px-4 py-6 rounded-2xl shadow border border-lightGray text-charcoal"
      style={{
        marginRight: "1rem",
        marginBottom: "1rem",
        height: "calc(100vh - 6rem)"
      }}
    >
      <div>
        {/* user info */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-brandRose text-white flex items-center justify-center text-lg font-bold shadow">
            {ownerName?.[0] || "U"}
          </div>
          <div>
            <div className="text-xs text-brandRose-dark">Hey,</div>
            <div className="font-semibold">{ownerName || "User"}!</div>
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
        <Button
          onClick={onNewItem}
          color="primary"
          className="w-full mb-4"
        >
          <FontAwesomeIcon icon={icons.plus} className="mr-2" />
          {type === "messages" ? "New Message" : "Invite Trustee"}
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
