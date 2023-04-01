import React, { useContext, useState } from 'react'
import { Context } from '../..'
import styles from './DiceGame.module.css'
import { MIN_BET, overDiceCoefficients, underDiceCoefficients } from '../../utils/constants'
import BetMaker from '../BetMaker/BetMaker'
import { playDice } from '../../http/playApi'
import { observer } from 'mobx-react-lite'
import { check } from '../../http/userAPI'

const DiceGame = observer(() => {
	const { user } = useContext(Context)
	const [bet, setBet] = useState(MIN_BET)
	const [state, setState] = useState({ dice: 2, diceValue: 7, gameResult: '' })
	const [buttons, setButtons] = useState({ over: true, under: false })
	const [diceDisable, setDiceDisable] = useState(false)

	const rollDice = () => {
		setDiceDisable(true)
		playDice(bet, state.diceValue, buttons.over ? 'over' : 'under')
			.then(data => {
				check().then(data => {
					user.setUser(data)
				})
				setState({ ...state, dice: data.diceResult, gameResult: data.gameResult })
			})
			.catch(err => {
				console.log(err.response.data)
				alert(err.response.data.message)
			})
			.finally(() => [
				setDiceDisable(false)
			])
	}

	const changeDiceValue = (mode) => {
		if (mode === 'inc') {
			if (state.diceValue === 11)
				return
			setState({ ...state, diceValue: ++state.diceValue })
		} else if (mode === 'dec') {
			if (state.diceValue === 3)
				return
			setState({ ...state, diceValue: --state.diceValue })
		}
	}

	return (
		<div className={styles.container}>
			<h2>dice game</h2>
			<h2 style={{ color: '#F87D09' }}>balance: {user.user.balance}$ {state.gameResult}</h2>

			<BetMaker bet={bet} setBet={setBet} />
			<h1>dice: {state.dice}</h1>
			<button className={styles.btn} onClick={() => rollDice()} disabled={diceDisable}>roll</button>
			<div className={styles.dicePicker}>
				<div>
					<button className={`${styles.btn} ${buttons.over && styles.clicked}`} onClick={() => setButtons({ over: true, under: false })}>over</button> <br />
					<button className={`${styles.btn} ${buttons.under && styles.clicked}`} onClick={() => setButtons({ over: false, under: true })}>under</button>
				</div>
				<span>{state.diceValue}</span>
				<div>
					<button className={styles.btn} onClick={() => changeDiceValue('inc')}>▲</button> <br />
					<button className={styles.btn} onClick={() => changeDiceValue('dec')}>▼</button>
				</div>
			</div>
			<div>{buttons.over ? overDiceCoefficients[state.diceValue - 2] : underDiceCoefficients[state.diceValue - 2]} x</div>
		</div>
	)
})

export default DiceGame