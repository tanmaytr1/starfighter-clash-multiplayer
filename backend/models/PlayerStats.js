const mongoose = require('mongoose');

const PlayerStatsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true, // A user should only have one stats document
    },
    totalGames: {
        type: Number,
        default: 0,
    },
    totalKills: {
        type: Number,
        default: 0,
    },
    totalDeaths: {
        type: Number,
        default: 0,
    },
    totalWins: {
        type: Number,
        default: 0,
    },
    lastPlayed: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('PlayerStats', PlayerStatsSchema);