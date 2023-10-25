import { observer } from 'mobx-react-lite'
import React, { useContext, useState } from 'react'
import { Context } from '../..'
import { playMiner } from '../../services/http/playApi'
import { check } from '../../services/http/userAPI'
import { MIN_BET, sapperAnecdotes } from '../../utils/constants'
import { getRand } from '../../utils/functions'
import BetMaker from '../../components/BetMaker/BetMaker'
import styles from './MinerGame.module.css'
import Button from '../../components/ui/Button'
import Heading from '../../components/ui/Heading'

const gameField = [
	[1, 2, 3, 4, 5],
	[6, 7, 8, 9, 10],
	[11, 12, 13, 14, 15],
	[16, 17, 18, 19, 20],
	[21, 22, 23, 24, 25]
]

const MinerGame = observer(() => {
	const [cells, setCells] = useState(['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''])
	const { user } = useContext(Context)
	const [bet, setBet] = useState(MIN_BET)
	const [currentBet, setCurrentBet] = useState(MIN_BET)
	const [bombsCount, setBombsCount] = useState(5)
	const [gameStatus, setGameStatus] = useState('betting')
	const [balanceStatus, setBalanceStatus] = useState('')
	const [coefficients, setCoefficients] = useState({ currentCoefficient: 1, nextCoefficient: 1 })
	const [anecdote, setAnecdote] = useState('')
	const [cellsDisable, setCellsDisable] = useState(false)

	const startGame = () => {
		check().then(data => {
			user.setUser(data)
			if (data.role === 'BLOCKED') {
				alert('sorry, you have been blocked by admin')
				return
			} else {
				setCells(cells.map(() => {
					return ''
				}))
				setAnecdote('')
				setCurrentBet(bet)
				playMiner({ bet, bombsCount })
					.then(data => {
						user.setUserBalance(user.balance - bet)
						setCoefficients({ currentCoefficient: 1, nextCoefficient: data.gameResult.nextCoefficient })
						setBalanceStatus(`- ${bet}$`)
						setGameStatus('playing')
					})
					.catch(err => {
						console.log(err.response.data)
						alert(err.response.data.message)
					})
			}
		})
	}

	const pickCell = (number) => {
		if (gameStatus === 'betting') {
			alert('Click play button to start the game')
			return
		}
		setCellsDisable(true)
		playMiner({ cellNumber: number })
			.then(data => {
				if (data.gameResult.status === 'luck') {
					setCoefficients({ currentCoefficient: data.gameResult.currentCoefficient, nextCoefficient: data.gameResult.nextCoefficient })

					setCells(cells.map((el, index) => {
						if (index === number - 1) return 'picked'
						return el
					}))
				} else if (data.gameResult.status === 'boom') {
					setGameStatus('betting')

					setCells(cells.map((el, index) => {
						if (data.gameResult.bombs.includes(index + 1)) return 'bomb'
						if (data.gameResult.picked.includes(index + 1)) return 'was_picked'
						return 'picked'
					}))
					setAnecdote('BOOOOOOM! ' + sapperAnecdotes[getRand(0, sapperAnecdotes.length - 1)])
				} else {
					check().then(data => {
						user.setUser(data)
					})
					setBalanceStatus(data.gameResult.winnings)
					setGameStatus('betting')

					setCells(cells.map((el, index) => {
						if (data.gameResult.bombs.includes(index + 1)) return 'bomb'
						if (data.gameResult.picked.includes(index + 1)) return 'was_picked'
						return el
					}))
				}
			})
			.catch(err => {
				console.log(err.response.data)
				alert(err.response.data.message)
			})
			.finally(() => {
				setCellsDisable(false)
			})
	}

	const cashOutHandler = () => {
		playMiner({})
			.then(data => {
				check().then(data => {
					user.setUser(data)
				})
				setBalanceStatus(data.gameResult.winnings)
				setGameStatus('betting')

				setCells(cells.map((el, index) => {
					if (data.gameResult.bombs.includes(index + 1)) return 'bomb'
					if (data.gameResult.picked.includes(index + 1)) return 'was_picked'
					return el
				}))
			})
			.catch(err => {
				console.log(err.response.data)
				alert(err.response.data.message)
			})
	}
	
	return (
		<>
			<Heading>miner game</Heading>
			{ user.isAuth && <BetMaker bet={bet} setBet={setBet} balanceChanges={balanceStatus} /> }

			<div>
				<Button onClick={() => { bombsCount !== 3 && setBombsCount(bombsCount - 1) }}>-</Button>
				<span>bombs: {bombsCount}</span>
				<Button onClick={() => { bombsCount !== 24 && setBombsCount(bombsCount + 1) }}>+</Button>
			</div>

			{gameStatus === 'betting' ? (
				<Button onClick={() => startGame()} disabled={!user.isAuth} width={'12rem'}>play</Button>
			) : (
				<>
					<div>next coefficient: {coefficients.nextCoefficient.toFixed(2)}x</div>
					<Button onClick={() => cashOutHandler()} disabled={coefficients.currentCoefficient === 1} width={'12rem'}>
						cash out {(coefficients.currentCoefficient * currentBet).toFixed(2)}$ ({coefficients.currentCoefficient.toFixed(2)}x)
					</Button>
				</>
			)}
			
			<div style={{textAlign: 'center'}}>{anecdote}</div>

			<div className={styles.field}>
				{gameField.map((row, index) => {
					return <div className={styles.row} key={index}>{
						row.map((cell, index) => {
							return (
								<button className={`
									${styles.cell} ${cells[cell - 1] === 'picked' && styles.picked} 
									${cells[cell - 1] === 'was_picked' && styles.was_picked} 
									${cells[cell - 1] === 'bomb' && styles.bomb}
								`}
									key={index}
									onClick={() => pickCell(cell)}
									disabled={cellsDisable || cells[cell - 1] === 'picked'}></button>
							)
						})
					}</div>
				})}
			</div>
			<br/>
		</>
	)
})

export default MinerGame