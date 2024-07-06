'use client';
import BetMaker from '@/components/BetMaker/BetMaker';
import { useSession } from 'next-auth/react';
import { useContext, useEffect, useState } from 'react';
import { CurrentPlayerContext, PlayerContextType } from '@/app/Providers';
import Button from '@/components/Button/Button';
import Roulette from '@/components/Roulette/Roulette';
import { socket } from '@/utils/socket';
import Countdown from './Countdown';

export default function PokerGame() {
	const session = useSession();
	const playerEmail = session.data?.user?.email as string;
	const { bet, balance, updateBalance } = useContext(CurrentPlayerContext) as PlayerContextType;
	const [payout, setPayout] = useState('');
	const [gameStatus, setGameStatus] = useState('betting');
	const [playDisable, setPlayDisable] = useState(false);

	const [isConnected, setIsConnected] = useState(false);
	const [transport, setTransport] = useState('N/A');
	const [rollResult, setRollResult] = useState<{ value: number }>({ value: -1 });

	useEffect(() => {
		socket.connect();

		if (socket.connected) {
			onConnect();
		}

		function onConnect() {
			setIsConnected(true);
			socket.emit('rouletteCountdown');

			setTransport(socket.io.engine.transport.name);

			socket.io.engine.on('upgrade', (transport) => {
				setTransport(transport.name);
			});
		}

		function onDisconnect() {
			setIsConnected(false);
			setTransport('N/A');
		}

		function onRouletteResult(rouletteResult: number, rouletteInterval: number) {
			console.log('rouletteResult', rouletteResult);
			setRollResult({ value: rouletteResult });
			setTimeout(() => socket.emit('rouletteCountdown'), 6000);
		}

		socket.on('connect', onConnect);
		socket.on('disconnect', onDisconnect);
		socket.on('rouletteResult', onRouletteResult);

		return () => {
			socket.off('connect', onConnect);
			socket.off('disconnect', onDisconnect);
			socket.off('rouletteResult', onRouletteResult);
			socket.disconnect();
		};
	}, []);

	return (
		<div className='gamePage'>
			<div>
				<h1>ROULETTE</h1>
				<p>{isConnected ? `connected by ${transport}` : 'disconnected'}</p>
				<Roulette rollResult={rollResult} />
				<Countdown />
			</div>

			<BetMaker>
				{/* <Button disabled={playDisable}>Spin</Button> */}
				<h2>{payout}</h2>
			</BetMaker>
		</div>
	);
}
