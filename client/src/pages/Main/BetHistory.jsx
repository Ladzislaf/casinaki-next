import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../..'
import { getHistory } from '../../services/http/appApi'
import { DICE_ROUTE, HI_LOW_ROUTE, MINER_ROUTE, RANKS_ROUTE } from '../../utils/constants'
import Loading from '../../components/Loading/Loading'
import first from '../../assets/images/ranks_icons/first.png'
import second from '../../assets/images/ranks_icons/second.png'
import third from '../../assets/images/ranks_icons/third.png'
import fourth from '../../assets/images/ranks_icons/fourth.png'
import fifth from '../../assets/images/ranks_icons/fifth.png'
import sixth from '../../assets/images/ranks_icons/sixth.png'
import Logo from '../../components/ui/Logo'
import Linker from '../../components/ui/Linker'

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
		<>
			<h2>bets history</h2>
			<table>
				<thead>
					<tr>
						<td colSpan={2}>player</td>
						<td>game</td>
						<td>bet</td>
						<td>coeffs</td>
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
							<td>
								<Linker to={RANKS_ROUTE} circled>
									<Logo src={image} scale={0.3} circled bordered/>
								</Linker>
							</td>
							<td>
								{el.user.username}
							</td>
							<td>
								{el.game.name === 'hi-low' && <Linker to={HI_LOW_ROUTE}>{el.game.name}</Linker>}
								{el.game.name === 'dice' && <Linker to={DICE_ROUTE}>{el.game.name}</Linker>}
								{el.game.name === 'miner' && <Linker to={MINER_ROUTE}>{el.game.name}</Linker>}
							</td>
							<td>{el.bet}</td>
							<td>{el.coefficient}</td>
							<td>{el.winnings}</td>
							<td>{new Date(el.createdAt).toLocaleTimeString()}</td>
						</tr>)
					})}
				</tbody>
			</table>
		</>
	)
})

export default BetHistory
