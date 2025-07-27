import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserTest from './pages/UserTest';
import Dashboard from './pages/Dashboard';
import Messages from './pages/Messages';
import Trustees from './pages/Trustees';
import Assets from './pages/Assets';
import Vault from './pages/Vault';
import SignUp from './pages/Signup';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={< SignUp />} />
         <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/trustees" element={<Trustees />} />
        <Route path="/assets" element={<Assets />} />
        <Route path="/vault" element={<Vault />} />
        <Route path="/settings" element={<Settings />} />


      </Routes>
    </Router>
  );
}

export default App;
