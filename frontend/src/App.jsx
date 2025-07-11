// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserTest from './pages/UserTest';
import Dashboard from './pages/Dashboard';
import Messages from './pages/Messages';
import Trustees from './pages/Trustees';
import Assets from './pages/Assets';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserTest />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/trustees" element={<Trustees />} />
        <Route path="/assets" element={<Assets />} />


      </Routes>
    </Router>
  );
}

export default App;
