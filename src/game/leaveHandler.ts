import { Server, Socket } from 'socket.io';
import { FakeDB } from './types';

export default (fakedb: FakeDB, io: Server, socket: Socket, roomId: string) => () => {
  // If the user is the owner and there's more users. Make owner the second in the list
  if (fakedb[roomId].players?.[socket.id]?.isLeader && Object.keys(fakedb[roomId].players).length > 1) {
    const nextLeaderId = Object.keys(fakedb[roomId].players).filter(playerId => playerId !== socket.id)[0];

    fakedb[roomId].players[nextLeaderId].isLeader = true;
  }

  // Remove the player from the list
  delete fakedb[roomId].players[socket.id];

  if (Object.keys(fakedb[roomId].players).length === 0) {
    // If is the last player, deleve the room
    io._nsps.delete(`/${roomId}`);
  } else {
    // Notify all other players that players list changed
    fakedb[roomId].io.emit('playersUpdated', fakedb[roomId].players);
  }
};
