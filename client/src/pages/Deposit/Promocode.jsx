import React, { useContext, useState } from 'react'
import Button from '../../components/ui/Button'
import { Context } from '../..'
import { applyPromo } from '../../services/http/appApi'
import { check } from '../../services/http/userAPI'
import Input from '../../components/ui/Input'

const Promocode = () => {
	const { user } = useContext(Context)
	const [promo, setPromo] = useState('')

	const applyPromocode = () => {
		applyPromo({ promo: promo.toLowerCase() })
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
		<>
			<div>If you are new here, you can use 'kitstart' promocode</div>
			<Input placeholder='promocode' onChange={(e) => setPromo(e.target.value)} />
			<Button onClick={() => applyPromocode()}>apply</Button>
		</>
	)
}

export default Promocode