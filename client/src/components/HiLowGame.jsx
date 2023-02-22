import React, { useState, useEffect } from 'react'

const suits = ['♠', '♥', '♦', '♣']
const cardValues = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
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
	const [state, setState] = useState({ card: cards[getRand()], balance: 2, bet: 0.1, status: 'click to play', totalCoefficient: 1 })
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
	}, [state])

	// mode = 1 -> higher | mode = 0 -> lower
	const playHandler = (mode) => {
		const newCard = cards[getRand()]
		if (newCard.value > state.card.value && mode) {
			setState({ ...state, card: newCard, totalCoefficient: state.totalCoefficient * coefficients.higher })
		} else if (newCard.value < state.card.value && mode) {
			setState({ ...state, card: newCard, status: `looser! -${state.bet.toFixed(2)}$`, totalCoefficient: 1 })
			setGameState('betting')
		} else if (newCard.value < state.card.value && !mode) {
			setState({ ...state, card: newCard, totalCoefficient: state.totalCoefficient * coefficients.lower })
		} else if (newCard.value > state.card.value && !mode) {
			setState({ ...state, card: newCard, status: `looser! -${state.bet.toFixed(2)}$`, totalCoefficient: 1 })
			setGameState('betting')
		}
	}

	const changeBet = (mode, value) => {
		if (+state.bet.toFixed(2) - value < 0 && mode === 'down') return
		if ((state.balance < (+state.bet.toFixed(2) + value)) && mode === 'up') {
			alert('YOU DON\'T HAVE ENOUGH MONEY, GO TO WORK, LOOSER!')
			return
		}
		switch (mode) {
			case 'up': setState({ ...state, bet: +state.bet.toFixed(2) + value })
				break
			case 'down': setState({ ...state, bet: +state.bet.toFixed(2) - value })
				break
			default: console.log('No such mode for bet changing')
				break
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

	const cashOutHandler = () => {
		setState({...state, status: `winner! +${(state.bet * state.totalCoefficient).toFixed(2)}`, balance: state.balance + state.bet * state.totalCoefficient, totalCoefficient: 1})
		setGameState('betting')
	}

	return (
		<div className='hi-low-game'>
			<h3>hi-low-game component</h3>
			<h2 style={{ color: '#e24e29' }}>balance: {state.balance.toFixed(2)}$</h2>
			<p>bet: {state.bet.toFixed(2)}$</p>
			<div>{state.status}</div>
			{gameState === 'playing' ?
				<>
					<button className='btn' onClick={() => playHandler(1)}>
						{checkButtons('higher')} <br />
						{coefficients.higher.toFixed(2)}x <br />
					</button>
					<button className='btn' onClick={() => playHandler(0)}>
						{checkButtons('lower')} <br />
						{coefficients.lower.toFixed(2)}x <br />
					</button> <br />
					<div>total: </div>
					<div className='hi-low-card' style={{ background: state.card.color }}>{state.card.key}</div>
					<button className='btn' onClick={() => cashOutHandler()} disabled={state.totalCoefficient === 1}>
						cash out <br />
						{(state.bet * state.totalCoefficient).toFixed(2)}$ <br />
						{state.totalCoefficient.toFixed(2)}x
					</button>
				</>
				: <>
					<button className='btn' onClick={() => changeBet('up', 0.1)}>+</button>
					<button className='btn' onClick={() => changeBet('down', 0.1)}>-</button> <br />
					<button className='btn' onClick={() => { 
						setGameState('playing')
						setState({ ...state, balance: state.balance - state.bet, status: `-${state.bet.toFixed(2)}$ to play` }) 
					}}>play</button>
					<div className='hi-low-card' style={{ background: state.card.color }}>{state.card.key}</div>
					<button className='btn' onClick={() => setState({ ...state, card: cards[getRand()] })}>change</button>
				</>
			}
		</div>
	)
}

export default HiLowGame