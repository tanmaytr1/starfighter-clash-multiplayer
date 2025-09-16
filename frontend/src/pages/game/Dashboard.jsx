import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/rooms', { withCredentials: true });
        setRooms(res.data);
      } catch (err) {
        setMessage('Failed to load game rooms.');
        console.error(err);
      }
    };

    fetchRooms();
  }, []);

  const createRoom = () => {
    setMessage('Creating new room...');
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <button onClick={createRoom}>Create New Game Room</button>

      {message && <p>{message}</p>}

      <h3>Join an Existing Game</h3>
      {rooms.length > 0 ? (
        <ul>
          {rooms.map(room => (
            <li key={room._id}>
              Room ID: {room.roomId} ({room.players.length} players)
              <Link to={`/play/${room.roomId}`}>Join</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No active game rooms. Start one!</p>
      )}
    </div>
  );
};

export default Dashboard;