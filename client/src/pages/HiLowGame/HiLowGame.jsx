import React, { useState, useContext } from 'react'
import { Context } from '../..'
import { MIN_BET } from '../../utils/constants'
import BetMaker from '../../components/BetMaker/BetMaker'
import { getRand } from '../../utils/functions'
import { playHiLow } from '../../services/http/playApi'
import { observer } from 'mobx-react-lite'
import { check } from '../../services/http/userAPI'
import Button from '../../components/ui/Button'
import { getCardsDeck } from '../../utils/functions'
import Card from '../../components/Card/Card'
import Heading from '../../components/ui/Heading'

const cards = getCardsDeck()

const HiLowGame = observer(() => {
	const { user } = useContext(Context)
	const [bet, setBet] = useState(MIN_BET)
	const [state, setState] = useState({ card: getRand(0, 51), gameResult: '', totalCoefficient: 1, currentBet: bet })
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
							setState({ ...state, gameResult: data.status, currentBet: bet })
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
				setState({ ...state, gameResult: data.status, totalCoefficient: 1 })
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
		<>
			<Heading>higher-lower game</Heading>
			{ user.isAuth && <BetMaker bet={bet} setBet={setBet} balanceChanges={state.gameResult}/> }

			{gameState === 'betting' ? (
				 <>
					<Button onClick={() => { startGameHandler() }} disabled={!user.isAuth} width={'7rem'}>play</Button>
					
					<Card cardIndex={state.card} scale={1}/>
					
					<Button onClick={() => setState({ ...state, card: getRand(0, 51) })} width={'7rem'}>change card</Button>
				</>
			) : (
				<>
					<div>
						<Button onClick={() => playHandler('low')} disabled={playDisable} width={'12rem'}>
							{checkButtons('lower')} <br />
							{coefficients.lower.toFixed(2)}x <br />
						</Button>
						<Button onClick={() => playHandler('high')} disabled={playDisable} width={'12rem'}>
							{checkButtons('higher')} <br />
							{coefficients.higher.toFixed(2)}x <br />
						</Button>
					</div>
					
					<Card cardIndex={state.card} scale={1} />

					<Button onClick={() => cashOutHandler()} disabled={state.totalCoefficient === 1} width={'7rem'}>
						cash out <br />
						{(state.currentBet * state.totalCoefficient).toFixed(2)}$ <br />
						{state.totalCoefficient.toFixed(2)}x
					</Button>
				</>
			)}
		</>
	)
})

export default HiLowGame