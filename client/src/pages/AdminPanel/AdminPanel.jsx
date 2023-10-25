import React, { useContext, useEffect, useState } from 'react'
import Button from '../../components/ui/Button'
import { blockUser, getUsersList } from '../../services/http/userAPI'
import { Context } from '../..'
import Heading from '../../components/ui/Heading'

const AdminPanel = () => {
	const { user } = useContext(Context)
	const [usersList, setUsersList] = useState([])

	useEffect(() => {
		getUsersList().then(data => {
			setUsersList(data)
		})
	}, [])

	const blockUserById = userId => {
		blockUser(userId)
			.then(data => {
				alert(data)
				getUsersList().then(data => {
					setUsersList(data)
				})
			})
			.catch(err => {
				console.log(err.response.data)
				alert(err.response.data.message)
			})
	}

	return (
		<>
			<Heading>admin panel</Heading>
			<table>
				<thead>
					<tr>
						<td>id</td>
						<td>user</td>
						<td>action</td>
					</tr>
				</thead>
				<tbody>
					{usersList.map((el, i) => {
						return (
							<tr key={i}>
								<td>{el.id}</td>
                                <td style={{ color: el.username === user.user.username && '#f87d09' }}>
                                    {el.username} {el.username === user.user.username && '(you)'}
                                </td>
                                <td>
                                    <Button height={'2rem'} onClick={() => blockUserById(el.id)} disabled={el.username === user.user.username}>
                                        {el.role === 'BLOCKED' ? 'unblock' : 'block'}
                                    </Button>
                                </td>
							</tr>
						)
					})}
				</tbody>
			</table>
		</>
	)
}

export default AdminPanel
