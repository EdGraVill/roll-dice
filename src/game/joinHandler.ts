import { Socket } from 'socket.io';
import { FakeDB } from './types';

export default (fakedb: FakeDB, socket: Socket, roomId: string) => (client: { uid: string, name: string }) => {
  // If the player is the first one, will be the owner
  const isLeader = Object.keys(fakedb[roomId].players).length === 0;

  fakedb[roomId].players[socket.id] = {
    isLeader: isLeader,
    isPlaying: false,
    name: client.name,
    results: [],
    uid: client.uid,
  };

  // A new player joined. Lets send the information of the room to the current player recycling update events
  fakedb[roomId].io.emit('playersUpdated', fakedb[roomId].players);
  fakedb[roomId].io.emit('gameUpdated', { isGameRunning: fakedb[roomId].isGameRunning });
};
