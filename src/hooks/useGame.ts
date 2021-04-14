import { useCallback, useEffect, useRef, useState } from 'react'
import io, { Socket } from 'socket.io-client'

interface Player {
  name: string;
  isPlaying: boolean;
  isLeader: boolean;
  results: number[];
}

interface PlayersMap {
  [id: string]: Player;
}

interface Room {
  players: PlayersMap;
  isGameRunning: boolean;
}

export default function useGame(roomId: string, userId: string, name: string): Room & {
  switchStatus: () => void;
  roll: () => void;
  myId: string;
} {
  const socket = useRef<Socket>(null);
  const [room, setRoom] = useState<Room>({ isGameRunning: false, players: {} });

  useEffect(() => {
    if (room) {
      // Initialize the socket and register the room
      fetch(`/api/game?room=${roomId}`).finally(() => {
        socket.current = io(`/${roomId}`);

        // subscribe to playersUpdated event to update players list
        socket.current.on('playersUpdated', (players: PlayersMap) => {
          setRoom(prevState => ({ ...prevState, players }));
        });

        // subscribe to gameUpdated event to update game status
        socket.current.on('gameUpdated', ({ isGameRunning }: Room) => {
          setRoom(prevState => ({ ...prevState, isGameRunning }));
        });

        // After register all the events, emit a join action in order to be aware for incoming changes
        socket.current.emit('join', { uid: userId, name });
      });
  
      // Unsuscribe
      return () => {
        if (socket.current) {
          socket.current.emit('leave');

          socket.current.disconnect()
        }
      }
    }
  }, [roomId, userId, name]);

  const switchStatus = useCallback(() => {
    socket.current.emit('switchPlayerStatus');
  }, [socket.current, userId]);

  const roll = useCallback(() => {
    socket.current.emit('roll');
  }, [socket.current, userId]);

  return {
    ...room,
    switchStatus,
    roll,
    myId: socket.current?.id,
  };
}
