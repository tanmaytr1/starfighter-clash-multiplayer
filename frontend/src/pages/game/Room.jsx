import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import { AuthContext } from '../../context/AuthContext'; // Assuming you have an AuthContext

// Create a persistent Socket.IO connection
const socket = io('http://localhost:4000'); // Ensure this matches your backend port

const Room = () => {
  const { roomId } = useParams(); // Get room ID from URL
  const { user } = useContext(AuthContext);
  const [roomData, setRoomData] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // 1. Tell the server to join this specific room
    if (user) {
        socket.emit('room:join', { roomId, userId: user._id });
    }

    // 2. Listen for real-time updates from the server
    socket.on('room:update', ({ room }) => {
        setRoomData(room);
        setMessage(`New players in room! (${room.players.length}/${room.maxPlayers})`);
    });

    // 3. Listen for the 'game:start' event
    socket.on('game:start', () => {
        setMessage('The game is starting!');
        // TODO: Navigate to the actual game screen
    });

    // Cleanup: This runs when the component unmounts
    return () => {
        if (user) {
            socket.emit('room:leave', { roomId, userId: user._id });
        }
        socket.off('room:update');
        socket.off('game:start');
    };
  }, [roomId, user]);

  const handleStartGame = () => {
    if (roomData?.players[0]?.user === user?._id) {
        socket.emit('game:start', { roomId });
    } else {
        setMessage('Only the host can start the game.');
    }
  };

  if (!roomData) {
    return <div>Loading room...</div>;
  }

  return (
    <div>
      <h1>Room: {roomData.roomName}</h1>
      <p>Room ID: {roomData.roomId}</p>
      <p>Mode: {roomData.mode}</p>
      <h3>Players ({roomData.players.length}/{roomData.maxPlayers}):</h3>
      <ul>
        {roomData.players.map((player) => (
          <li key={player.user._id}>
            {player.user.username} {player.isHost && '(Host)'}
          </li>
        ))}
      </ul>
      {message && <p>{message}</p>}

      {roomData.players[0]?.user._id === user?._id && (
        <button onClick={handleStartGame}>Start Game</button>
      )}
    </div>
  );
};

export default Room;