import socket from 'src/utils/socket';

export const leaveRoom = (room_id: string) => {
  socket.emit('leave_room', { room_id });
};

export const joinRoom = (room_id: string) => {
  socket.emit('join_room', { room_id });
};
