'use client';
import {useSession} from 'next-auth/react';
import {useContext, useEffect, useState} from 'react';
import {PlayerContext, PlayerContextType} from '@/providers/ContextProvider';
import Roulette from '@/components/Roulette/Roulette';
import {socket} from '@/utils/socket';
import Countdown from './Countdown';
import styles from './roulette.module.scss';
import clsx from 'clsx';
import Button from '@/components/Button/Button';
import BetsList from './BetsList';
import LastSpins from './LastSpins';

import ChipBetMaker from '@/components/ChipBetMaker/ChipBetMaker';
import {useTranslations} from 'next-intl';
import {ChipValue} from '@/components/Chip/Chip';

export type ActiveBet = {
	playerEmail: string;
	bet: number;
	choice: 0 | 1 | 2;
	isCurrentPlayer?: boolean;
	isWinning?: boolean;
};

export default function RouletteGame() {
	const session = useSession();
	const playerEmail = session.data?.user?.email as string;
	const {balance, fetchBalance} = useContext(PlayerContext) as PlayerContextType;
	const t = useTranslations('RouletteGamePage');

	const [isConnected, setIsConnected] = useState(false);
	const [transport, setTransport] = useState('N/A');

	const [playerBet, setPlayerBet] = useState<ChipValue>(0.2);
	const [playerBetSum, setPlayerBetSum] = useState(0);
	const [isBetsDisabled, setIsBetsDisabled] = useState(true);
	const [gameStatus, setGameStatus] = useState<'betting' | 'spinning'>('betting');

	const [activeBets, setActiveBets] = useState<Array<ActiveBet>>([]);
	const [lastSpins, setLastSpins] = useState<Array<{id: number; value: number}>>([]);

	const [rollResult, setRollResult] = useState<{value: number}>({value: -1});
	const [countdown, setCountdown] = useState<number>(0);

	useEffect(() => {
		socket.connect();

		function onConnect() {
			setIsConnected(true);
			setTransport(socket.io.engine.transport.name);
			socket.io.engine.on('upgrade', transport => {
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
			setRollResult({value: rouletteResult});
			setTimeout(() => {
				socket.emit('getLastSpins');
				const choiceResult = Math.floor((rouletteResult + 6) / 7);
				setActiveBets(prev => prev.map(el => ({...el, isWinning: el.choice === choiceResult})));

				setTimeout(() => {
					playerEmail && fetchBalance(playerEmail);
					setGameStatus('betting');
					setActiveBets([]);
					setPlayerBetSum(0);
					socket.emit('rouletteCountdown', rouletteCountdownCb);
				}, 3000);
			}, 6000);
		}

		function onLastSpins(lastSpins: number[]) {
			setLastSpins(
				lastSpins.map((el, i) => {
					return {id: i, value: el};
				})
			);
		}

		function onActiveBets(activeBets: Array<{playerEmail: string; bet: number; choice: 0 | 1 | 2}>) {
			setActiveBets(activeBets.map(el => (el.playerEmail === playerEmail ? {...el, isCurrentPlayer: true} : el)));
		}

		function onNewBet(newBet: {playerEmail: string; bet: number; choice: 0 | 1 | 2}) {
			if (newBet.playerEmail === playerEmail) {
				addNewBet({...newBet, isCurrentPlayer: true});
				setPlayerBetSum(prev => prev + newBet.bet);
			} else addNewBet(newBet);
		}

		function onClearBet(betToClear: {playerEmail: string; bet: number; choice: 0 | 1 | 2}) {
			clearBet(betToClear);
			if (playerEmail === betToClear.playerEmail) {
				setPlayerBetSum(prev => prev - betToClear.bet);
			}
		}

		socket.on('connect', onConnect);
		socket.on('disconnect', onDisconnect);
		socket.on('rouletteResult', onRouletteResult);
		socket.on('lastSpins', onLastSpins);
		socket.on('activeBets', onActiveBets);
		socket.on('newBet', onNewBet);
		socket.on('clearBet', onClearBet);

		return () => {
			socket.off('connect', onConnect);
			socket.off('disconnect', onDisconnect);
			socket.off('rouletteResult', onRouletteResult);
			socket.off('lastSpins', onLastSpins);
			socket.off('activeBets', onActiveBets);
			socket.off('newBet', onNewBet);
			socket.off('clearBet', onClearBet);
			socket.disconnect();
		};
	}, [playerEmail, fetchBalance]);

	useEffect(() => {
		if (!playerEmail || !isConnected || playerBetSum >= Number(balance) || gameStatus !== 'betting')
			setIsBetsDisabled(true);
		else setIsBetsDisabled(false);
	}, [playerEmail, isConnected, balance, playerBetSum, gameStatus]);

	// * UTILS
	function addNewBet(newBet: {playerEmail: string; bet: number; choice: 0 | 1 | 2; isCurrentPlayer?: boolean}) {
		setActiveBets(prev => {
			const isBetExists = Boolean(
				prev.filter(el => el.playerEmail === newBet.playerEmail && el.choice === newBet.choice).length
			);

			if (isBetExists) {
				return prev.map(el => {
					if (el.playerEmail === newBet.playerEmail && el.choice === newBet.choice) {
						return {...el, bet: el.bet + newBet.bet};
					}
					return el;
				});
			} else {
				return [...prev, newBet];
			}
		});
	}

	function clearBet(betToClear: {playerEmail: string; choice: 0 | 1 | 2}) {
		setActiveBets(prev =>
			prev.filter(el => el.playerEmail !== betToClear.playerEmail || el.choice !== betToClear.choice)
		);
	}

	// * HANDLERS
	const handleBet = (choice: 0 | 1 | 2) => {
		if (playerBetSum + playerBet > Number(balance)) {
			return;
		}
		socket.emit('makeBet', {playerEmail, bet: playerBet, choice});
	};

	const handleClearBet = (choice: 0 | 1 | 2) => {
		socket.emit('clearBet', {playerEmail, choice});
	};

	return (
		<div className={styles.container}>
			<h1>{t('heading')}</h1>
			<p
				className={clsx(styles.connectionType, {
					[styles.success]: isConnected,
				})}>
				{isConnected ? t('connected', {transport}) : t('disconnected')}
			</p>
			<Roulette rollResult={rollResult} />
			<Countdown initialCountdown={countdown} />

			<div className={styles.block}>
				<ChipBetMaker bet={playerBet} setBet={setPlayerBet} totalBet={playerBetSum} />
				<LastSpins lastSpins={lastSpins} />
			</div>

			<div className={styles.betMaker}>
				<div>
					<Button
						onClick={() => handleBet(1)}
						bgColor="red"
						disabled={isBetsDisabled || playerBet + playerBetSum > balance}>
						{t('buttonRed')}
					</Button>
					<BetsList bets={activeBets.filter(el => el.choice === 1)} onClear={handleClearBet} />
				</div>
				<div>
					<Button
						onClick={() => handleBet(0)}
						bgColor="green"
						disabled={isBetsDisabled || playerBet + playerBetSum > balance}>
						{t('buttonGreen')}
					</Button>
					<BetsList bets={activeBets.filter(el => el.choice === 0)} onClear={handleClearBet} />
				</div>
				<div>
					<Button
						onClick={() => handleBet(2)}
						bgColor="black"
						disabled={isBetsDisabled || playerBet + playerBetSum > balance}>
						{t('buttonBlack')}
					</Button>
					<BetsList bets={activeBets.filter(el => el.choice === 2)} onClear={handleClearBet} />
				</div>
			</div>
		</div>
	);
}
