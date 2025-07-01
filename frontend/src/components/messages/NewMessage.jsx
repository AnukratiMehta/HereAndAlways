import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../icons/icons";
import Button from "../shared/Button";

const NewMessage = ({ ownerId, onClose }) => {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [scheduledDelivery, setScheduledDelivery] = useState("");
  const [trusteeId, setTrusteeId] = useState("");
  const [trustees, setTrustees] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!ownerId) return;
    axios
      .get(`/api/trustees/${ownerId}`)
      .then((res) => setTrustees(res.data))
      .catch((err) => console.error(err));
  }, [ownerId]);

  // send
  const handleSubmit = async (e) => {
    e.preventDefault();

    // validate before sending
    if (!subject || !body) {
      alert("Subject and body are required to send.");
      return;
    }

    try {
      await axios.post(`/api/messages/${ownerId}`, {
        subject,
        body,
        scheduledDelivery: scheduledDelivery,
        trusteeId: trusteeId,
        deliveryStatus: "QUEUED",
      });
      setMessage("Message queued successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      setMessage("Failed to send message.");
    }
  };

  // save as draft
  const handleSaveDraft = async () => {
  try {
    await axios.post(`/api/messages/${ownerId}`, {
      subject: subject || "Untitled",
      body,
      scheduledDelivery: scheduledDelivery || null,
      trusteeId: trusteeId || null,
      deliveryStatus: "DRAFT",
    });
    setMessage("Draft saved successfully!");
    onClose();
  } catch (err) {
    console.error(err);
    setMessage("Failed to save draft.");
  }
};


  return (
    <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
  <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 relative border border-lightGray">
    <button
      onClick={onClose}
      className="absolute top-3 right-3 text-brandRose hover:text-brandRose-dark text-2xl font-bold"
      aria-label="Close"
    >
      &times;
    </button>
    <h2 className="text-2xl font-bold text-brandRose-dark mb-6">Write a Message</h2>

    {message && <div className="text-green-600 font-medium">{message}</div>}

    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-gray-700 font-semibold mb-1">Subject</label>
        <input
          type="text"
          className="border border-gray-300 rounded-lg w-full p-3 focus:outline-brandRose focus:ring-2 focus:ring-brandRose"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Give your message a title"
        />
      </div>
      <div>
        <label className="block text-gray-700 font-semibold mb-1">Body</label>
        <textarea
          className="border border-gray-300 rounded-lg w-full p-3 focus:outline-brandRose focus:ring-2 focus:ring-brandRose"
          rows="5"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write what you wish to say"
        ></textarea>
      </div>
      <div>
        <label className="block text-gray-700 font-semibold mb-1">Scheduled Delivery</label>
        <input
          type="datetime-local"
          className="border border-gray-300 rounded-lg w-full p-3 focus:outline-brandRose focus:ring-2 focus:ring-brandRose"
          value={scheduledDelivery}
          onChange={(e) => setScheduledDelivery(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-gray-700 font-semibold mb-1">Trustee</label>
        <select
          className="border border-gray-300 rounded-lg w-full p-3 focus:outline-brandRose focus:ring-2 focus:ring-brandRose"
          value={trusteeId}
          onChange={(e) => setTrusteeId(e.target.value)}
        >
          <option value="">Select a trustee</option>
          {trustees.map((t) => (
            <option key={t.trusteeId} value={t.trusteeId}>
              {t.trusteeName}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <Button
  type="button"
  variant="secondary"
  onClick={handleSaveDraft}
  icon={icons.save}
  label="Save as Draft"
/>

        <Button
  type="submit"
  variant="primary"
  icon={icons.send}
  label="Schedule Message"
  disabled={!subject || !body || !scheduledDelivery || !trusteeId}
/>

      </div>
    </form>
  </div>
</div>

  );
};

export default NewMessage;
