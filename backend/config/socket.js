const { Server } = require('socket.io');

const socketConfig = (server) => {
    // Create a Socket.IO server instance and attach it to the HTTP server
    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:5173',
            credentials: true
        }
    });

    // The main connection listener
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        // Listen for events from the client
        socket.on('room:join', (data) => {
            const { roomId, userId } = data;
            socket.join(roomId);
            console.log(`User ${userId} with socket ID ${socket.id} joined room ${roomId}`);
            
            // This is a crucial line for real-time updates
            // You will need to fetch the updated room data and send it back
            // io.to(roomId).emit('room:update', { message: 'Player joined!' });
        });

        socket.on('room:leave', (data) => {
            const { roomId, userId } = data;
            socket.leave(roomId);
            console.log(`User ${userId} with socket ID ${socket.id} left room ${roomId}`);
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });

    return io; // Return the Socket.IO instance
};

module.exports = socketConfig;