import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../..'
import styles from './BetMaker.module.css'
import { GREEN_BTN_COLOR, MAX_BET, MIN_BET } from '../../utils/constants'
import Button from '../Button/Button'

const BetMaker = ({ bet, setBet }) => {
	const { user } = useContext(Context)
	const [betStep, setBetStep] = useState(MIN_BET)
	
	useEffect(() => {
		if (bet >= 10000) setBetStep(1000)
		else if (bet >= 3000) setBetStep(500)
		else if (bet >= 1000) setBetStep(100)
		else if (bet >= 300) setBetStep(50)
		else if (bet >= 100) setBetStep(20)
		else if (bet >= 20) setBetStep(5)
		else if (bet >= 5) setBetStep(1)
		else if (bet >= 1) setBetStep(0.5)
		else setBetStep(MIN_BET)
	}, [bet])

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
				<Button onClick={() => changeBet(bet - betStep)} width={'50px'} bg={GREEN_BTN_COLOR}>-</Button>
				<span>bet: {bet.toFixed(2)}$</span>
				<Button onClick={() => changeBet(bet + betStep)} width={'50px'} bg={GREEN_BTN_COLOR}>+</Button> <br/>
			</div>

			<Button onClick={() => setBet(MIN_BET)} width={'25%'} bg={GREEN_BTN_COLOR}>min</Button>
			<Button onClick={() => changeBet(+((bet * 2).toFixed(2)))} width={'25%'} bg={GREEN_BTN_COLOR}>x2</Button>
			<Button onClick={() => changeBet(+((bet / 2).toFixed(2)))} width={'25%'} bg={GREEN_BTN_COLOR}>1/2</Button>
			<Button onClick={() => user.balance < MIN_BET ? setBet(MIN_BET) : setBet(user.balance)} width={'25%'} bg={GREEN_BTN_COLOR}>all-in</Button>
		</div>
	)
}

export default BetMaker