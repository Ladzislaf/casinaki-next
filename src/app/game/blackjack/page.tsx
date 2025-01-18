'use client';

import { useContext, useState } from 'react';

import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import Card from '@/components/Card/Card';
import { Game, Page } from '@/components/Layout/Containers';
import Button from '@/components/ui/Button';

import playBlackjackAction from '@/actions/playBlackjackAction';
import { PlayerContext, PlayerContextType } from '@/providers/ContextProvider';

import styles from './blackjack.module.scss';

export default function BlackjackGame() {
	const session = useSession();
	const playerEmail = session.data?.user?.email as string;
	const { bet, balance, setBalance } = useContext(PlayerContext) as PlayerContextType;
	const [payout, setPayout] = useState('');
	const [gameStatus, setGameStatus] = useState('betting');
	const [playDisable, setPlayDisable] = useState(false);
	const [dealerHand, setDealerHand] = useState({ cards: [-1, -1], sum: 0 });
	const [playerHand, setPlayerHand] = useState({ cards: [-1, -1], sum: 0 });
	const t = useTranslations('BlackjackGamePage');

	const startGame = () => {
		setPlayDisable(true);
		setPayout('');

		playBlackjackAction({ playerEmail, bet })
			.then((res) => {
				res?.newBalance && setBalance(res.newBalance);
				res?.playerHand && setPlayerHand(res.playerHand);
				res?.dealerHand && setDealerHand(res.dealerHand);
			})
			.finally(() => {
				setGameStatus('playing');
				setPlayDisable(false);
			});
	};

	const getAnotherCard = () => {
		setPlayDisable(true);
		playBlackjackAction({ playerEmail, choice: 'more' })
			.then((res) => {
				res?.playerHand && setPlayerHand(res.playerHand);
				if (res?.dealerHand && res.gameResult) {
					// * player lost
					setDealerHand(res.dealerHand);
					setPayout(res.gameResult);
					setGameStatus('betting');
				}
			})
			.finally(() => {
				setPlayDisable(false);
			});
	};

	const checkResults = () => {
		setPlayDisable(true);
		playBlackjackAction({ playerEmail, choice: 'enough' })
			.then((res) => {
				res?.dealerHand && setDealerHand(res.dealerHand);
				res?.newBalance && setBalance(res.newBalance);
				res?.gameResult && setPayout(res.gameResult);
			})
			.finally(() => {
				setGameStatus('betting');
				setPlayDisable(false);
			});
	};

	const blackJackControls =
		gameStatus === 'betting' ? (
			<>
				<Button onClick={startGame} disabled={!session.data?.user || playDisable || bet > Number(balance)}>
					{t('startGameButton')}
				</Button>
				<h2>{payout}</h2>
			</>
		) : (
			<>
				<Button onClick={getAnotherCard} disabled={playDisable}>
					{t('takeAnotherCardButton')}
				</Button>
				<Button onClick={checkResults} disabled={playDisable}>
					{t('enoughButton')}
				</Button>
			</>
		);

	return (
		<Page>
			<h1>{t('heading')}</h1>

			<Game controls={blackJackControls}>
				<div className={styles.hand}>
					<h3>
						{t('dealer')} ({dealerHand.sum})
					</h3>

					<div>
						{dealerHand.cards.map((cardIndex, index) => {
							return <Card key={index} cardIndex={cardIndex} />;
						})}
					</div>
				</div>

				<div className={styles.hand}>
					<h3>
						{t('player')} ({playerHand.sum})
					</h3>

					<div>
						{playerHand.cards.map((cardIndex, index) => {
							return <Card key={index} cardIndex={cardIndex} />;
						})}
					</div>
				</div>
			</Game>

			<p>Game rules coming soon...</p>
		</Page>
	);
}
