import React, { useContext } from 'react'
import Promocode from './Promocode'
import Button from '../../components/ui/Button'
import { check, getBonus } from '../../services/http/userAPI'
import { Context } from '../..'
import Heading from '../../components/ui/Heading'

const Deposit = () => {
	const { user } = useContext(Context)
	
	const getDailyBonus = () => {
		getBonus()
			.then(data => {
				alert(data)
			})
			.catch(err => {
				alert(err.response.data.message)
			})
			.finally(() => {
				check().then(data => {
					user.setUser(data)
				})
			})
	}

	return (
		<>
			<Promocode/>
			<Heading>daily bonus</Heading>
			<Button onClick={() => getDailyBonus()}>get 1$</Button>
		</>
	)
}

export default Deposit