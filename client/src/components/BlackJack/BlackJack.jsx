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

const BlackJack = observer(() => {
    const { user } = useContext(Context)
	const [bet, setBet] = useState(MIN_BET)
	const [balanceStatus, setBalanceStatus] = useState('')

    const [dealerHand, setDealerHand] = useState({ 'cards': [-1, -1], 'sum': 0 })
    const [myHand, setMyHand] = useState({ 'cards': [-1, -1], 'sum': 0 })
    
    useEffect(() => {
        if (myHand.sum === 21) alert('CONGRATULATIONS!')
    }, [myHand])

    const startGame = () => {
        check().then(userInfo => {
            user.setUser(userInfo)
            if (userInfo.role === 'BLOCKED') {
                alert('sorry, you have been blocked by admin')
            } else {
                playBlackJack({ bet: bet })
                    .then(data => {
                        user.setUserBalance(user.balance - bet)
                        setBalanceStatus(`- ${bet}$`)
                        setMyHand({ 'cards': data.cards, 'sum': calculateSumCardsValue([...data.cards]) })
                    })
                    .catch(err => {
                        console.log(err.response.data)
                        alert(err.response.data.message)
                    })
            }
        })
    }

    const reloadGame = () => {
        setDealerHand({ 'cards': [-1, -1], 'sum': 0 })
        setMyHand({ 'cards': [-1, -1], 'sum': 0 })
    }

    const calculateSumCardsValue = (cardsArray) => {
        let sum = 0
        for (let card of cardsArray) {
            sum += cardsDeck[card].value
        }
        return sum
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
                    {myHand.cards.map( (cardI, index) => {
                        return <Card key={index} cardIndex={cardI}/>
                    } )}
                </div>
                {myHand.sum}
            </div>
            
            <div>
                <Button onClick={() => startGame()}>play</Button>
                <Button onClick={() => reloadGame()}>reload</Button>
                <Button>more</Button>
                <Button>enough</Button>
            </div>
            
        </div>
    )
})

export default BlackJack