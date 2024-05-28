'use client';
import clsx from 'clsx';
import BetMaker from '@/ui/BetMaker/BetMaker';
import styles from './dice.module.scss';
import playDiceAction from '@/actions/playDiceAction';
import Button from '@/ui/Button';
import { useContext, useState } from 'react';
import { useSession } from 'next-auth/react';
import { CurrentPlayerContext, PlayerContextType } from '@/app/Providers';
import { MIN_BET } from '@/lib/constants';
import { overDiceCoefficients, underDiceCoefficients } from '@/lib/constants';

export default function Dice() {
	const session = useSession();
	const playerEmail = session.data?.user?.email as string;
	const { updateBalance } = useContext(CurrentPlayerContext) as PlayerContextType;

	const [bet, setBet] = useState(MIN_BET);
	const [state, setState] = useState({ dice: 0, diceValue: 7, gameResult: '' });
	const [buttons, setButtons] = useState({ over: true, under: false });
	const [rollButtonDisable, setRollButtonDisable] = useState(false);

	function rollDice() {
		setRollButtonDisable(true);
		playDiceAction(bet, state.diceValue, buttons.over ? 'over' : 'under', playerEmail)
			.then((res) => {
				const gameRes = res?.gameResult as string;
				setState({
					...state,
					dice: res?.diceResult as number,
					gameResult: gameRes,
				});
				updateBalance(res?.newBalance as string);
			})
			.finally(() => {
				setRollButtonDisable(false);
			});
	}

	const changeDiceValue = (mode: string) => {
		if (mode === 'inc') {
			if (state.diceValue === 11) return;
			setState({ ...state, diceValue: ++state.diceValue });
		} else if (mode === 'dec') {
			if (state.diceValue === 3) return;
			setState({ ...state, diceValue: --state.diceValue });
		}
	};

	return (
		<div className={styles.dice}>
			<h1>Dice game</h1>
			<BetMaker bet={bet} setBet={setBet} />
			<Button onClick={() => rollDice()} disabled={rollButtonDisable || !session.data?.user}>
				Roll
			</Button>
			<div className={styles.gameContainer}>
				<div className={styles.gameModeButtons}>
					<Button
						background={clsx(buttons.over && '#00800080')}
						onClick={() => setButtons({ over: true, under: false })}
					>
						over
					</Button>{' '}
					<Button
						background={clsx(buttons.under && '#00800080')}
						onClick={() => setButtons({ over: false, under: true })}
					>
						under
					</Button>
				</div>
				<div className={styles.diceValue}>{state.diceValue}</div>
				<div>
					<Button onClick={() => changeDiceValue('inc')}>▲</Button> <br />
					<Button onClick={() => changeDiceValue('dec')}>▼</Button>
				</div>
			</div>
			<div>
				Game coefficient:{' '}
				{buttons.over ? overDiceCoefficients[state.diceValue - 2] : underDiceCoefficients[state.diceValue - 2]} x
			</div>
			{state.dice > 0 && (
				<>
					<h2>{`Result: ${state.dice}`}</h2>
					<h2>{state.gameResult}</h2>
				</>
			)}
		</div>
	);
}
