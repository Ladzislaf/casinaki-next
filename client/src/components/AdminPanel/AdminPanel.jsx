import React, { useContext, useEffect, useState } from 'react'
import styles from './AdminPanel.module.css'
import Button from '../Button/Button'
import { blockUser, getUsersList } from '../../http/userAPI'
import { Context } from '../..'

const AdminPanel = () => {
    const { user } = useContext(Context)
    const [usersList, setUsersList] = useState([])

    useEffect(() => {
        getUsersList()
            .then(data => {
                setUsersList(data)
            })
    }, [])

    const blockUserById = (userId) => {
        blockUser(userId)
            .then((data) => {
                alert(data)
                getUsersList()
                    .then(data => {
                        setUsersList(data)
                    })
            })
            .catch(err => {
				console.log(err.response.data)
				alert(err.response.data.message)
			})
    }

	return (
		<div>
			<h3>admin panel</h3>
            <table className={styles.tbl}>
				<thead>
					<tr>
						<td>id</td>
						<td colSpan={2}>user</td>
					</tr>
				</thead>
				<tbody>
					{usersList.map((el, i) => {
						return (<tr key={i}>
							<td>{el.id}</td>
                            {el.username === user.user.username ? 
                                <>
                                    <td style={{color: 'orange'}}>{el.username} (you)</td>
                                    <td></td>
                                </>
                            :
                                <>
                                    <td>{el.username}</td>
                                    <td style={{width: '100px'}}>
                                        <Button onClick={() => blockUserById(el.id)}>{el.role === 'BLOCKED' ? 'unblock' : 'block'}</Button>
                                    </td>
                                </>
                            }
						</tr>)
					})}
				</tbody>
			</table>
		</div>
	)
}

export default AdminPanel
