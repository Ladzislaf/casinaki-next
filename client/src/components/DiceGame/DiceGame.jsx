import React, { useContext, useState } from 'react'
import { Context } from '../..'
import styles from './DiceGame.module.css'
import { GREEN_BTN_COLOR, MIN_BET, overDiceCoefficients, underDiceCoefficients } from '../../utils/constants'
import BetMaker from '../BetMaker/BetMaker'
import { playDice } from '../../http/playApi'
import { observer } from 'mobx-react-lite'
import { check } from '../../http/userAPI'
import BetHistory from '../BetHistory/BetHistory'
import Button from '../Button/Button'

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
		<div className={styles.container}>
			<h2>dice game</h2>
			{user.isAuth && 
                <>
                    <h2 style={{ color: '#F87D09' }}>balance: {user.balance}$ {state.gameResult}</h2>
                    <BetMaker bet={bet} setBet={setBet} />

                </>
            }
			<h1>dice: {state.dice}</h1>
			<Button bg={GREEN_BTN_COLOR} onClick={() => rollDice()} disabled={diceDisable || !user.isAuth}>roll</Button>
			<div className={styles.dicePicker}>
				<div>
					<Button bg={buttons.over ? '#0a6b12' : GREEN_BTN_COLOR} onClick={() => setButtons({ over: true, under: false })} width={'150px'}>over</Button> <br/>
					<Button bg={buttons.under ? '#0a6b12' : GREEN_BTN_COLOR} onClick={() => setButtons({ over: false, under: true })} width={'150px'}>under</Button>
				</div>
				<span>{state.diceValue}</span>
				<div>
					<Button bg={GREEN_BTN_COLOR} onClick={() => changeDiceValue('inc')}>▲</Button> <br/>
					<Button bg={GREEN_BTN_COLOR} onClick={() => changeDiceValue('dec')}>▼</Button>
				</div>
			</div>
			<div>{buttons.over ? overDiceCoefficients[state.diceValue - 2] : underDiceCoefficients[state.diceValue - 2]} x</div>
			<br/>
			<BetHistory/>
		</div>
	)
})

export default DiceGame