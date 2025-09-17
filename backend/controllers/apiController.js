// backend/controllers/apiController.js

const GameRoom = require('../models/GameRoom');
const User = require('../models/User'); 
const { nanoid } = require('nanoid'); // 🆕 Corrected nanoid import

// Get user profile information
exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create a new game room
exports.createRoom = async (req, res) => {
    try {
        const { roomName, mode, maxPlayers } = req.body;
        const userId = req.user.id;

        const roomId = nanoid(6); // 🆕 Now nanoid is available directly

        const newRoom = new GameRoom({
            roomId,
            roomName,
            mode,
            maxPlayers,
            players: [{
                user: userId,
                isHost: true
            }]
        });

        await newRoom.save();

        req.io.to(roomId).emit('room:update', { room: newRoom });

        res.status(201).json({ message: 'Room created successfully', room: newRoom });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Find a specific room by its ID
exports.findRoomById = async (req, res) => {
    try {
        const { roomId } = req.params;
        const room = await GameRoom.findOne({ roomId });

        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        
        if (room.status !== 'waiting' || room.players.length >= room.maxPlayers) {
            return res.status(403).json({ message: 'Room is not available to join' });
        }

        res.status(200).json({ message: 'Room found', room: room });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Join an existing game room
exports.joinRoom = async (req, res) => {
    try {
        const { roomId } = req.body;
        const userId = req.user.id;

        const room = await GameRoom.findOne({ roomId });

        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        const isPlayerInRoom = room.players.some(player => player.user.equals(userId));
        if (isPlayerInRoom) {
            return res.status(400).json({ message: 'User is already in this room' });
        }
        
        if (room.status !== 'waiting' || room.players.length >= room.maxPlayers) {
            return res.status(403).json({ message: 'Room is not available to join' });
        }

        room.players.push({ user: userId });
        await room.save();
        
        // 🆕 Emit a Socket.IO event to all clients in the room
        req.io.to(roomId).emit('room:update', { room: room });

        res.status(200).json({ message: 'Joined room successfully', room: room });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};