import React, { useContext, useState } from 'react'
import { Context } from '../..'
import { MIN_BET } from '../../utils/constants'
import BetMaker from '../BetMaker/BetMaker'
import styles from './MinerGame.module.css'

const MinerGame = () => {
	const [bet, setBet] = useState(MIN_BET)
	const { user } = useContext(Context)
	return (
		<div className={styles.container}>

			<h2>miner game</h2>
			<h2 style={{ color: '#F87D09' }}>balance: {user.user.balance.toFixed(2)}$</h2>
			<BetMaker bet={bet} setBet={setBet} />
		</div>
	)
}

export default MinerGame