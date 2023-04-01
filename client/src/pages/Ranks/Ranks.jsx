import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect } from 'react'
import { Context } from '../..'
import { fetchRanks } from '../../http/appApi'

import styles from './Ranks.module.css'

import first from '../../assets/ranks_icons/first.png'
import second from '../../assets/ranks_icons/second.png'
import third from '../../assets/ranks_icons/third.png'
import fourth from '../../assets/ranks_icons/fourth.png'
import fifth from '../../assets/ranks_icons/fifth.png'
import sixth from '../../assets/ranks_icons/sixth.png'

const Ranks = observer(() => {
	const { app } = useContext(Context)

	useEffect(() => {
		fetchRanks().then((data) => {
			app.setRanks(data)
		})
	}, [app])

	return (
		<div className={styles.container}>
			<div>Each rank is a kind of level, for which you need to score the required number of points.</div>
			<table className={styles.tbl}>
				<thead>
					<tr>
						<td colSpan={2}>rank</td>
						<td>winnings to achieve</td>
					</tr>
				</thead>
				<tbody>
					{app._ranks.map((el, i) => {
						let image
						if (el.name === 'noob') image = first
						else if (el.name === 'lover') image = second
						else if (el.name === 'gamer') image = third
						else if (el.name === 'wolf') image = fourth
						else if (el.name === 'boss') image = fifth
						else if (el.name === 'sheikh') image = sixth

						return (<tr key={i}>
							<td><img className={styles.img} src={image} alt={''} /></td>
							<td>{el.name}</td>
							<td>{el.value_to_achieve} $</td>
						</tr>)
					})}
				</tbody>
			</table>
		</div>
	)
})

export default Ranks
