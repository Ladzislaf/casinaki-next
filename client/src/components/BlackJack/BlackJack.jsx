import React, { useContext, useState } from 'react'
import styles from './BlackJack.module.css'
import Card from '../Card/Card'
import Button from '../Button/Button'
import { getCardsDeck } from '../../utils/functions'
import { playBlackJack } from '../../http/playApi'
import { Context } from '../..'
import { MIN_BET } from '../../utils/constants'
import BetMaker from '../BetMaker/BetMaker'
import { check } from '../../http/userAPI'
import { observer } from 'mobx-react-lite'

const cardsDeck = getCardsDeck('blackjack')

const BlackJack = observer(() => {
    const { user } = useContext(Context)
	const [bet, setBet] = useState(MIN_BET)
	const [balanceStatus, setBalanceStatus] = useState('')
    const [gameStatus, setGameStatus] = useState('betting')
    const [gameResultMessage, setGameResultMessage] = useState('')

    const [dealerHand, setDealerHand] = useState({ 'cards': [-1, -1], 'sum': 0 })
    const [playerHand, setPlayerHand] = useState({ 'cards': [-1, -1], 'sum': 0 })

    const startGame = () => {
        setGameStatus('playing')
        setGameResultMessage('')
        check().then(userInfo => {
            user.setUser(userInfo)
            if (userInfo.role === 'BLOCKED') {
                alert('sorry, you have been blocked by admin')
            } else {
                playBlackJack({ bet: bet })
                    .then(data => {
                        user.setUserBalance(user.balance - bet)
                        setBalanceStatus(`- ${bet}$`)
                        setDealerHand({ 'cards': [...data.results.dealerCards, -1], 'sum': calculateSumCardsValue(data.results.dealerCards) })
                        setPlayerHand({ 'cards': data.results.playerCards, 'sum': calculateSumCardsValue(data.results.playerCards) })
                    })
                    .catch(err => {
                        console.log(err.response?.data)
                        alert(err.response?.data.message)
                    })
            }
        })
    }

    const calculateSumCardsValue = (cardsArray) => {
        let sum = 0
        let counterOfA = 0
        for (let card of cardsArray) {
            let value = cardsDeck[card].value
            if (value === 11) { counterOfA++ } 
            sum += value
        }
        while (counterOfA && sum > 21) {
            sum -= 10
            counterOfA--
        }
        return sum
    }

    const getAnotherCard = () => {
        playBlackJack({ another: true })
            .then(data => {
                if (data.results.gameOver) {
                    setGameResultMessage('LOOSER')
                    setGameStatus('betting')
                }
                setPlayerHand({ 'cards': data.results.playerCards, 'sum': calculateSumCardsValue(data.results.playerCards) })
            })
            .catch(err => {
                console.log(err.response?.data)
                alert(err.response?.data.message)
            })
    }

    const checkResults = () => {
        playBlackJack({ another: false })
            .then(data => {
                if (data.results.gameOver) {
                    setGameResultMessage('LOOSER')
                    setGameStatus('betting')
                } else if (data.results.draw) {
                    setGameResultMessage('DRAW')
                    setGameStatus('betting')
                    user.setUserBalance(user.balance + bet)
                    setBalanceStatus(`+ 0$`)
                } else {
                    setGameResultMessage('WINNER!')
                    setGameStatus('betting')
                    user.setUserBalance(user.balance + bet * 2)
                    setBalanceStatus(`+ ${bet}$`)
                }
                setDealerHand({ 'cards': data.results.dealerCards, 'sum': calculateSumCardsValue(data.results.dealerCards) })
            })
            .catch(err => {
                console.log(err.response?.data)
                alert(err.response?.data.message)
            })
    }

    return (
        <div className={styles.container}>
            <h2>BlackJack</h2>
            {user.isAuth && 
                <>
                    <h2 style={{ color: '#F87D09' }}>balance: {user.balance}$ {balanceStatus}</h2>
                    <BetMaker bet={bet} setBet={setBet} />
                    <h3 style={{ color: '#F87D09' }}>{gameResultMessage}</h3>
                </>
            }

            <div className={styles.playerHand}>
                <p>dealer (stand on 17)</p>
                <div>
                    {dealerHand.cards.map( (cardI, index) => {
                        return <Card key={index} cardIndex={cardI}/>
                    } )}
                </div>
                {dealerHand.sum}
            </div>

            <div className={styles.playerHand}>
                <p>you</p>
                <div>
                    {playerHand.cards.map( (cardI, index) => {
                        return <Card key={index} cardIndex={cardI}/>
                    } )}
                </div>
                {playerHand.sum}
            </div>
            
            {user.isAuth && 
                <div>
                    {gameStatus === 'betting' && <Button onClick={() => startGame()}>play</Button>}
                    {gameStatus === 'playing' && <Button onClick={() => getAnotherCard()}>more</Button>}
                    {gameStatus === 'playing' && <Button onClick={() => checkResults()}>enough</Button>}
                </div>
            }
        </div>
    )
})

export default BlackJack