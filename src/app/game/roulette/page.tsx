'use client';
import BetMaker from '@/components/BetMaker/BetMaker';
import { useSession } from 'next-auth/react';
import { useContext, useEffect, useState } from 'react';
import { CurrentPlayerContext, PlayerContextType } from '@/app/Providers';
import Button from '@/components/Button/Button';
import Roulette from '@/components/Roulette/Roulette';
import { socket } from '@/utils/socket';
import Countdown from './Countdown';
import styles from './roulette.module.scss';
import clsx from 'clsx';

export default function PokerGame() {
	const session = useSession();
	const { bet, balance, updateBalance } = useContext(CurrentPlayerContext) as PlayerContextType;
	const [payout, setPayout] = useState('');
	const [gameStatus, setGameStatus] = useState('betting');

	const [isConnected, setIsConnected] = useState(false);
	const [transport, setTransport] = useState('N/A');
	const [rollResult, setRollResult] = useState<{ value: number }>({ value: -1 });
	const [lastSpins, setLastSpins] = useState<Array<number>>([]);

	useEffect(() => {
		socket.connect();

		if (socket.connected) {
			onConnect();
		}

		function onConnect() {
			setIsConnected(true);
			setTransport(socket.io.engine.transport.name);

			socket.io.engine.on('upgrade', (transport) => {
				setTransport(transport.name);
			});
		}

		function onDisconnect() {
			setIsConnected(false);
			setTransport('N/A');
		}

		function onRouletteResult(rouletteResult: number) {
			setGameStatus('spinning');
			setRollResult({ value: rouletteResult });
			setTimeout(() => {
				socket.emit('rouletteCountdown');
				setLastSpins((prev) => [...prev.slice(1), rouletteResult]);
				setGameStatus('betting');
			}, 6000);
		}

		function onGetLastSpins(lastSpins: number[]) {
			setLastSpins(lastSpins);
		}

		socket.on('connect', onConnect);
		socket.on('disconnect', onDisconnect);
		socket.on('rouletteResult', onRouletteResult);
		socket.on('getLastSpins', onGetLastSpins);

		return () => {
			socket.off('connect', onConnect);
			socket.off('disconnect', onDisconnect);
			socket.off('rouletteResult', onRouletteResult);
			socket.off('getLastSpins', onGetLastSpins);
			socket.disconnect();
		};
	}, []);

	const isBetsDisable = !session.data?.user || !socket.connected || bet > Number(balance) || gameStatus === 'spinning';

	return (
		<div className='gamePage'>
			<div>
				<h1>ROULETTE</h1>
				<p>{isConnected ? `connected by ${transport}` : 'disconnected'}</p>
				<Roulette rollResult={rollResult} />
				<Countdown />
				<div className={styles.lastSpins}>
					{lastSpins.map((el, i) => (
						<div
							className={clsx({
								[styles.green]: el === 0,
								[styles.red]: el > 0 && el < 8,
								[styles.black]: el > 7 && el < 15,
							})}
							key={`${i}_${el}`}
						>
							{el}
						</div>
					))}
				</div>
			</div>

			<BetMaker>
				<Button disabled={isBetsDisable}>RED</Button>
				<Button disabled={isBetsDisable}>GREEN</Button>
				<Button disabled={isBetsDisable}>BLACK</Button>
				<h2>{payout}</h2>
			</BetMaker>
		</div>
	);
}
