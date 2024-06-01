'use client';
import clsx from 'clsx';
import BetMaker from '@/ui/BetMaker/BetMaker';
import styles from './Dice.module.scss';
import playDiceAction from '@/actions/playDiceAction';
import Button from '@/ui/Button';
import { useContext, useState } from 'react';
import { useSession } from 'next-auth/react';
import { CurrentPlayerContext, PlayerContextType } from '@/app/Providers';
import { overDiceCoeffs, underDiceCoeffs } from '@/lib/utils';

export default function Dice() {
	const session = useSession();
	const playerEmail = session.data?.user?.email as string;
	const { balance, bet, updateBalance } = useContext(CurrentPlayerContext) as PlayerContextType;
	const [balanceStatus, setBalanceStatus] = useState('');
	const [buttons, setButtons] = useState({ over: true, under: false });
	const [rollButtonDisable, setRollButtonDisable] = useState(false);
	const [activeDice, setActiveDice] = useState(7);
	const [resultDice, setResultDice] = useState(0);

	function rollDice() {
		setRollButtonDisable(true);
		playDiceAction({ playerEmail, bet, activeDice, gameMode: buttons.over ? 'over' : 'under' })
			.then((res) => {
				res?.balanceStatus && setBalanceStatus(res?.balanceStatus);
				res?.diceResult && setResultDice(res?.diceResult);
				res?.newBalance && updateBalance(res?.newBalance);
			})
			.finally(() => {
				setRollButtonDisable(false);
			});
	}

	const changeDiceValue = (mode: string) => {
		if (mode === 'inc') {
			if (activeDice === 11) return;
			setActiveDice((prev) => prev + 1);
		} else if (mode === 'dec') {
			if (activeDice === 3) return;
			setActiveDice((prev) => prev - 1);
		}
	};

	return (
		<div className='gamePage'>
			<div className='mainContainer'>
				<h1>DICE GAME</h1>
				<div className={clsx('gameContainer', styles.diceField)}>
					<div className={styles.gameOptions}>
						<div>
							<Button
								background={clsx({ '#00800080': buttons.over })}
								onClick={() => setButtons({ over: true, under: false })}
							>
								over
							</Button>{' '}
							<Button
								background={clsx({ '#00800080': buttons.under })}
								onClick={() => setButtons({ over: false, under: true })}
							>
								under
							</Button>
						</div>
						<div className={styles.diceValue}>{activeDice}</div>
						<div>
							<Button onClick={() => changeDiceValue('inc')}>▲</Button>
							<Button onClick={() => changeDiceValue('dec')}>▼</Button>
						</div>
					</div>
					<h2>{`Result: [${resultDice}]`}</h2>
				</div>
			</div>

			<BetMaker>
				<Button onClick={() => rollDice()} disabled={rollButtonDisable || !session.data?.user || bet > Number(balance)}>
					Roll dice | {buttons.over ? overDiceCoeffs[activeDice - 2] : underDiceCoeffs[activeDice - 2]}x
				</Button>
				<h2>{balanceStatus}</h2>
			</BetMaker>
		</div>
	);
}
