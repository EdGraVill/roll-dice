import { Namespace } from 'socket.io';

export interface Player {
  name: string;
  isPlaying: boolean;
  isLeader: boolean;
  results: number[];
  uid: string;
}

export interface Room {
  players: {
    [id: string]: Player
  };
  io: Namespace;
  isGameRunning: boolean;
}

export type FakeDB = Record<string, Room>;
