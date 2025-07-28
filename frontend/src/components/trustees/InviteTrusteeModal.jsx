import { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icons } from '../../icons/icons';

const InviteTrusteeModal = ({ ownerId, onClose, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (!name) {
      setError('Please enter the trustee name');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `/api/trustees/${ownerId}`,
        {
          email,
          name,
          trusteeId: null // Explicitly null for new trustees
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.status === 200) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      }
    } catch (err) {
      console.error('Failed to invite trustee:', err);
      const errorMessage = err.response?.data?.message || 
                         err.response?.data?.error || 
                         'Failed to send invitation. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">Invite Trustee</h3>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
              disabled={isLoading}
            >
              <FontAwesomeIcon icon={icons.times} />
            </button>
          </div>

          {success ? (
            <div className="text-center py-6">
              <div className="text-green-500 mb-4">
                <FontAwesomeIcon icon={icons.checkCircle} size="3x" />
              </div>
              <p className="text-lg font-medium mb-2">Invitation Sent!</p>
              <p className="text-gray-600">
                An invitation has been sent to {email}.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brandRose focus:border-transparent"
                    placeholder="trustee@example.com"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brandRose focus:border-transparent"
                    placeholder="Trustee Name"
                    disabled={isLoading}
                  />
                </div>

                {error && (
                  <div className="text-red-500 text-sm mt-2">
                    {error}
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brandRose"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-4 py-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brandRose ${
                    isLoading ? 'bg-brandRose-light' : 'bg-brandRose hover:bg-brandRose-dark'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <FontAwesomeIcon icon={icons.spinner} spin className="mr-2" />
                      Sending...
                    </>
                  ) : (
                    'Send Invitation'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default InviteTrusteeModal;