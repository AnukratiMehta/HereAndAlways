import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (!token) {
      setUser(null);
      localStorage.removeItem('user');
    }
  }, [token]);

  const login = ({ token, id, name, email, role }) => {
    if (!token || !email) {
      console.error('Missing required auth fields:', { token, email });
      throw new Error('Authentication data incomplete');
    }

    const userData = {
      id: id || `temp-${Math.random().toString(36).substring(2, 9)}`,
      name: name || email.split('@')[0],
      email,
      role: role || 'LEGACY_OWNER'
    };

    console.log('Storing user data:', userData); // Debug log

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}