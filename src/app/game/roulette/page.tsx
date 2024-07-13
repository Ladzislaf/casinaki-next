'use client';
import { useSession } from 'next-auth/react';
import { useContext, useEffect, useState } from 'react';
import { CurrentPlayerContext, PlayerContextType } from '@/app/Providers';
import Button from '@/components/Button/Button';
import Roulette from '@/components/Roulette/Roulette';
import { socket } from '@/utils/socket';
import Countdown from './Countdown';
import styles from './roulette.module.scss';
import clsx from 'clsx';
import NewBetMaker from '@/components/NewBetMaker/NewBetMaker';

export default function RouletteGame() {
	const session = useSession();
	const playerEmail = session.data?.user?.email as string;
	const { balance, addBalance, substractBalance } = useContext(CurrentPlayerContext) as PlayerContextType;
	const [gameStatus, setGameStatus] = useState('');
	const [payout, setPayout] = useState('');
	const [isConnected, setIsConnected] = useState(false);
	const [transport, setTransport] = useState('N/A');
	const [rollResult, setRollResult] = useState<{ value: number }>({ value: -1 });
	const [lastSpins, setLastSpins] = useState<Array<{ id: number; value: number }>>([]);
	const [bet, setBet] = useState(0.1);

	useEffect(() => {
		socket.connect();

		function onConnect() {
			setIsConnected(true);
			setGameStatus('betting');
			setTransport(socket.io.engine.transport.name);
			socket.io.engine.on('upgrade', (transport) => {
				setTransport(transport.name);
			});
			playerEmail &&
				socket.emit('join', playerEmail, () => {
					setGameStatus('');
				});
		}

		function onDisconnect() {
			setIsConnected(false);
			setTransport('N/A');
		}

		function onRouletteResult(rouletteResult: number) {
			setGameStatus('');
			setRollResult({ value: rouletteResult });
			setTimeout(() => {
				socket.emit('rouletteCountdown');
				setLastSpins((prev) =>
					prev.length >= 10
						? [...prev.slice(1), { id: Date.now(), value: rouletteResult }]
						: [...prev, { id: Date.now(), value: rouletteResult }]
				);
				setGameStatus('betting');
			}, 6000);
		}

		function onGetLastSpins(lastSpins: number[]) {
			setLastSpins(
				lastSpins.map((el, i) => {
					return { id: i, value: el };
				})
			);
		}

		function onWon(winnings: number) {
			setTimeout(() => {
				setPayout(`+ $${winnings}`);
				addBalance(winnings);
			}, 6000);
		}

		socket.on('connect', onConnect);
		socket.on('disconnect', onDisconnect);
		socket.on('rouletteResult', onRouletteResult);
		socket.on('getLastSpins', onGetLastSpins);
		socket.on('won', onWon);

		return () => {
			socket.off('connect', onConnect);
			socket.off('disconnect', onDisconnect);
			socket.off('rouletteResult', onRouletteResult);
			socket.off('getLastSpins', onGetLastSpins);
			socket.off('won', onWon);
			socket.disconnect();
		};
	}, [playerEmail, addBalance]);

	const playHandler = (choice: 'zero' | 'red' | 'black') => {
		const choices = ['zero', 'red', 'black'];
		socket.emit('makeBet', { playerEmail, bet, choice: choices.indexOf(choice) });
		setGameStatus('');
		setPayout(`- $${bet}`);
		substractBalance(bet);
	};

	return (
		<div className='gamePage'>
			<div>
				<h1>ROULETTE</h1>
				<p>{isConnected ? `connected by ${transport}` : 'disconnected'}</p>
				<Roulette rollResult={rollResult} />
				<Countdown />
				<div className={styles.lastSpins}>
					{lastSpins.map((item) => (
						<div
							className={clsx({
								[styles.green]: item.value === 0,
								[styles.red]: item.value > 0 && item.value < 8,
								[styles.black]: item.value > 7 && item.value < 15,
							})}
							key={item.id}
						>
							{item.value}
						</div>
					))}
				</div>
			</div>

			<NewBetMaker bet={bet} setBet={setBet}>
				<Button
					onClick={() => playHandler('red')}
					disabled={!isConnected || bet > Number(balance) || gameStatus !== 'betting'}
				>
					RED
				</Button>
				<Button
					onClick={() => playHandler('zero')}
					disabled={!isConnected || bet > Number(balance) || gameStatus !== 'betting'}
				>
					GREEN
				</Button>
				<Button
					onClick={() => playHandler('black')}
					disabled={!isConnected || bet > Number(balance) || gameStatus !== 'betting'}
				>
					BLACK
				</Button>
				<h2>{payout}</h2>
			</NewBetMaker>
		</div>
	);
}
