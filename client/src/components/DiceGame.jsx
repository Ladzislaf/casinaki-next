import React, { useContext, useState } from 'react'
import { Context } from '..'
import styles from '../style/DiceGame.module.css'
import { MIN_BET } from '../utils/constants'
import BetMaker from './BetMaker'

const min = 2, max = 12
const getRand = () => {
	return (Math.floor(Math.random() * (max - min + 1)) + min)
}

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
			if (value > state.betValue) {
				setState({ ...state, dice: value, gameResult: `+${(bet * 2 - bet).toFixed(2)}$` })
				user.setBalance(user._balance - bet + bet * 2)
			} else {
				setState({ ...state, dice: value, gameResult: `-${bet.toFixed(2)}$` })
				user.setBalance(user._balance - bet)
			}
		} else {
			if (value < state.betValue) {
				setState({ ...state, dice: value, gameResult: `+${(bet * 2 - bet).toFixed(2)}$` })
				user.setBalance(user._balance - bet + bet * 2)
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
		</div>
	)
}

export default DiceGame