import { useState } from "react";
import Sidebar from "../components/shared/Sidebar";
import NewMessage from "../components/messages/NewMessage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../icons/icons";
import Button from "../components/shared/Button";

const Messages = () => {
  const [showModal, setShowModal] = useState(false);

  // TODO: replace this with real logged-in ownerId later
  const ownerId = "1d28bf25-fce1-4e4f-9309-b3471db1d88b";

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Messages</h1>
          <Button
  onClick={() => setShowModal(true)}
  variant="primary"
  icon={icons.send}
  label="New Message"
/>

        </div>

        {/* Here you could show the message list later */}

        {showModal && (
          <NewMessage ownerId={ownerId} onClose={() => setShowModal(false)} />
        )}
      </div>
    </div>
  );
};

export default Messages;
