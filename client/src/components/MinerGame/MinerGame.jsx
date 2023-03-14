import React, { useContext, useState } from 'react'
import { Context } from '../..'
import { MIN_BET } from '../../utils/constants'
import BetMaker from '../BetMaker/BetMaker'
import styles from './MinerGame.module.css'

const cells = [
	[1, 2, 3, 4, 5],
	[6, 7, 8, 9, 10],
	[11, 12, 13, 14, 15],
	[16, 17, 18, 19, 20],
	[21, 22, 23, 24, 25]
]

const MinerGame = () => {
	const [bet, setBet] = useState(MIN_BET)
	const { user } = useContext(Context)

	const clickHandler = (number) => {
		alert(`You picked cell number ${number}, but the game is not ready, please wait`)
	}

	return (
		<div className={styles.container}>
			<h2>miner game</h2>
			<h2 style={{ color: '#F87D09' }}>balance: {user.user.balance.toFixed(2)}$</h2>
			<BetMaker bet={bet} setBet={setBet} />
			<div className={styles.field}>
				{cells.map((row, index) => {
					return <div className={styles.row} key={index}>{
						row.map((cell, index) => {
							return <div className={styles.cell} key={index} onClick={() => clickHandler(cell)}>{cell}</div>
						})
					}</div>
				})}
			</div>
		</div>
	)
}

export default MinerGame