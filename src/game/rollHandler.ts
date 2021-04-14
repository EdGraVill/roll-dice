import { Socket } from 'socket.io';
import { FakeDB } from './types';

export default (fakedb: FakeDB, socket: Socket, roomId: string) => () => {
  // Get the users that are playing in the room
  const playersInGame = Object
    .keys(fakedb[roomId].players)
    .filter(playerId => fakedb[roomId].players[playerId].isPlaying)

  if (!fakedb[roomId].isGameRunning && fakedb[roomId].players[socket.id].isLeader && playersInGame.length) {
    // Set the room as in "rolling" state
    fakedb[roomId].isGameRunning = true;
    fakedb[roomId].io.emit('gameUpdated', { isGameRunning: true });

    setTimeout(() => {
      // asign to every active player a random number between 1 and 6
      playersInGame.forEach((playerId) => {
        fakedb[roomId].players[playerId].results.push(Math.floor(Math.random() * (6) + 1));
      });

      fakedb[roomId].isGameRunning = false;
      fakedb[roomId].io.emit('gameUpdated', { isGameRunning: false });
      fakedb[roomId].io.emit('playersUpdated', fakedb[roomId].players);
    }, 3000);
  }
};
