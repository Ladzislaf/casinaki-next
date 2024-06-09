'use client';
import BetMaker from '@/ui/BetMaker/BetMaker';
import styles from './BlackjackGame.module.scss';
import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import { useContext, useState } from 'react';
import { CurrentPlayerContext, PlayerContextType } from '@/app/Providers';
import Button from '@/ui/Button';
import Card from '@/ui/Card';
import playBlackjackAction from '@/actions/playBlackjackAction';

export default function BlackjackGame() {
	const session = useSession();
	const playerEmail = session.data?.user?.email as string;
	const { bet, balance, updateBalance } = useContext(CurrentPlayerContext) as PlayerContextType;
	const [payout, setPayout] = useState('');
	const [gameStatus, setGameStatus] = useState('betting');
	const [playDisable, setPlayDisable] = useState(false);
	const [dealerHand, setDealerHand] = useState({ cards: [-1, -1], sum: 0 });
	const [playerHand, setPlayerHand] = useState({ cards: [-1, -1], sum: 0 });

	const startGame = () => {
		setPlayDisable(true);
		setPayout('');

		playBlackjackAction({ playerEmail, bet })
			.then((res) => {
				res?.newBalance && updateBalance(res.newBalance);
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
				if (res?.dealerHand && res.payout) {
					// * player lost
					setDealerHand(res.dealerHand);
					setPayout(res.payout);
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
				res?.newBalance && updateBalance(res.newBalance);
				res?.payout && setPayout(res.payout);
			})
			.finally(() => {
				setGameStatus('betting');
				setPlayDisable(false);
			});
	};

	return (
		<div className='gamePage'>
			<div className='mainContainer'>
				<h1>BLACKJACK GAME</h1>
				<div className={clsx('gameContainer', styles.jackField)}>
					<div>
						<h3>Dealer ({dealerHand.sum})</h3>
						<div>
							{dealerHand.cards.map((cardIndex, index) => {
								return <Card key={index} cardIndex={cardIndex} />;
							})}
						</div>
					</div>

					<div>
						<h3>You ({playerHand.sum})</h3>
						<div>
							{playerHand.cards.map((cardIndex, index) => {
								return <Card key={index} cardIndex={cardIndex} />;
							})}
						</div>
					</div>
				</div>
			</div>
			<BetMaker>
				{gameStatus === 'betting' ? (
					<Button onClick={startGame} disabled={!session.data?.user || playDisable || bet > Number(balance)}>
						Start the game
					</Button>
				) : (
					<>
						<Button onClick={getAnotherCard} disabled={playDisable}>
							Take another card
						</Button>
						<Button onClick={checkResults} disabled={playDisable}>
							Enough
						</Button>
					</>
				)}
				<h2>{payout}</h2>
			</BetMaker>
		</div>
	);
}
