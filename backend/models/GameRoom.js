const mongoose = require('mongoose');

const GameRoomSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
        unique: true,
    },
    players: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    status: {
        type: String,
        enum: ['waiting', 'in-progress', 'completed'],
        default: 'waiting',
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '2h', // Automatically delete rooms after 2 hours
    },
});

module.exports = mongoose.model('GameRoom', GameRoomSchema);