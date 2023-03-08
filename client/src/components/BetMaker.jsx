import React, { useContext } from 'react'
import { Context } from '..'
import styles from '../style/BetMaker.module.css'
import { MAX_BET, MIN_BET } from '../utils/constants'

const BetMaker = ({ bet, setBet }) => {
	const { user } = useContext(Context)
	
	const changeBet = (newBet) => {
		if (newBet < MIN_BET)
			setBet(MIN_BET)
		else if (newBet > MAX_BET)
			setBet(MAX_BET)
		else
			setBet(+newBet.toFixed(2))
	}

	return (
		<div className={styles.container}>
			<div>
				<button className={`${styles.btn} ${styles.little}`} onClick={() => changeBet(bet - MIN_BET)}>-</button>
				<span>bet: {bet.toFixed(2)}$</span>
				<button className={`${styles.btn} ${styles.little}`} onClick={() => changeBet(bet + MIN_BET)}>+</button> <br />
			</div>

			<button className={styles.btn} onClick={() => setBet(MIN_BET)}>min</button>
			<button className={styles.btn} onClick={() => changeBet(bet * 2)}>x2</button>
			<button className={styles.btn} onClick={() => changeBet(bet / 2)}>1/2</button>
			<button className={styles.btn} onClick={() => user._balance < MIN_BET ? setBet(MIN_BET) : setBet(user._balance)}>all-in</button>
		</div>
	)
}

export default BetMaker