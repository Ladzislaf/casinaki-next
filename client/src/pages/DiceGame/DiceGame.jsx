import React, { useContext, useState } from 'react'
import { Context } from '../..'
import styles from './DiceGame.module.css'
import { GREEN_BTN_COLOR, MIN_BET, overDiceCoefficients, underDiceCoefficients } from '../../utils/constants'
import BetMaker from '../../components/BetMaker/BetMaker'
import { playDice } from '../../services/http/playApi'
import { observer } from 'mobx-react-lite'
import { check } from '../../services/http/userAPI'
import Button from '../../components/ui/Button'
import Heading from '../../components/ui/Heading'

const DiceGame = observer(() => {
	const { user } = useContext(Context)
	const [bet, setBet] = useState(MIN_BET)
	const [state, setState] = useState({ dice: 2, diceValue: 7, gameResult: '' })
	const [buttons, setButtons] = useState({ over: true, under: false })
	const [diceDisable, setDiceDisable] = useState(false)

	const rollDice = () => {
		check()
			.then(data => {
				user.setUser(data)
				if (data.role === 'BLOCKED') {
					alert('sorry, you have been blocked by admin')
					return
				} else {
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
			})
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
		<>
			<Heading>Dice game</Heading>
			{ user.isAuth && <BetMaker bet={bet} setBet={setBet} balanceChanges={state.gameResult} /> }
			
			<span className={styles.sp}>dice: {state.dice}</span>
			<Button onClick={() => rollDice()} disabled={diceDisable || !user.isAuth}>roll</Button>

			<div className={styles.dicePicker}>
				<div>
					<Button width={'5rem'} bg={buttons.over && GREEN_BTN_COLOR} onClick={() => setButtons({ over: true, under: false })}>over</Button> <br/>
					<Button width={'5rem'} bg={buttons.under && GREEN_BTN_COLOR} onClick={() => setButtons({ over: false, under: true })}>under</Button>
				</div>
				<p className={styles.value}><span className={styles.sp}>{state.diceValue}</span></p>
				<div>
					<Button style={{ width: '5rem' }} onClick={() => changeDiceValue('inc')}>▲</Button> <br/>
					<Button style={{ width: '5rem' }} onClick={() => changeDiceValue('dec')}>▼</Button>
				</div>
			</div>

			<Heading>{buttons.over ? overDiceCoefficients[state.diceValue - 2] : underDiceCoefficients[state.diceValue - 2]} x</Heading>
		</>
	)
})

export default DiceGame