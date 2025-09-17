const mongoose = require('mongoose');

const GameRoomSchema = new mongoose.Schema({
    // Unique ID for the room, auto-generated on creation
    roomId: {
        type: String,
        required: true,
        unique: true,
    },
    // Display name for the room in the lobby
    roomName: {
        type: String,
        required: true,
    },
    // Game mode: 'freewar' or 'team deathmatch'
    mode: {
        type: String,
        enum: ['freewar', 'team'],
        required: true,
    },
    // Maximum number of players allowed in the room
    maxPlayers: {
        type: Number,
        default: 6,
    },
    // Array of players in the room
    players: [{
        // Reference to the User model
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        // Player's assigned team (A or B), null for freewar mode
        team: {
            type: String,
            enum: ['A', 'B', null],
            default: null,
        },
        // True if the player is the room's creator/host
        isHost: {
            type: Boolean,
            default: false,
        },
    }],
    // Current status of the game room
    status: {
        type: String,
        enum: ['waiting', 'in-progress', 'completed'],
        default: 'waiting',
    },
    // Timestamp for automatic cleanup of old rooms
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '2h', // Automatically delete rooms after 2 hours
    },
});

module.exports = mongoose.model('GameRoom', GameRoomSchema);