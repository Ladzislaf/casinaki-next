import React, { useContext, useEffect, useState } from 'react'
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

// TODO:    - результат: ничья
//          - А = 1\11
//          - сообщение: win/lose
//          - генерация уникальных карт на сервере
//          - 
//          - merge

const BlackJack = observer(() => {
    const { user } = useContext(Context)
	const [bet, setBet] = useState(MIN_BET)
	const [balanceStatus, setBalanceStatus] = useState('')
    const [gameStatus, setGameStatus] = useState('betting')

    const [dealerHand, setDealerHand] = useState({ 'cards': [-1, -1], 'sum': 0 })
    const [playerHand, setPlayerHand] = useState({ 'cards': [-1, -1], 'sum': 0 })
    
    useEffect(() => {
        // if (playerHand.sum === 21) 
        //     alert('CONGRATULATIONS!')
    }, [playerHand])

    const startGame = () => {
        setGameStatus('playing')
        check().then(userInfo => {
            user.setUser(userInfo)
            if (userInfo.role === 'BLOCKED') {
                alert('sorry, you have been blocked by admin')
            } else {
                playBlackJack({ bet: bet })
                    .then(data => {
                        user.setUserBalance(user.balance - bet)
                        setBalanceStatus(`- ${bet}$`)
                        setDealerHand({ 'cards': data.results.dealerCards, 'sum': calculateSumCardsValue(data.results.dealerCards) })
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
        for (let card of cardsArray) {
            sum += cardsDeck[card].value
        }
        return sum
    }

    const getAnotherCard = () => {
        playBlackJack({ another: true })
            .then(data => {
                if (data.results.gameOver) {
                    console.log('GAME OVER')
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
                    console.log('GAME OVER')
                    setGameStatus('betting')
                } else {
                    console.log('WINNER!')
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
			<h2 style={{ color: '#F87D09' }}>balance: {user.balance}$ {balanceStatus}</h2>
			<BetMaker bet={bet} setBet={setBet} />

            <div className={styles.playerHand}>
                <p>dealer</p>
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
            
            <div>
                {gameStatus === 'betting' && <Button onClick={() => startGame()}>play</Button>}
                {gameStatus === 'playing' && <Button onClick={() => getAnotherCard()}>more</Button>}
                {gameStatus === 'playing' && <Button onClick={() => checkResults()}>enough</Button>}
            </div>
            
        </div>
    )
})

export default BlackJack