import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Context } from '../..'
import { getHistory } from '../../http/appApi'
import { DICE_ROUTE, HI_LOW_ROUTE, MINER_ROUTE, RANKS_ROUTE } from '../../utils/constants'
import Loading from '../Loading/Loading'
import styles from './BetHistory.module.css'

import first from '../../assets/ranks_icons/first.png'
import second from '../../assets/ranks_icons/second.png'
import third from '../../assets/ranks_icons/third.png'
import fourth from '../../assets/ranks_icons/fourth.png'
import fifth from '../../assets/ranks_icons/fifth.png'
import sixth from '../../assets/ranks_icons/sixth.png'

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
		return <Loading />

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
						let rank = el.user.user_profile.rank.name
						let image
						if (rank === 'noob') image = first
						else if (rank === 'lover') image = second
						else if (rank === 'gamer') image = third
						else if (rank === 'wolf') image = fourth
						else if (rank === 'boss') image = fifth
						else if (rank === 'sheikh') image = sixth

						return (<tr key={i}>
							<td className={styles.player}>
								<NavLink className={styles.link} to={RANKS_ROUTE}>
									<img className={styles.img} src={image} alt={''}/>
								</NavLink>
								{rank} {el.user.username}
							</td>
							<td>
								{el.game.name === 'hilow' && <NavLink to={HI_LOW_ROUTE}>{el.game.name}</NavLink>}
								{el.game.name === 'dice' && <NavLink to={DICE_ROUTE}>{el.game.name}</NavLink>}
								{el.game.name === 'miner' && <NavLink to={MINER_ROUTE}>{el.game.name}</NavLink>}
							</td>
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