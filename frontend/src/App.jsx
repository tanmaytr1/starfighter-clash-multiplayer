import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Import your page components
import StarScreen from './pages/game/StarScreen';
import Profile from './pages/game/Profile';
import Setting from './pages/game/Setting';
import NotFound from './pages/game/NotFound';
import Play from './pages/game/Play';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Dashboard from './pages/game/Dashboard';

import './style.css'; // Ensure you're importing your styles

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Game/Application Routes */}
          <Route path="/" element={<StarScreen />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/play" element={<Play />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Catch-all for undefined routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;