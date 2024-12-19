'use client';
import BetMaker from '@/components/BetMaker/BetMaker';
import styles from './poker.module.scss';
import clsx from 'clsx';
import {useSession} from 'next-auth/react';
import {useContext, useState} from 'react';
import {PlayerContext, PlayerContextType} from '@/providers/ContextProvider';
import Button from '@/components/Button/Button';
import Card from '@/components/Card/Card';
import playPokerAction from '@/actions/playPokerAction';
import {useTranslations} from 'next-intl';

const pokerCombitanions: {name: string; coeff: number}[] = [
	{name: 'royalFlush', coeff: 800},
	{name: 'straightFlush', coeff: 60},
	{name: 'fourOfAKind', coeff: 22},
	{name: 'fullHouse', coeff: 9},
	{name: 'flush', coeff: 6},
	{name: 'straight', coeff: 4},
	{name: 'threeOfAKind', coeff: 3},
	{name: 'twoPairs', coeff: 2},
	{name: 'pair', coeff: 1},
];

export default function PokerGame() {
	const session = useSession();
	const playerEmail = session.data?.user?.email as string;
	const {bet, balance, setBalance} = useContext(PlayerContext) as PlayerContextType;
	const [payout, setPayout] = useState('');
	const [gameStatus, setGameStatus] = useState('betting');
	const [playDisable, setPlayDisable] = useState(false);
	const [playerHand, setPlayerHand] = useState([1, 49, 45, 41, 37]);
	const [holdCards, setHoldCards] = useState<number[]>([]);
	const [activeCombination, setActiveCombination] = useState(0);
	const t = useTranslations('PokerGamePage');

	const startGame = () => {
		setPlayDisable(true);
		setPayout('');
		setActiveCombination(0);

		playPokerAction({playerEmail, bet})
			.then(res => {
				res?.newBalance && setBalance(res.newBalance);
				res?.playerHand && setPlayerHand(res.playerHand);
			})
			.finally(() => {
				setGameStatus('playing');
				setPlayDisable(false);
				setHoldCards([]);
			});
	};

	const dealCards = () => {
		setPlayDisable(true);
		playPokerAction({playerEmail, holdCards})
			.then(res => {
				res?.playerHand && setPlayerHand(res.playerHand);
				res?.newBalance && setBalance(res.newBalance);
				res?.gameResult && setPayout(res.gameResult);
				res?.combination && setActiveCombination(res.combination);
			})
			.finally(() => {
				setGameStatus('betting');
				setPlayDisable(false);
			});
	};

	const clickCardHandler = (cardIndex: number) => {
		if (holdCards.includes(cardIndex)) {
			setHoldCards(holdCards.filter(el => el !== cardIndex));
		} else {
			setHoldCards([...holdCards, cardIndex]);
		}
	};

	return (
		<div className="gamePage">
			<div>
				<h1>{t('heading')}</h1>

				<table className={styles.combinationTable}>
					<tbody>
						{pokerCombitanions.map((el, i) => {
							return (
								<tr
									key={i}
									className={clsx({
										[styles.active]: activeCombination - 1 === i,
									})}>
									<td>{t(`combinations.${el.name}`)}</td>
									<td>{el.coeff}x</td>
									<td>{(el.coeff * bet).toFixed(2)}$</td>
								</tr>
							);
						})}
					</tbody>
				</table>

				<div className={styles.playerHand}>
					{playerHand.map((cardIndex, i) => {
						return (
							<Card
								className={clsx({[styles.hold]: holdCards.includes(cardIndex)})}
								onClick={() => clickCardHandler(cardIndex)}
								key={i}
								cardIndex={cardIndex}
							/>
						);
					})}
				</div>
			</div>

			<BetMaker>
				{gameStatus === 'betting' ? (
					<Button onClick={startGame} disabled={!session.data?.user || playDisable || bet > Number(balance)}>
						{t('startGameButton')}
					</Button>
				) : (
					<>
						<Button onClick={dealCards} disabled={playDisable}>
							{t('dealButton')}
						</Button>
					</>
				)}
				<h2>{payout}</h2>
			</BetMaker>
		</div>
	);
}
