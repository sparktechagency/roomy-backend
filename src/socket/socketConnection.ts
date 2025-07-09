import { Server as HTTPServer } from 'http';
import { Server , Socket } from 'socket.io';
import User from '../app/modules/user/user.model';


let io: Server;
const onlineUsers = new Set();
const connectSocket = (server: HTTPServer) => {
  if (!io) {
    io = new Server(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
      pingInterval: 30000,
      pingTimeout: 5000,
    });
  }

  io.on('connection', async (socket: Socket) => {
    console.log('A client connected:', socket.id);
    socket.on('ping', (data:any) => {
      io.emit('pong', data);
    });
    const userId = socket.handshake.query.id as string;

    if (!userId) {
      socket.emit('error', 'User ID is required');
      socket.disconnect();
      return;
    }

    const currentUser = await User.findById(userId);
    if (!currentUser) {
      socket.emit('error', 'User not found');
      socket.disconnect();
      return;
    }
    const currentUserId = currentUser?._id.toString();
    socket.join(currentUserId as string);
    onlineUsers.add(currentUserId);
    console.log(onlineUsers);
    // await handleChatEvents(io, socket, onlineUsers, currentUserId);
    io.emit('onlineUser', Array.from(onlineUsers));
    socket.on('disconnect', () => {
      console.log(' A client disconnected:', socket.id);
      onlineUsers.delete(currentUserId);
      console.log(onlineUsers)
      io.emit('onlineUser', Array.from(onlineUsers));
    });
  });
  return io;
};

const getSocketIO = () => {
  if (!io) {
    throw new Error('socket.io is not initialized');
  }
  return io;
};

export { connectSocket, getSocketIO };

