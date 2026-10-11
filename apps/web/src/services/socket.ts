import { io, type Socket } from 'socket.io-client';
import type { ServerToClientEvents, ClientToServerEvents } from '@bookit/shared';
import { getAccessToken } from './api.js';

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

export function getSocket(): Socket<ServerToClientEvents, ClientToServerEvents> {
  if (!socket) {
    socket = io('/', {
      autoConnect: false,
      auth: (cb) => cb({ token: getAccessToken() }),
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
    });
  }
  return socket;
}

export function connectSocket() {
  const s = getSocket();
  if (!s.connected) s.connect();
  return s;
}

export function disconnectSocket() {
  if (socket?.connected) {
    socket.disconnect();
  }
}

export function joinHotelRoom(hotelId: string) {
  getSocket().emit('hotel:subscribe', { hotelId });
}

export function leaveHotelRoom(hotelId: string) {
  getSocket().emit('hotel:unsubscribe', { hotelId });
}
