import React, { useState, useContext } from 'react'
import { Context } from '../..'
import styles from './HiLowGame.module.css'
import { MIN_BET } from '../../utils/constants'
import BetMaker from '../BetMaker/BetMaker'
import { getRand } from '../../utils/functions'
import { playHiLow } from '../../http/playApi'
import { observer } from 'mobx-react-lite'
import { check } from '../../http/userAPI'
import BetHistory from '../BetHistory/BetHistory'
import Button from '../Button/Button'
import { getCardsDeck } from '../../utils/functions'
import { GREEN_BTN_COLOR } from '../../utils/constants'
import Card from '../Card/Card'

const cards = getCardsDeck()

const HiLowGame = observer(() => {
	const { user } = useContext(Context)
	const [bet, setBet] = useState(MIN_BET)
	const [state, setState] = useState({ card: getRand(0, 51), status: '', totalCoefficient: 1, currentBet: bet })
	const [coefficients, setCoefficients] = useState({ higher: 1, lower: 1 })
	const [gameState, setGameState] = useState('betting')
	const [playDisable, setPlayDisable] = useState(false)

	const startGameHandler = () => {
		check().then(data => {
			user.setUser(data)
			if (data.role === 'BLOCKED') {
				alert('sorry, you have been blocked by admin')
				return
			} else {
				playHiLow({ bet: bet, card: state.card })
					.then(data => {
						user.setUserBalance(user.balance - bet)
						if (data.status) {
							setState({ ...state, status: data.status, currentBet: bet })
							setGameState('playing')
							setCoefficients({ higher: data.coefficients.hCoefficient, lower: data.coefficients.lCoefficient })
						}
					})
					.catch(err => {
						console.log(err.response.data)
						alert(err.response.data.message)
					})
				}
		})
	}

	const playHandler = (mode) => {
		setPlayDisable(true)
		playHiLow({ mode })
			.then(data => {
				if (data.coefficients) {
					setState({ ...state, card: data.newCard, totalCoefficient: data.coefficients.tCoefficient })
					setCoefficients({ higher: data.coefficients.hCoefficient, lower: data.coefficients.lCoefficient })
				} else {
					setState({ ...state, card: data.newCard, totalCoefficient: 1 })
					setGameState('betting')
				}
			})
			.catch(err => {
				console.log(err.response.data)
				alert(err.response.data.message)
			})
			.finally(() => {
				setPlayDisable(false)
			})
	}

	const cashOutHandler = () => {
		playHiLow({})
			.then(data => {
				user.setUserBalance(data.newBalance)
				setState({ ...state, status: data.status, totalCoefficient: 1 })
				setGameState('betting')
			})
			.catch(err => {
				console.log(err.response.data)
				alert(err.response.data.message)
			})
	}

	const checkButtons = (mode) => {
		switch (mode) {
			case 'higher':
				if (cards[state.card].value === 13) return 'same'
				else if (cards[state.card].value === 1) return 'higher'
				else return 'higher or same'
			case 'lower':
				if (cards[state.card].value === 1) return 'same'
				else if (cards[state.card].value === 13) return 'lower'
				else return 'lower or same'
			default: console.log('Error: no such mode in checkName function')
		}
	}

	return (
		<div className={styles.container}>
			<h2>higher-lower game</h2>
			<h2 style={{ color: '#F87D09' }}>balance: {user.balance}$ {state.status}</h2>
			<BetMaker bet={bet} setBet={setBet} />
			{gameState === 'playing' ?
				<>
					<div>
						<Button onClick={() => playHandler('low')} disabled={playDisable} width={'160px'} bg={GREEN_BTN_COLOR}>
							{checkButtons('lower')} <br />
							{coefficients.lower.toFixed(2)}x <br />
						</Button>
						<Button onClick={() => playHandler('high')} disabled={playDisable} width={'160px'} bg={GREEN_BTN_COLOR}>
							{checkButtons('higher')} <br />
							{coefficients.higher.toFixed(2)}x <br />
						</Button>
					</div>
					<Card cardIndex={state.card}/>
					<Button onClick={() => cashOutHandler()} disabled={state.totalCoefficient === 1} bg={GREEN_BTN_COLOR}>
						cash out <br />
						{(state.currentBet * state.totalCoefficient).toFixed(2)}$ <br />
						{state.totalCoefficient.toFixed(2)}x
					</Button>
				</>
				: <>
					<Button onClick={() => { startGameHandler() }} bg={GREEN_BTN_COLOR}>play</Button>
					<Card cardIndex={state.card}/>
					<Button onClick={() => setState({ ...state, card: getRand(0, 51) })} bg={GREEN_BTN_COLOR}>change card</Button>
				</>
			}
			<br/>
			<BetHistory/>
		</div>
	)
})

export default HiLowGame