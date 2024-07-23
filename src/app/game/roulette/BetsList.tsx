'use client';
import clsx from 'clsx';
import styles from './roulette.module.scss';
import { useTranslations } from 'next-intl';
import type { ActiveBet } from './page';

export default function BetsList({ bets, onClear }: { bets: Array<ActiveBet>; onClear?: (choice: 0 | 1 | 2) => void }) {
	const t = useTranslations('RouletteGamePage');

	return (
		<>
			<ul>
				<p>
					<span>{t('playersCount', { count: bets.length })}</span>
					<span>{t('totalBets', { amount: `$${bets.reduce((prev, curr) => prev + curr.bet, 0).toFixed(2)}` })}</span>
				</p>

				<hr />

				{bets.map((bet) => {
					return (
						<li
							key={bet.playerEmail}
							className={clsx({
								[styles.currentPlayerBet]: bet.isCurrentPlayer,
								[styles.losingBet]: bet.isWinning === false,
							})}
						>
							<span>{bet.playerEmail.substring(0, bet.playerEmail.indexOf('@'))}</span>
							<span>
								<BetResult bet={bet} />
								{bet.isCurrentPlayer && onClear && <button onClick={() => onClear(bet.choice)}>X</button>}
							</span>
						</li>
					);
				})}
			</ul>
		</>
	);
}

function BetResult({ bet }: { bet: ActiveBet }) {
	if (bet.isWinning === true && bet.choice === 0) return `+ $${(bet.bet * 13).toFixed(2)}`;
	if (bet.isWinning === true && bet.choice !== 0) return `+ $${bet.bet.toFixed(2)}`;
	if (bet.isWinning === false) return `- $${bet.bet.toFixed(2)}`;
	return `$${bet.bet.toFixed(2)}`;
}
