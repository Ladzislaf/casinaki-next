import React, { useState, useContext } from 'react'
import { Context } from '../..'
import styles from './HiLowGame.module.css'
import { MIN_BET } from '../../utils/constants'
import BetMaker from '../BetMaker/BetMaker'
import { getRand } from '../../utils/functions'
import { playHiLow } from '../../http/playApi'
import { observer } from 'mobx-react-lite'
import { check } from '../../http/userAPI'

const suits = ['♠', '♥', '♦', '♣']
const cardValues = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
const cards = []

for (let i = 0; i < cardValues.length; i++) {
	for (let j = 0; j < suits.length; j++) {
		const key = cardValues[i] + suits[j]
		if (suits[j] === '♥' || suits[j] === '♦')
			cards.push({ key: key, value: i + 1, color: 'red' })
		else
			cards.push({ key: key, value: i + 1, color: 'black' })
	}
}

const HiLowGame = observer(() => {
	const { user } = useContext(Context)
	const [bet, setBet] = useState(MIN_BET)
	const [state, setState] = useState({ card: 49, status: '', totalCoefficient: 1, currentBet: bet })
	const [coefficients, setCoefficients] = useState({ higher: 1, lower: 1 })
	const [gameState, setGameState] = useState('betting')
	const [playDisable, setPlayDisable] = useState(false)

	const startGameHandler = () => {
		playHiLow({ bet: bet, card: state.card })
			.then(data => {
				// user.setBalance(data.newBalance)
				check()
					.then(data => {
						user.setUser(data)
					})
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
				// user.setBalance(data.newBalance)
				check()
					.then(data => {
						user.setUser(data)
					})
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
			<h2 style={{ color: '#F87D09' }}>balance: {user.user.balance}$ {state.status}</h2>
			<BetMaker bet={bet} setBet={setBet} />
			{gameState === 'playing' ?
				<>
					<div>
						<button className={styles.btn} onClick={() => playHandler('low')} disabled={playDisable}>
							{checkButtons('lower')} <br />
							{coefficients.lower.toFixed(2)}x <br />
						</button>
						<button className={styles.btn} onClick={() => playHandler('high')} disabled={playDisable}>
							{checkButtons('higher')} <br />
							{coefficients.higher.toFixed(2)}x <br />
						</button>
					</div>
					<div className={styles.card} style={{ background: cards[state.card].color }}>{cards[state.card].key}</div>
					<button className={styles.btn} onClick={() => cashOutHandler()} disabled={state.totalCoefficient === 1}>
						cash out <br />
						{(state.currentBet * state.totalCoefficient).toFixed(2)}$ <br />
						{state.totalCoefficient.toFixed(2)}x
					</button>
				</>
				: <>
					<button className={styles.btn} onClick={() => { startGameHandler() }}>play</button>
					<div className={styles.card} style={{ background: cards[state.card].color }}>{cards[state.card].key}</div>
					<button className={styles.btn} onClick={() => setState({ ...state, card: getRand(0, cards.length - 1) })}>change</button>
				</>
			}
		</div>
	)
})

export default HiLowGame