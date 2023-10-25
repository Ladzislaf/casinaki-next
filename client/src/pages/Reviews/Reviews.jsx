import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../..'
import styles from './Reviews.module.css'
import Button from '../../components/ui/Button'
import { deleteReview, getReviews, writeReview } from '../../services/http/appApi'
import InputArea from '../../components/ui/InputArea'
import Heading from '../../components/ui/Heading'

const Reviews = () => {
	const { user } = useContext(Context)
	const [review, setReview] = useState('')
	const [reviews, setReviews] = useState([])

	useEffect(() => {
		getReviews()
			.then((allReviews) => {
				setReviews(allReviews)
			})
			.catch((err) => {
				console.log(err.response.data)
				alert(err.response.data.message)
			})
	}, [])

	const sendReview = () => {
		writeReview({ review })
			.then((allReviews) => {
				setReviews(allReviews)
				setReview('')
			})
			.catch((err) => {
				console.log(err.response.data)
				alert(err.response.data.message)
			})
			.finally(() => {
			})
	}

	const removeReview = () => {
		deleteReview()
			.then((allReviews) => {
				setReviews(allReviews)
			})
			.catch((err) => {
				console.log(err.response.data)
				alert(err.response.data.message)
			})
	}

	return (
		<>
			<Heading>reviews</Heading>

			<div className={styles.reviewsList}>
				{reviews.map((el, index) => {
					let isCurrentUser = el.user.username === user.user.username
					return (
						<div className={styles.reviewsRow} key={index}>
							<div>
								<span style={{ color: isCurrentUser && 'orange' }}>{el.user.username}</span>: {el.text}
							</div>
							{isCurrentUser && <Button onClick={() => removeReview()} style={{ minWidth: '6rem' }}>delete</Button>}
						</div>
					)
				})}
			</div>

			{user.isAuth && (
				<>
					<InputArea placeholder='write a review' value={review} rows={4} onChange={(e) => setReview(e.target.value)}/>
					<Button onClick={() => sendReview()} width={'calc(100% - 0.4rem)'}>send</Button>
				</>
			)}
		</>
	)
}

export default Reviews
