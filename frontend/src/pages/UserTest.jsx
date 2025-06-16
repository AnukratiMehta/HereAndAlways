// src/pages/UserTest.jsx
import { useEffect, useState } from 'react';

export default function UserTest() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/users') // Uses vite proxy → backend:8081
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
      })
      .then(setUsers)
      .catch(err => setError(err.message));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Users</h1>
      {error && <p className="text-red-600">{error}</p>}
      <ul className="space-y-2">
        {users.map(user => (
          <li key={user.id} className="border p-2 rounded">
            {user.name} ({user.email})
          </li>
        ))}
      </ul>
    </div>
  );
}
