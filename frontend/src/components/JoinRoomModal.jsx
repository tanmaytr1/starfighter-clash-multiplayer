import React, { useState } from 'react';
import { findRoomById, joinRoom } from '../service/api';

const JoinRoomModal = ({ onClose, onJoin }) => {
    const [roomId, setRoomId] = useState('');
    const [message, setMessage] = useState('');

    const handleJoin = async () => {
        try {
            // First, check if the room exists and is available
            const findRes = await findRoomById(roomId);
            
            // Then, join the room
            await joinRoom({ roomId: findRes.room.roomId });
            
            // Call the onJoin prop to update the parent state (Dashboard)
            onJoin(findRes.room);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Failed to join room.');
        }
    };

    return (
        <div style={modalOverlayStyle}>
            <div style={modalContentStyle}>
                <h3>Enter Room ID</h3>
                <input
                    type="text"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    placeholder="e.g., abcde1"
                />
                <div>
                  <button onClick={handleJoin}>Join</button>
                  <button onClick={onClose}>Cancel</button>
                </div>
                {message && <p style={{ color: 'red' }}>{message}</p>}
            </div>
        </div>
    );
};

// Simple inline styles for demonstration
const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const modalContentStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  textAlign: 'center',
};

export default JoinRoomModal;