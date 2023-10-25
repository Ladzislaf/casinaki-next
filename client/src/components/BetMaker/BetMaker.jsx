import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../..'
import styles from './BetMaker.module.css'
import { MAX_BET, MIN_BET } from '../../utils/constants'
import Button from '../ui/Button'
import Heading from '../ui/Heading'

const BetMaker = ({ bet, setBet, balanceChanges }) => {
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
			<Heading style={{ color: '#F87D09' }}>balance: {user.balance}$ {balanceChanges}</Heading>
			
			<div>
				<Button onClick={() => changeBet(bet - betStep)}>-</Button>
				<span>bet: {bet.toFixed(2)}$</span>
				<Button onClick={() => changeBet(bet + betStep)}>+</Button>
			</div>

			<div>
				<Button onClick={() => setBet(MIN_BET)} style={{ width: '6rem' }}>min</Button>
				<Button onClick={() => changeBet(+((bet * 2).toFixed(2)))} style={{ width: '6rem' }}>x2</Button>
				<Button onClick={() => changeBet(+((bet / 2).toFixed(2)))} style={{ width: '6rem' }}>1/2</Button>
				<Button onClick={() => user.balance < MIN_BET ? setBet(MIN_BET) : setBet(user.balance)} style={{ width: '6rem' }}>all-in</Button>
			</div>
		</div>
	)
}

export default BetMaker