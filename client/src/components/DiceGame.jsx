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
	const [state, setState] = useState({ dice: 2 })

	const rollDice = () => {
		let value = getRand()
		setState({ ...state, dice: value })
	}

	return (
		<div className={styles.container}>
			<h3>dice-game component</h3>
			<h2 style={{ color: '#e24e29' }}>balance: {user._balance.toFixed(2)}$</h2>

			<BetMaker bet={bet} setBet={setBet} />
			<h1>dice: {state.dice}</h1>
			<button className={styles.btn} onClick={() => rollDice()}>roll</button>
		</div>
	)
}

export default DiceGame