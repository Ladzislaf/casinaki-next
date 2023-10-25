import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../..'
import first from '../../assets/images/ranks_icons/first.png'
import second from '../../assets/images/ranks_icons/second.png'
import third from '../../assets/images/ranks_icons/third.png'
import fourth from '../../assets/images/ranks_icons/fourth.png'
import fifth from '../../assets/images/ranks_icons/fifth.png'
import sixth from '../../assets/images/ranks_icons/sixth.png'
import Button from '../../components/ui/Button'
import { changeUsername } from '../../services/http/userAPI'
import Heading from '../../components/ui/Heading'
import Logo from '../../components/ui/Logo'
import Input from '../../components/ui/Input'

const Profile = observer(() => {
	const { user } = useContext(Context)
	const [userImage, setUserImage] = useState(first)
	const [newUname, setNewUname] = useState(user._user.username)

	useEffect(() => {
		if (user._user.rank === 'noob') setUserImage(first)
		else if (user._user.rank === 'lover') setUserImage(second)
		else if (user._user.rank === 'gamer') setUserImage(third)
		else if (user._user.rank === 'wolf') setUserImage(fourth)
		else if (user._user.rank === 'boss') setUserImage(fifth)
		else if (user._user.rank === 'sheikh') setUserImage(sixth)
	}, [user._user.rank])

	const changeUname = () => {
		changeUsername(newUname)
			.then(data => {
				user.setUser(data)
			})
			.catch(err => {
				console.log(err.response.data)
				alert(err.response.data.message)
			})
	}

	return (
		<>
			<Heading>Profile</Heading>
			<div>
				<label>
					username: 
					<Input defaultValue={newUname} maxLength={20} onChange={(e) => setNewUname(e.target.value)}/>
				</label>
				<Button onClick={changeUname}>change</Button>
				<div>balance: {user._user.balance}$</div>
				<div>winnings sum: {user._user.winnings}$</div>
				<div>rank: {user._user.rank}</div>
			</div>

			<Logo src={userImage} scale={1.8} bordered/>
		</>
	)
})

export default Profile
