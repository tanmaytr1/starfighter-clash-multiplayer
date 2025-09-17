import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute'; // Import your new ProtectedRoute
// Import all your components
import StarScreen from './pages/game/StarScreen';
import Dashboard from './pages/game/Dashboard';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Profile from './pages/game/Profile';
import Setting from './pages/game/Setting';
import Play from './game/Play';
import NotFound from './pages/game/NotFound';
import { AuthProvider } from "./context/AuthContext";
import PublicRoute from './components/PublicRoute';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes - Accessible to all */}
          <Route path="/" element={<StarScreen />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

          {/* Protected Routes - Only accessible if logged in */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/setting" element={<ProtectedRoute><Setting /></ProtectedRoute>} />
          <Route path="/play" element={<ProtectedRoute><Play /></ProtectedRoute>} />

          {/* Catch-all for 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};


export default App;