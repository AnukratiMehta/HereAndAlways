// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserTest from './pages/UserTest';
import Dashboard from './pages/Dashboard';
import Messages from './pages/Messages';
import Trustees from './pages/Trustees';
import Assets from './pages/Assets';
import Vault from './pages/Vault';
import Login from './pages/Login';
import OAuthRedirectHandler from './pages/OAuthRedirectHandler';
import Signup from './pages/Signup';

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<UserTest />} /> */}
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/oauth2/redirect" element={<OAuthRedirectHandler />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/trustees" element={<Trustees />} />
        <Route path="/assets" element={<Assets />} />
        <Route path="/vault" element={<Vault />} />



      </Routes>
    </Router>
  );
}

export default App;
