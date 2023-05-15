import React, { useContext } from 'react'
import styles from './Deposit.module.css'
import Promocode from '../../components/Promocode/Promocode'
import Button from '../../components/Button/Button'
import { check, getBonus } from '../../http/userAPI'
import { Context } from '../..'

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
		<div className={styles.container}>
			<Promocode/>
			<h3>daily bonus</h3>
			<Button onClick={() => getDailyBonus()}>get 1$</Button>
		</div>
	)
}

export default Deposit