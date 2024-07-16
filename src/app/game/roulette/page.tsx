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
import Input from '@/components/Input/Input';

type ActiveBet = {
	playerEmail: string;
	bet: number;
	choice: 0 | 1 | 2;
	isCurrentPlayer?: boolean;
	isWinning?: boolean;
};

export default function RouletteGame() {
	const session = useSession();
	const playerEmail = session.data?.user?.email as string;
	const { balance, addBalance, substractBalance } = useContext(CurrentPlayerContext) as PlayerContextType;

	const [isConnected, setIsConnected] = useState(false);
	const [transport, setTransport] = useState('N/A');

	const [playerBet, setPlayerBet] = useState(0.1);
	const [playerBetSum, setPlayerBetSum] = useState(0);
	const [isBetsDisabled, setIsBetsDisabled] = useState(true);
	const [gameStatus, setGameStatus] = useState<'betting' | 'spinning'>('betting');

	const [activeBets, setActiveBets] = useState<Array<ActiveBet>>([]);
	const [lastSpins, setLastSpins] = useState<Array<{ id: number; value: number }>>([]);

	const [rollResult, setRollResult] = useState(-1);
	const [countdown, setCountdown] = useState<number>(0);

	useEffect(() => {
		socket.connect();

		function onConnect() {
			setIsConnected(true);
			setTransport(socket.io.engine.transport.name);
			socket.io.engine.on('upgrade', (transport) => {
				setTransport(transport.name);
			});

			setGameStatus('betting');
			socket.emit('rouletteCountdown', rouletteCountdownCb);
		}

		function onDisconnect() {
			setIsConnected(false);
			setTransport('N/A');
		}

		function rouletteCountdownCb(rouletteCountdown: number) {
			setCountdown(rouletteCountdown);
		}

		function onRouletteResult(rouletteResult: number) {
			setGameStatus('spinning');
			setRollResult(rouletteResult);
			setTimeout(() => {
				const choiceResult = Math.floor((rouletteResult + 6) / 7);

				setActiveBets((prev) =>
					prev.map((el) => {
						if (el.choice === choiceResult) {
							return { ...el, isWinning: true };
						}
						return { ...el, isWinning: false };
					})
				);

				// TODO функция сверения баланса с бд и обновления его -> вместо добавить, убрать
				// TODO использовать эту функцию при перезагрузке страницы

				setTimeout(() => {
					setGameStatus('betting');
					setActiveBets([]);
					socket.emit('rouletteCountdown', rouletteCountdownCb);
				}, 3000);

				setLastSpins((prev) =>
					prev.length >= 10
						? [...prev.slice(1), { id: Date.now(), value: rouletteResult }]
						: [...prev, { id: Date.now(), value: rouletteResult }]
				);
			}, 6000);
		}

		function onLastSpins(lastSpins: number[]) {
			setLastSpins(
				lastSpins.map((el, i) => {
					return { id: i, value: el };
				})
			);
		}

		function onWon(winnings: number) {
			setTimeout(() => {
				addBalance(winnings);
			}, 6000);
		}

		function onActiveBets(activeBets: Array<{ playerEmail: string; bet: number; choice: 0 | 1 | 2 }>) {
			setActiveBets(activeBets.map((el) => (el.playerEmail === playerEmail ? { ...el, isCurrentPlayer: true } : el)));
		}

		function onNewBet(newBet: { playerEmail: string; bet: number; choice: 0 | 1 | 2 }) {
			if (newBet.playerEmail === playerEmail) {
				addNewBet({ ...newBet, isCurrentPlayer: true });
				setPlayerBetSum((prev) => prev + newBet.bet);
			} else addNewBet(newBet);
		}

		function onClearBet(betToClear: { playerEmail: string; bet: number; choice: 0 | 1 | 2 }) {
			clearBet(betToClear);
			if (playerEmail === betToClear.playerEmail) {
				setPlayerBetSum((prev) => prev - betToClear.bet);
			}
		}

		socket.on('connect', onConnect);
		socket.on('disconnect', onDisconnect);
		socket.on('rouletteResult', onRouletteResult);
		socket.on('lastSpins', onLastSpins);
		socket.on('activeBets', onActiveBets);
		socket.on('won', onWon);
		socket.on('newBet', onNewBet);
		socket.on('clearBet', onClearBet);

		return () => {
			socket.off('connect', onConnect);
			socket.off('disconnect', onDisconnect);
			socket.off('rouletteResult', onRouletteResult);
			socket.off('lastSpins', onLastSpins);
			socket.off('activeBets', onActiveBets);
			socket.off('won', onWon);
			socket.off('newBet', onNewBet);
			socket.off('clearBet', onClearBet);
			socket.disconnect();
		};
	}, [playerEmail, addBalance]);

	useEffect(() => {
		if (!playerEmail || !isConnected || playerBetSum >= Number(balance) || gameStatus !== 'betting')
			setIsBetsDisabled(true);
		else setIsBetsDisabled(false);
	}, [playerEmail, balance, gameStatus]);

	// * UTILS
	function addNewBet(newBet: { playerEmail: string; bet: number; choice: 0 | 1 | 2; isCurrentPlayer?: boolean }) {
		setActiveBets((prev) => {
			const isBetExists = Boolean(
				prev.filter((el) => el.playerEmail === newBet.playerEmail && el.choice === newBet.choice).length
			);

			if (isBetExists) {
				return prev.map((el) => {
					if (el.playerEmail === newBet.playerEmail && el.choice === newBet.choice) {
						return { ...el, bet: el.bet + newBet.bet };
					}
					return el;
				});
			} else {
				return [...prev, newBet];
			}
		});
	}

	function clearBet(betToClear: { playerEmail: string; choice: 0 | 1 | 2 }) {
		setActiveBets((prev) =>
			prev.filter((el) => el.playerEmail !== betToClear.playerEmail || el.choice !== betToClear.choice)
		);
	}

	// * HANDLERS
	const handleBet = (choice: 0 | 1 | 2) => {
		if (playerBetSum + playerBet > Number(balance)) {
			return;
		}
		socket.emit('makeBet', { playerEmail, bet: playerBet, choice });
	};

	const handleClearBet = (choice: 0 | 1 | 2) => {
		socket.emit('clearBet', { playerEmail, choice });
	};

	const handleChangeBetValue = (value: number) => {
		setPlayerBet(value);
	};

	return (
		<div className={styles.container}>
			<h1>ROULETTE</h1>
			<p className={clsx(styles.connectionType, { [styles.success]: isConnected })}>
				{isConnected ? `connected by ${transport}` : 'disconnected'}
			</p>
			<Roulette rollResult={rollResult} />
			<Countdown initialCountdown={countdown} />

			<div className={styles.block}>
				<div>
					Bet: $
					<Input
						type='number'
						size={4}
						min={0.1}
						max={999999.99}
						step={0.1}
						value={playerBet}
						onChange={(e: any) => handleChangeBetValue(Number(e.target.value))}
					/>
				</div>

				<div>Bet sum: ${playerBetSum.toFixed(2)}</div>

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

			<div className={styles.betMaker}>
				<div>
					<Button onClick={() => handleBet(1)} bgColor='red' disabled={isBetsDisabled}>
						RED
					</Button>
					<BetsList bets={activeBets.filter((el) => el.choice === 1)} onClear={handleClearBet} />
				</div>
				<div>
					<Button onClick={() => handleBet(0)} bgColor='green' disabled={isBetsDisabled}>
						GREEN
					</Button>
					<BetsList bets={activeBets.filter((el) => el.choice === 0)} onClear={handleClearBet} />
				</div>
				<div>
					<Button onClick={() => handleBet(2)} bgColor='black' disabled={isBetsDisabled}>
						BLACK
					</Button>
					<BetsList bets={activeBets.filter((el) => el.choice === 2)} onClear={handleClearBet} />
				</div>
			</div>
		</div>
	);
}

function BetsList({
	bets,
	onClear,
}: {
	bets: Array<{ playerEmail: string; bet: number; choice: 0 | 1 | 2; isCurrentPlayer?: boolean; isWinning?: boolean }>;
	onClear?: (choice: 0 | 1 | 2) => void;
}) {
	return (
		<>
			<ul>
				<p>
					<span>players: {bets.length}</span>
					<span>total bets: ${bets.reduce((prev, curr) => prev + curr.bet, 0).toFixed(2)}</span>
				</p>

				<hr />

				{bets.map((el) => {
					return (
						<li
							key={el.playerEmail}
							className={clsx({
								[styles.currentPlayerBet]: el.isCurrentPlayer,
								[styles.losingBet]: el.isWinning === false,
							})}
						>
							<span>{el.playerEmail}</span>
							<span>
								{el.isWinning === true
									? `+ $${el.bet.toFixed(2)}`
									: el.isWinning === false
									? `- $${el.bet.toFixed(2)}`
									: `$${el.bet.toFixed(2)}`}
								{el.isCurrentPlayer && onClear && <button onClick={() => onClear(el.choice)}>X</button>}
							</span>
						</li>
					);
				})}
			</ul>
		</>
	);
}
