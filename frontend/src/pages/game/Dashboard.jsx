import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Import useAuth hook
import { createRoom } from '../../service/api';
import Room from './Room';
import JoinRoomModal from '../../components/JoinRoomModal';

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, loading } = useAuth(); // Destructure auth state from the context

  const [showModal, setShowModal] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [createRoomForm, setCreateRoomForm] = useState({
    roomName: '',
    mode: 'free war',
    maxPlayers: 2
  });
  const [message, setMessage] = useState('');

  // Use a useEffect hook to log the authentication status
  useEffect(() => {
    console.log("Dashboard - Authentication status:", isAuthenticated);
    console.log("Dashboard - User data:", user);
    console.log("Dashboard - Loading status:", loading);
  }, [isAuthenticated, user, loading]);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    try {
      const res = await createRoom(createRoomForm);
      setMessage(`Room "${res.room.roomName}" created with ID: ${res.room.roomId}`);
      setCurrentRoom(res.room);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to create room.');
    }
  };

  const handleRoomJoined = (roomData) => {
    setCurrentRoom(roomData);
    setShowModal(false);
  };

  if (currentRoom) {
    return <Room roomData={currentRoom} />;
  }

  // You can also use conditional rendering based on the loading state
  if (loading) {
    return <div>Loading Dashboard...</div>;
  }

  // This check should not be necessary due to ProtectedRoute,
  // but it's good for robustness.
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  return (
    <div>
      <h1>Lobby</h1>
      <p>{message}</p>
      <div style={{ display: 'flex', gap: '50px' }}>
        {/* Create Room Section */}
        <div>
          <h3>Create a Room</h3>
          <form onSubmit={handleCreateRoom}>
            <input
              type="text"
              placeholder="Room Name"
              value={createRoomForm.roomName}
              onChange={(e) => setCreateRoomForm({ ...createRoomForm, roomName: e.target.value })}
            />
            <select
              value={createRoomForm.mode}
              onChange={(e) => setCreateRoomForm({ ...createRoomForm, mode: e.target.value })}
            >
              <option value="freewar">Free-for-all</option>
              <option value="team">Team Deathmatch</option>
            </select>
            <input
              type="number"
              placeholder="Max Players"
              value={createRoomForm.maxPlayers}
              onChange={(e) => setCreateRoomForm({ ...createRoomForm, maxPlayers: e.target.value })}
            />
            <button type="submit">Create Room</button>
          </form>
        </div>

        {/* Join Room Section */}
        <div>
          <h3>Join a Room</h3>
          <button onClick={() => setShowModal(true)}>Join a Room</button>
        </div>
      </div>

      {showModal && <JoinRoomModal onClose={() => setShowModal(false)} onJoin={handleRoomJoined} />}
    </div>
  );
};

export default Dashboard;