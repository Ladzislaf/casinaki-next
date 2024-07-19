import clsx from 'clsx';
import styles from './roulette.module.scss';

export default function BetsList({
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
