// src/pages/Messages.jsx
import { useState } from 'react';
import Sidebar from '../components/shared/Sidebar';
import Button from '../components/shared/Button';
import Modal from '../components/shared/Modal';
import NewMessage from '../components/messages/NewMessage';

const Messages = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-charcoal">Messages</h1>
          <Button onClick={() => setShowModal(true)}>+ New Message</Button>
        </div>

        {showModal && (
          <Modal title="New Message" onClose={() => setShowModal(false)}>
            <NewMessage onClose={() => setShowModal(false)} />
          </Modal>
        )}

        {/* Later: List of messages */}
      </main>
    </div>
  );
};

export default Messages;
