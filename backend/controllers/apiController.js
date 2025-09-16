const PlayerStats = require('../models/PlayerStats');
const GameRoom = require('../models/GameRoom');
const User = require('../models/User');

const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: 'Unauthorized' });
};

exports.createPlayerStats = async (userId) => {
    try {
        const stats = new PlayerStats({ user: userId });
        await stats.save();
        console.log(`Initial stats created for user: ${userId}`);
    } catch (error) {
        console.error('Error creating player stats:', error);
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        const stats = await PlayerStats.findOne({ user: req.user.id });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ user, stats });
    } catch (err) {
        console.error('Profile fetch error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getActiveRooms = async (req, res) => {
    try {
        const rooms = await GameRoom.find({ status: { $ne: 'completed' } }).populate('players', 'username');
        res.json(rooms);
    } catch (err) {
        console.error('Room fetch error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};