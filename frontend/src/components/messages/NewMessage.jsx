import { useState } from 'react';
import Select from 'react-select';
import Button from '../shared/Button';

const initialTrustees = [
  { value: 'trustee1@example.com', label: 'Trustee 1' },
  { value: 'trustee2@example.com', label: 'Trustee 2' },
  { value: 'trustee3@example.com', label: 'Trustee 3' },
];

const delayUnits = [
  { value: 'days', label: 'Days' },
  { value: 'weeks', label: 'Weeks' },
  { value: 'months', label: 'Months' },
  { value: 'years', label: 'Years' },
];

const NewMessage = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [externalEmail, setExternalEmail] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [deliveryType, setDeliveryType] = useState('fixed'); // 'fixed' or 'after-death'
  const [fixedDate, setFixedDate] = useState('');
  const [afterDeathTiming, setAfterDeathTiming] = useState('delay'); // 'immediately' or 'delay'
  const [delayValue, setDelayValue] = useState(7);
  const [delayUnit, setDelayUnit] = useState('days');

  const handleAddExternalEmail = () => {
    if (!externalEmail) return;
    const exists = selectedRecipients.some(r => r.value === externalEmail);
    if (!exists) {
      const newEmail = { value: externalEmail, label: externalEmail };
      setSelectedRecipients([...selectedRecipients, newEmail]);
    }
    setExternalEmail('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const messageData = {
      title: title.trim() === '' ? 'Untitled' : title,
      recipients: selectedRecipients.map(r => r.value),
      content: messageContent,
      delivery: {
        type: deliveryType,
        fixedDate: deliveryType === 'fixed' ? fixedDate : null,
        afterDeath: deliveryType === 'after-death' ? {
          immediate: afterDeathTiming === 'immediately',
          delay: afterDeathTiming === 'delay'
            ? { value: delayValue, unit: delayUnit }
            : null,
        } : null,
      },
    };
    // TODO: Save or schedule message
    console.log('Message:', messageData);
    onClose(); // Close modal
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* TITLE */}
      <div>
        <label className="block text-sm font-semibold text-charcoal mb-2">Message Title</label>
        <input
          type="text"
          placeholder="e.g. My Last Goodbye"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-lightGray rounded-md text-sm"
        />
      </div>

      {/* RECIPIENTS */}
      <div>
        <label className="block text-sm font-semibold text-charcoal mb-2">Recipients</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            isMulti
            options={[...initialTrustees, ...selectedRecipients.filter(r => !initialTrustees.find(t => t.value === r.value))]}
            value={selectedRecipients}
            onChange={setSelectedRecipients}
            placeholder="Select Trustees or Emails"
            className="text-sm"
          />
          <div className="flex items-center gap-2">
            <input
              type="email"
              placeholder="Add External Email"
              value={externalEmail}
              onChange={(e) => setExternalEmail(e.target.value)}
              className="w-full px-3 py-2 border border-lightGray rounded-md text-sm"
            />
            <button
              type="button"
              onClick={handleAddExternalEmail}
              className="text-sm px-3 py-2 bg-brandRose text-white rounded hover:cursor-pointer"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* MESSAGE CONTENT */}
      <div>
        <label className="block text-sm font-semibold text-charcoal mb-2">Message Content</label>
        <div className="flex space-x-2 mb-2 text-gray-500 text-sm">
          <button type="button" className="hover:text-charcoal hover:cursor-pointer">B</button>
          <button type="button" className="italic hover:text-charcoal hover:cursor-pointer">I</button>
          <button type="button" className="underline hover:text-charcoal hover:cursor-pointer">U</button>
          <button type="button" className="hover:text-charcoal hover:cursor-pointer">Link</button>
          <button type="button" className="hover:text-charcoal hover:cursor-pointer">📎 Attachment</button>
        </div>
        <textarea
          rows="6"
          placeholder="Type your message here..."
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          className="w-full px-3 py-2 border border-lightGray rounded-md text-sm resize-none"
        />
      </div>

      {/* DELIVERY SETTINGS */}
      <div>
        <label className="block text-sm font-semibold text-charcoal mb-2">Delivery Settings</label>
        <div className="space-y-3">
          <label className="flex items-center space-x-2 text-sm">
            <input
              type="radio"
              name="deliveryType"
              value="fixed"
              checked={deliveryType === 'fixed'}
              onChange={() => setDeliveryType('fixed')}
            />
            <span>Fixed Date</span>
            <input
              type="date"
              value={fixedDate}
              onChange={(e) => setFixedDate(e.target.value)}
              className="ml-4 px-2 py-1 border border-lightGray rounded-md text-sm"
              disabled={deliveryType !== 'fixed'}
            />
          </label>

          <label className="flex items-start gap-2 text-sm">
            <input
              type="radio"
              name="deliveryType"
              value="after-death"
              checked={deliveryType === 'after-death'}
              onChange={() => setDeliveryType('after-death')}
            />
            <div>
              <div className="font-medium">After Death</div>
              <div className="ml-5 space-y-2 mt-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="afterDeathTiming"
                    value="immediately"
                    checked={afterDeathTiming === 'immediately'}
                    onChange={() => setAfterDeathTiming('immediately')}
                    disabled={deliveryType !== 'after-death'}
                  />
                  <span>Immediately</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="afterDeathTiming"
                    value="delay"
                    checked={afterDeathTiming === 'delay'}
                    onChange={() => setAfterDeathTiming('delay')}
                    disabled={deliveryType !== 'after-death'}
                  />
                  <span>After delay of</span>
                  <input
                    type="number"
                    min={1}
                    value={delayValue}
                    onChange={(e) => setDelayValue(Number(e.target.value))}
                    className="w-20 px-2 py-1 border border-lightGray rounded-md text-sm"
                    disabled={
                      deliveryType !== 'after-death' || afterDeathTiming !== 'delay'
                    }
                  />
                  <select
                    value={delayUnit}
                    onChange={(e) => setDelayUnit(e.target.value)}
                    className="px-2 py-1 border border-lightGray rounded-md text-sm"
                    disabled={
                      deliveryType !== 'after-death' || afterDeathTiming !== 'delay'
                    }
                  >
                    {delayUnits.map(unit => (
                      <option key={unit.value} value={unit.value}>
                        {unit.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex justify-end space-x-3">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Schedule Message
        </Button>
      </div>
    </form>
  );
};

export default NewMessage;
