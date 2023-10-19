import React, { useContext } from 'react'
import { Context } from '../..'
import styles from './BetMaker.module.css'
import { GREEN_BTN_COLOR, MAX_BET, MIN_BET } from '../../utils/constants'
import Button from '../Button/Button'

const BetMaker = ({ bet, setBet }) => {
	const { user } = useContext(Context)
	
	const changeBet = (newBet) => {
		if (newBet < MIN_BET)
			setBet(MIN_BET)
		else if (newBet > MAX_BET)
			setBet(MAX_BET)
		else
			setBet(+(newBet.toFixed(2)))
	}

	return (
		<div className={styles.container}>
			<div>
				<Button onClick={() => changeBet(bet - MIN_BET)} width={'50px'} bg={GREEN_BTN_COLOR}>-</Button>
				<span>bet: {bet.toFixed(2)}$</span>
				<Button onClick={() => changeBet(bet + MIN_BET)} width={'50px'} bg={GREEN_BTN_COLOR}>+</Button> <br/>
			</div>

			<Button onClick={() => setBet(MIN_BET)} width={'25%'} bg={GREEN_BTN_COLOR}>min</Button>
			<Button onClick={() => changeBet(+((bet * 2).toFixed(2)))} width={'25%'} bg={GREEN_BTN_COLOR}>x2</Button>
			<Button onClick={() => changeBet(+((bet / 2).toFixed(2)))} width={'25%'} bg={GREEN_BTN_COLOR}>1/2</Button>
			<Button onClick={() => user.user.balance < MIN_BET ? setBet(MIN_BET) : setBet(+(user.user.balance.toFixed(2)))} width={'25%'} bg={GREEN_BTN_COLOR}>all-in</Button>
		</div>
	)
}

export default BetMaker