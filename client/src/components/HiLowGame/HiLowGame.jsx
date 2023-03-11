import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../..'
import styles from './HiLowGame.module.css'
import { MIN_BET } from '../../utils/constants'
import BetMaker from '../BetMaker/BetMaker'
import { updateBalance } from '../../http/userAPI'

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

const min = 0, max = cards.length - 1
const getRand = () => {
	return (Math.floor(Math.random() * (max - min + 1)) + min)
}

const HiLowGame = () => {
	const { user } = useContext(Context)
	const [state, setState] = useState({ card: cards[getRand()], status: '', totalCoefficient: 1, currentBet: MIN_BET })
	const [bet, setBet] = useState(MIN_BET)
	const [coefficients, setCoefficients] = useState({ higher: 1, lower: 1, common: 1 })
	const [gameState, setGameState] = useState('betting')

	// calculating coefficients
	useEffect(() => {
		let higherCoefficient, lowerCoefficient
		if (state.card.value === 13) {
			higherCoefficient = 0.97 / (1 / 13)
			lowerCoefficient = 0.97 / (12 / 13)
		} else if (state.card.value === 1) {
			higherCoefficient = 0.97 / (12 / 13)
			lowerCoefficient = 0.97 / (1 / 13)
		} else {
			higherCoefficient = 0.97 / ((14 - state.card.value) / 13)
			lowerCoefficient = 0.97 / (state.card.value / 13)
		}
		setCoefficients({ higher: higherCoefficient, lower: lowerCoefficient })
	}, [state.card])

	// mode = 1 -> higher | mode = 0 -> lower
	const playHandler = (mode) => {
		const newCard = cards[getRand()]
		if (newCard.value > state.card.value && mode) {
			setState({ ...state, card: newCard, totalCoefficient: state.totalCoefficient * coefficients.higher })
		} else if (newCard.value < state.card.value && mode) {
			setState({ ...state, card: newCard, status: ` -${state.currentBet}`, totalCoefficient: 1 })
			setGameState('betting')
		} else if (newCard.value < state.card.value && !mode) {
			setState({ ...state, card: newCard, totalCoefficient: state.totalCoefficient * coefficients.lower })
		} else if (newCard.value > state.card.value && !mode) {
			setState({ ...state, card: newCard, status: ` -${state.currentBet}`, totalCoefficient: 1 })
			setGameState('betting')
		}
	}

	const checkButtons = (mode) => {
		switch (mode) {
			case 'higher':
				if (state.card.value === 13) return 'same'
				else if (state.card.value === 1) return 'higher'
				else return 'higher or same'
			case 'lower':
				if (state.card.value === 1) return 'same'
				else if (state.card.value === 13) return 'lower'
				else return 'lower or same'
			default: console.log('Error: no such mode in checkName function')
		}
	}

	const startGameHandler = () => {
		if (user._user.balance < bet) {
			alert('YOU DON\'T HAVE ENOUGH MONEY, GO TO WORK, LOOSER!')
			return
		}
		setGameState('playing')
		setState({ ...state, status: `-${bet.toFixed(2)}$`, currentBet: bet.toFixed(2) })
		user.setBalance(user._user.balance - bet)
	}

	const cashOutHandler = () => {
		setState({ ...state, status: ` +${(state.currentBet * state.totalCoefficient).toFixed(2)}$`, totalCoefficient: 1 })
		setGameState('betting')
		user.setBalance(user._user.balance + state.currentBet * state.totalCoefficient)
		updateBalance(user._user.balance)
	}

	return (
		<div className={styles.container}>
			<h3>hi-low-game component</h3>
			<h2 style={{ color: '#F87D09' }}>balance: {user._user.balance.toFixed(2)}$ {state.status}</h2>
			<BetMaker bet={bet} setBet={setBet} />
			{gameState === 'playing' ?
				<>
					<div>
						<button className={styles.btn} onClick={() => playHandler(1)}>
							{checkButtons('higher')} <br />
							{coefficients.higher.toFixed(2)}x <br />
						</button>
						<button className={styles.btn} onClick={() => playHandler(0)}>
							{checkButtons('lower')} <br />
							{coefficients.lower.toFixed(2)}x <br />
						</button>
					</div>
					<div className={styles.card} style={{ background: state.card.color }}>{state.card.key}</div>
					<button className={styles.btn} onClick={() => cashOutHandler()} disabled={state.totalCoefficient === 1}>
						cash out <br />
						{(state.currentBet * state.totalCoefficient).toFixed(2)}$ <br />
						{state.totalCoefficient.toFixed(2)}x
					</button>
				</>
				: <>
					<button className={styles.btn} onClick={() => { startGameHandler() }}>play</button>
					<div className={styles.card} style={{ background: state.card.color }}>{state.card.key}</div>
					<button className={styles.btn} onClick={() => setState({ ...state, card: cards[getRand()] })}>change</button>
				</>
			}
		</div>
	)
}

export default HiLowGame