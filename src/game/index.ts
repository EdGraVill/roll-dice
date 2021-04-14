import { Server } from 'socket.io';
import joinHandler from './joinHandler';
import leaveHandler from './leaveHandler';
import rollHandler from './rollHandler';
import switchPlayerStatusHandler from './switchPlayerStatusHandler';
import { FakeDB } from './types';

const fakedb: FakeDB = {};

export default function loadRoom(io: Server, roomId: string) {
  fakedb[roomId] = {
    io: io.of(`/${roomId}`),
    players: {},
    isGameRunning: false,
  }

  fakedb[roomId].io.on('connect', (socket) => {
    socket.on('join', joinHandler(fakedb, socket, roomId));

    socket.on('leave', leaveHandler(fakedb, io, socket, roomId));
    socket.on('disconnect', leaveHandler(fakedb, io, socket, roomId));

    socket.on('switchPlayerStatus', switchPlayerStatusHandler(fakedb, socket, roomId));

    socket.on('roll', rollHandler(fakedb, socket, roomId));
  });
}
