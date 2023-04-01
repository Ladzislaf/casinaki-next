import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../..'

import styles from './Profile.module.css'

import first from '../../assets/ranks_icons/first.png'
import second from '../../assets/ranks_icons/second.png'
import third from '../../assets/ranks_icons/third.png'
import fourth from '../../assets/ranks_icons/fourth.png'
import fifth from '../../assets/ranks_icons/fifth.png'
import sixth from '../../assets/ranks_icons/sixth.png'

const Profile = observer(() => {
	const { user } = useContext(Context)
	const [userImage, setUserImage] = useState(first)
	
	useEffect(() => {
		if (user._user.rank === 'noob') setUserImage(first)
		else if (user._user.rank === 'lover') setUserImage(second)
		else if (user._user.rank === 'gamer') setUserImage(third)
		else if (user._user.rank === 'wolf') setUserImage(fourth)
		else if (user._user.rank === 'boss') setUserImage(fifth)
		else if (user._user.rank === 'sheikh') setUserImage(sixth)
	}, [user._user.rank])

	return (
		<div className={styles.container}>
			<div>Profile component...</div>
			<div>usename: {user._user.username}</div>
			<div>balance: {user._user.balance}$</div>
			<div>winnings sum: {user._user.winnings}$</div>
			<div>rank: {user._user.rank}</div>
			<img className={styles.img} src={userImage} alt=''/>
		</div>
	)
})

export default Profile