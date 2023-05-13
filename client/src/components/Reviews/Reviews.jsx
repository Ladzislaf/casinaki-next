import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../..'
import styles from './Reviews.module.css'
import Button from '../Button/Button'
import { deleteReview, getReviews, writeReview } from '../../http/appApi'

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
		<div className={styles.container}>
			<h2>reviews</h2>
			<div className={styles.reviewsArea}>
				{reviews.map((el, index) => {
					if (el.user.username === user.user.username) {
						return (
							<div className={styles.reviewRow} key={index}>
								<div>
									<span style={{ color: 'orange' }}>{el.user.username}</span>: {el.text}
								</div>
								<Button width={'200px'} height={'50px'} onClick={() => removeReview()}>delete</Button>
							</div>
						)
					} else {
						return (
							<div className={styles.reviewRow} key={index}>
								{el.user.username}: {el.text}
							</div>
						)
					}
				})}
			</div>
			{user.isAuth && (
				<div className={styles.inputArea}>
					<textarea placeholder="write a review" rows={3} value={review} onChange={(e) => setReview(e.target.value)} />
					<Button onClick={() => sendReview()}>send</Button>
				</div>
			)}
		</div>
	)
}

export default Reviews
