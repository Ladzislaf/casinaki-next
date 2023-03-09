import React, { useContext, useState } from 'react'
import { Context } from '../..'
import styles from './DiceGame.module.css'
import { MIN_BET } from '../../utils/constants'
import BetMaker from '../BetMaker/BetMaker'

const min = 2, max = 12
const getRand = () => {
	return (Math.floor(Math.random() * (max - min + 1)) + min)
}
const overCoefficients = [1.01, 1.07, 1.18, 1.36, 1.68, 2.35, 3.53, 5.88, 11.8, 35.3, 0]
const underCoefficients = [0, 35.3, 11.8, 5.88, 3.53, 2.35, 1.68, 1.36, 1.18, 1.07, 1.01]

const DiceGame = () => {
	const { user } = useContext(Context)
	const [bet, setBet] = useState(MIN_BET)
	const [state, setState] = useState({ dice: 2, betValue: 7, gameResult: '' })
	const [buttons, setButtons] = useState({ over: true, under: false })

	const rollDice = () => {
		if (user._balance < bet) {
			alert('YOU DON\'T HAVE ENOUGH MONEY, GO TO WORK, LOOSER!')
			return
		}
		let value = getRand()
		if (buttons.over === true) {
			let coefficient = overCoefficients[state.betValue - 2]
			if (value > state.betValue) {
				setState({ ...state, dice: value, gameResult: `+${(bet * coefficient - bet).toFixed(2)}$` })
				user.setBalance(+(user._balance - bet + bet * coefficient).toFixed(2))
			} else {
				setState({ ...state, dice: value, gameResult: `-${bet.toFixed(2)}$` })
				user.setBalance(user._balance - bet)
			}
		} else {
			let coefficient = underCoefficients[state.betValue - 2]
			if (value < state.betValue) {
				setState({ ...state, dice: value, gameResult: `+${(bet * coefficient - bet).toFixed(2)}$` })
				user.setBalance(+(user._balance - bet + bet * coefficient).toFixed(2))
			} else {
				setState({ ...state, dice: value, gameResult: `-${bet.toFixed(2)}$` })
				user.setBalance(user._balance - bet)
			}
		}
	}

	const changeDiceValue = (mode) => {
		if (mode === 'inc') {
			if (state.betValue === 11)
				return
			setState({ ...state, betValue: ++state.betValue })
		} else if (mode === 'dec') {
			if (state.betValue === 3)
				return
			setState({ ...state, betValue: --state.betValue })
		}
	}

	return (
		<div className={styles.container}>
			<h3>dice-game component</h3>
			<h2 style={{ color: '#e24e29' }}>balance: {user._balance.toFixed(2)}$ {state.gameResult}</h2>

			<BetMaker bet={bet} setBet={setBet} />
			<h1>dice: {state.dice}</h1>
			<button className={styles.btn} onClick={() => rollDice()}>roll</button>
			<div className={styles.dicePicker}>
				<div>
					<button className={`${styles.btn} ${buttons.over && styles.clicked}`} onClick={() => setButtons({ over: true, under: false })}>over</button> <br />
					<button className={`${styles.btn} ${buttons.under && styles.clicked}`} onClick={() => setButtons({ over: false, under: true })}>under</button>
				</div>
				<span>{state.betValue}</span>
				<div>
					<button className={styles.btn} onClick={() => changeDiceValue('inc')}>▲</button> <br />
					<button className={styles.btn} onClick={() => changeDiceValue('dec')}>▼</button>
				</div>
			</div>
			<div>{buttons.over ? overCoefficients[state.betValue - 2] : underCoefficients[state.betValue - 2]} x</div>
		</div>
	)
}

export default DiceGame