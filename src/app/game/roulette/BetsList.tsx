'use client';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';

import type { ActiveBet } from './page';

import styles from './roulette.module.scss';

export default function BetsList({ bets, onClear }: { bets: Array<ActiveBet>; onClear?: (choice: 0 | 1 | 2) => void }) {
	const t = useTranslations('RouletteGamePage');

	return (
		<div className={styles['bets-list']}>
			<p>
				<span>{t('playersCount', { count: bets.length })}</span>
				<span>
					{t('totalBets', {
						amount: `$${bets.reduce((prev, curr) => prev + curr.bet, 0).toFixed(2)}`,
					})}
				</span>
			</p>

			<ul>
				{bets.map((bet) => {
					return (
						<li
							key={bet.playerEmail}
							className={clsx({
								[styles.currentPlayerBet]: bet.isCurrentPlayer,
								[styles.losingBet]: bet.isWinning === false,
							})}>
							<span>{bet.playerEmail.substring(0, bet.playerEmail.indexOf('@'))}</span>
							<BetResult bet={bet} />
							{bet.isCurrentPlayer && onClear && <button onClick={() => onClear(bet.choice)}></button>}
						</li>
					);
				})}
			</ul>
		</div>
	);
}

function BetResult({ bet }: { bet: ActiveBet }) {
	let result = '';

	if (bet.isWinning === true && bet.choice === 0) result = `+ $${(bet.bet * 13).toFixed(2)}`;
	else if (bet.isWinning === true && bet.choice !== 0) result = `+ $${bet.bet.toFixed(2)}`;
	else if (bet.isWinning === false) result = `- $${bet.bet.toFixed(2)}`;
	else result = `$${bet.bet.toFixed(2)}`;

	return <span className={styles['bet-amount']}>{result}</span>;
}
