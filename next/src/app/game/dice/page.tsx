'use client';
import { useState } from 'react';
import styles from './dice.module.scss';
import { diceAction } from '@/actions/actions';
import Button from '@/ui/button';

const overDiceCoefficients = [1.07, 1.19, 1.33, 1.52, 1.79, 2.13, 2.67, 3.56, 5.36, 10.67, 0];
const underDiceCoefficients = [0, 10.67, 5.36, 3.56, 2.67, 2.13, 1.79, 1.52, 1.33, 1.19, 1.07];

export default function Dice() {
	const [state, setState] = useState({ dice: 2, diceValue: 7, gameResult: '' });
	const [buttons, setButtons] = useState({ over: true, under: false });
	const [diceDisable, setDiceDisable] = useState(false);

	const rollDice = () => {
		setDiceDisable(true);
		playDice(bet, state.diceValue, buttons.over ? 'over' : 'under')
			.then((data) => {
				check().then((data) => {
					user.setUser(data);
				});
				setState({ ...state, dice: data.diceResult, gameResult: data.gameResult });
			})
			.catch((err) => {
				console.log(err.response.data);
				alert(err.response.data.message);
			})
			.finally(() => [setDiceDisable(false)]);
	};

	const changeDiceValue = (mode) => {
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
			<Button>button</Button>
			<h2>dice game</h2>
			{/* {user.isAuth && (
				<>
					<h2 style={{ color: '#F87D09' }}>
						balance: {user.balance}$ {state.gameResult}
					</h2>
					<BetMaker bet={bet} setBet={setBet} />
				</>
			)} */}
			<h1>dice: {state.dice}</h1>
			<Button bg='green' onClick={() => rollDice()} disabled={diceDisable}>
				roll
			</Button>
			<div
			//  className={styles.dicePicker}
			>
				<div>
					<Button
						bg={buttons.over ? '#0a6b12' : 'green'}
						onClick={() => setButtons({ over: true, under: false })}
						width={'150px'}
					>
						over
					</Button>{' '}
					<br />
					<Button
						bg={buttons.under ? '#0a6b12' : 'green'}
						onClick={() => setButtons({ over: false, under: true })}
						width={'150px'}
					>
						under
					</Button>
				</div>
				<span>{state.diceValue}</span>
				<div>
					<Button bg='green' onClick={() => changeDiceValue('inc')}>
						▲
					</Button>{' '}
					<br />
					<Button bg='green' onClick={() => changeDiceValue('dec')}>
						▼
					</Button>
				</div>
			</div>
			<div>
				{buttons.over ? overDiceCoefficients[state.diceValue - 2] : underDiceCoefficients[state.diceValue - 2]} x
			</div>
		</div>
	);
}
