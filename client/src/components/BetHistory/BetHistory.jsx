import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../..'
import { getHistory } from '../../http/appApi'
import styles from './BetHistory.module.css'

const BetHistory = observer(() => {
	const [loading, setLoading] = useState(true)
	const { app } = useContext(Context)

	useEffect(() => {
		getHistory()
			.then(data => {
				app.setHistory(data)
			})
			.finally(() => {
				setLoading(false)
			})
	}, [app])

	if (loading)
		return <div>bets history loading...</div>

	return (
		<div className={styles.container}>
			<h2>bets history</h2>
			<table className={styles.tbl}>
				<thead>
					<tr>
						<td>player</td>
						<td>game</td>
						<td>bet</td>
						<td>coefficient</td>
						<td>winnings</td>
						<td>time</td>
					</tr>
				</thead>
				<tbody>
					{app.betsHistory.slice(0, 100).map((el, i) => {
						return (<tr key={i}>
							<td>{el.user.username}</td>
							<td>{el.game.name}</td>
							<td>{el.bet}</td>
							<td>{el.coefficient}</td>
							<td>{el.winnings}</td>
							<td>{new Date(el.createdAt).toLocaleTimeString()}</td>
						</tr>)
					})}
				</tbody>
			</table>
		</div>
	)
})

export default BetHistory