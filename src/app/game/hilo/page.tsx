'use client';
import React, {useContext, useEffect, useState} from 'react';
import {useSession} from 'next-auth/react';
import {PlayerContext, PlayerContextType} from '@/providers/ContextProvider';
import styles from './hilo.module.scss';
import BetMaker from '../../../components/BetMaker/BetMaker';
import Button from '@/components/Button/Button';
import Card from '@/components/Card/Card';
import {calcHiloChances, calcHiloCoeff, genCardsDeck, getRand} from '@/utils/utils';
import playHiloAction from '@/actions/playHiloAction';
import {useTranslations} from 'next-intl';

const cardsDeck = genCardsDeck('hilo');

export default function Hilo() {
	const session = useSession();
	const playerEmail = session.data?.user?.email as string;
	const {balance, bet, setBalance} = useContext(PlayerContext) as PlayerContextType;
	const [activeCardIndex, setActiveCardIndex] = useState(-1);
	const [cardsHistory, setCardsHistory] = useState([-1]);
	const [coeffs, setCoeffs] = useState({hi: 1, lo: 1, total: 1});
	const [chances, setChances] = useState({hi: '50', lo: '50'});
	const [activeBet, setActiveBet] = useState(bet);
	const [payout, setPayout] = useState('');
	const [gameState, setGameState] = useState('betting');
	const [playDisable, setPlayDisable] = useState(false);
	const t = useTranslations('HiloGamePage');

	useEffect(() => {
		setActiveCardIndex(getRand(0, 51));
	}, []);

	const startGameHandler = () => {
		setPlayDisable(true);
		setCardsHistory([52]);
		setPayout('');

		playHiloAction({playerEmail, bet, cardIndex: activeCardIndex})
			.then(res => {
				setCoeffs({
					hi: calcHiloCoeff(activeCardIndex, 'higher'),
					lo: calcHiloCoeff(activeCardIndex, 'lower'),
					total: 1,
				});
				setChances({
					hi: calcHiloChances(activeCardIndex, 'higher'),
					lo: calcHiloChances(activeCardIndex, 'lower'),
				});
				setActiveBet(bet);
				res?.newBalance && setBalance(res?.newBalance);
			})
			.finally(() => {
				setGameState('playing');
				setPlayDisable(false);
			});
	};

	const playHandler = (choice: 'higher' | 'lower') => {
		setPlayDisable(true);
		playHiloAction({playerEmail, choice})
			.then(res => {
				if (res?.totalCoeff) {
					addCartToHistory(activeCardIndex);
					setActiveCardIndex(res.newCardIndex);
					setCoeffs({
						hi: calcHiloCoeff(res.newCardIndex, 'higher'),
						lo: calcHiloCoeff(res.newCardIndex, 'lower'),
						total: res.totalCoeff,
					});
					setChances({
						hi: calcHiloChances(res.newCardIndex, 'higher'),
						lo: calcHiloChances(res.newCardIndex, 'lower'),
					});
				} else if (res?.newCardIndex && res.gameResult) {
					addCartToHistory(activeCardIndex);
					setActiveCardIndex(res.newCardIndex);
					setGameState('betting');
					setPayout(res.gameResult);
				}
			})
			.finally(() => {
				setPlayDisable(false);
			});
	};

	const cashOutHandler = () => {
		playHiloAction({playerEmail})
			.then(res => {
				if (res?.newBalance && res.gameResult) {
					setBalance(res.newBalance);
					setPayout(res.gameResult);
				}
			})
			.finally(() => {
				setGameState('betting');
			});
	};

	const getButtonLabel = (mode: 'higher' | 'lower') => {
		switch (mode) {
			case 'higher':
				if (cardsDeck[activeCardIndex].value === 13) return t('same');
				else if (cardsDeck[activeCardIndex].value === 1) return t('higher');
				else return t('higherOrSame');
			case 'lower':
				if (cardsDeck[activeCardIndex].value === 1) return t('same');
				else if (cardsDeck[activeCardIndex].value === 13) return t('lower');
				else return t('lowerOrSame');
			default:
				console.error('[Hi-Low page] Error: no such mode in checkName function');
				return '';
		}
	};

	const addCartToHistory = (cardIndex: number) => {
		cardsHistory[0] === 52 ? setCardsHistory([cardIndex]) : setCardsHistory([...cardsHistory, cardIndex]);
	};

	return (
		<div className={'gamePage'}>
			<div>
				<h1>{t('heading')}</h1>
				<div className={styles.cardsContainer}>
					<div>
						<Card cardIndex={1} cardColor="#222222">
							{t('lowest')}
						</Card>
						<Card cardIndex={activeCardIndex} />
						<Card cardIndex={49} cardColor="#222222">
							{t('highest')}
						</Card>
					</div>
					<div>
						{cardsHistory.map((el, i) => {
							return <Card cardIndex={el} key={i} />;
						})}
					</div>
				</div>
			</div>

			<BetMaker>
				{gameState === 'betting' ? (
					<>
						<Button onClick={startGameHandler} disabled={!session.data?.user || playDisable || bet > Number(balance)}>
							{t('startGameButton')}
						</Button>
						<Button disabled={playDisable} onClick={() => setActiveCardIndex(getRand(0, 51))}>
							{t('skipCardButton')}
						</Button>
					</>
				) : (
					<>
						<Button onClick={() => playHandler('higher')} disabled={playDisable}>
							⇈ {getButtonLabel('higher')} | {chances.hi}% | {coeffs.hi.toFixed(2)}x
						</Button>
						<Button onClick={() => playHandler('lower')} disabled={playDisable}>
							⇊ {getButtonLabel('lower')} | {chances.lo}% | {coeffs.lo.toFixed(2)}x
						</Button>
						<Button onClick={cashOutHandler} disabled={coeffs.total === 1}>
							{coeffs.total.toFixed(2)}x {t('cashOut')} ${(activeBet * coeffs.total).toFixed(2)}
						</Button>
					</>
				)}
				<h2>{payout}</h2>
			</BetMaker>
		</div>
	);
}
