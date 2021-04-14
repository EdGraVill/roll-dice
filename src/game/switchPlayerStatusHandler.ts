import { Socket } from 'socket.io';
import { FakeDB } from './types';

export default (fakedb: FakeDB, socket: Socket, roomId: string) => () => {
  if (!fakedb[roomId].isGameRunning) {
    fakedb[roomId].players[socket.id].isPlaying = !fakedb[roomId].players[socket.id].isPlaying;

    fakedb[roomId].io.emit('playersUpdated', fakedb[roomId].players);
  }
};
