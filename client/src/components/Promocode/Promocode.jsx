import React, { useContext, useState } from 'react'

import styles from './Promocode.module.css'
import Button from '../Button/Button'
import { Context } from '../..'
import { applyPromo } from '../../http/appApi'
import { check } from '../../http/userAPI'

const Promocode = () => {
	const { user } = useContext(Context)
	const [promo, setPromo] = useState('')

	const applyPromocode = () => {
		applyPromo({ promo })
			.then(data => {
				alert(`Success! You earned ${data.value}$`)
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
			<div>If you are new here, you can use '/kit start' promocode</div>
			<input className={styles.inp} placeholder='promocode' onChange={(e) => setPromo(e.target.value)} />
			<Button onClick={() => applyPromocode()} width={'300px'} height={'50px'}>apply</Button>
		</div>
	)
}

export default Promocode