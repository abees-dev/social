import { io } from 'socket.io-client';
import { IMessageBody } from 'src/interface/MesssageReponse';

const local = localStorage.getItem('redux-user');

const socket = io(String('https://api.abeesdev.com'), {
  transports: ['websocket'],
  auth: {
    token: local ? JSON.parse(JSON.parse(local || '{}')?.accessToken) : '',
  },
});

export const sendMessageSocket = (key: string, data: IMessageBody) => {
  socket.emit(key, data);
};

export default socket;
