'use client';
import BetMaker from '@/components/BetMaker/BetMaker';
import styles from './blackjack.module.scss';
import { useSession } from 'next-auth/react';
import { useContext, useState } from 'react';
import { PlayerContext, PlayerContextType } from '@/providers/ContextProvider';
import Button from '@/components/Button/Button';
import Card from '@/components/Card/Card';
import playBlackjackAction from '@/actions/playBlackjackAction';
import { useTranslations } from 'next-intl';

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

	return (
		<div className='gamePage'>
			<div>
				<h1>{t('heading')}</h1>

				<div className={styles.jackField}>
					<div>
						<h3>
							{t('dealer')} ({dealerHand.sum})
						</h3>
						<div>
							{dealerHand.cards.map((cardIndex, index) => {
								return <Card key={index} cardIndex={cardIndex} />;
							})}
						</div>
					</div>

					<div>
						<h3>
							{t('player')} ({playerHand.sum})
						</h3>
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
						{t('startGameButton')}
					</Button>
				) : (
					<>
						<Button onClick={getAnotherCard} disabled={playDisable}>
							{t('takeAnotherCardButton')}
						</Button>
						<Button onClick={checkResults} disabled={playDisable}>
							{t('enoughButton')}
						</Button>
					</>
				)}
				<h2>{payout}</h2>
			</BetMaker>
		</div>
	);
}
