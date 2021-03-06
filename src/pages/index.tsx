import { generate } from 'randomstring';
import { useCallback, useState } from 'react';
import { useRouter } from 'next/router'
import { useName } from '../hooks';

export default function Home() {
  const [name, uid, setName] = useName();
  const [room, setRoom] = useState('');
  const { push } = useRouter();

  const createNewRoom = useCallback(() => {
    if (!name) {
      return alert('Please provide your name');
    }

    push(`/${generate(10)}`);
  }, [])

  const joinRoom = () => {
    if (!name) {
      return alert('Please provide your name');
    }

    if (room && room.length > 6) {
      push(`/${room}`);
    } else {
      alert('Room ID should contain at least 7 charts');
    }
  };

  return (
    <div>
      <input placeholder="Name" value={name} onChange={event => setName(event.currentTarget.value)} />
      <button onClick={createNewRoom}>Create New Room</button>
      <div>
        <input placeholder="Room ID" value={room} onChange={event => setRoom(event.currentTarget.value)} />
        <button onClick={joinRoom}>Join Room</button>
      </div>
    </div>
  );
}
