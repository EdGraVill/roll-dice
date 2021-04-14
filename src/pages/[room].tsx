import { useRouter } from 'next/router';
import { toCanvas } from 'qrcode';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useGame, useName } from '../hooks';

function Room({ roomId }: { roomId: string }) {
  const [name, uid] = useName();
  const { isGameRunning, myId, players, roll, switchStatus } = useGame(roomId, uid, name);
  const me = useMemo(() => players[myId], [players, myId]);
  const currentUrl = useMemo(() => globalThis?.window?.location.toString(), []);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      toCanvas(canvasRef.current, currentUrl)
    }
  }, [canvasRef, currentUrl]);

  return (
    <div>
      <h1>Hello {name}</h1>
      {me?.isLeader && (
        <button disabled={isGameRunning} onClick={roll}>Roll</button>
      )}
      <div>
        {Object.keys(players).map((playerId) => {
          const player = players[playerId];
          const result = player.results.length ? player.results[player.results.length - 1] : '';

          return (
            <div key={playerId}>
              <h2>{player.name}</h2>
              <p>
                Status: {player.isPlaying ? 'Player' : 'Viewer'}
                {playerId === myId && <button disabled={isGameRunning} onClick={switchStatus}>Switch</button>}
              </p>
              <p>LAST RESULT: {isGameRunning && player.isPlaying ? 'Rolling...' : result}</p>
            </div>
          );
        })}
      </div>
      <div>
        <h3>Invite Others</h3>
        <a href={currentUrl}>{currentUrl}</a><br />
        <canvas ref={canvasRef} />
      </div>
    </div>
  )
}

export default function Game() {
  const { query } = useRouter();
  const roomId = useMemo(() => query.room as string, [query]);
  const [name, uid, setName] = useName();
  const [tempName, setTempName] = useState('');

  const join = () => {
    if (tempName.length) {
      setName(tempName);
    } else {
      alert('Please provide your name');
    }
  }

  if (!name) {
    return (
      <div>
        <h2>What's your name?</h2>
        <input placeholder="Name" value={tempName} onChange={event => setTempName(event.currentTarget.value)} />
        <button onClick={join}>Join</button>
      </div>
    );
  }

  return <Room roomId={roomId} />;
}
