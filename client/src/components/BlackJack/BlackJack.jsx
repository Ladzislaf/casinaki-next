import React, { useEffect, useState } from 'react'
import styles from './BlackJack.module.css'
import Card from '../Card/Card'
import Button from '../Button/Button'
import { getCardsDeck, getRand } from '../../utils/functions'

const cardsDeck = getCardsDeck()

const BlackJack = () => {
    const [dealerHand, setDealerHand] = useState({ 'cards': [-1, -1], 'sum': 0 })
    const [myHand, setMyHand] = useState({ 'cards': [-1, -1], 'sum': 0 })
    
    useEffect(() => {
        if (myHand.sum === 21) alert('CONGRATULATIONS!')
    }, [myHand])

    const startGame = () => {
        let newDealerCards = [getRand(0, 51), getRand(0, 51)]
        let newPlayerCards = [getRand(0, 51), getRand(0, 51)]
        setDealerHand({ 'cards': newDealerCards, 'sum': calculateSumCardsValue([...newDealerCards]) })
        setMyHand({ 'cards': newPlayerCards, 'sum': calculateSumCardsValue([...newPlayerCards]) })

    }

    const reloadGame = () => {
        setDealerHand({ 'cards': [-1, -1], 'sum': 0 })
        setMyHand({ 'cards': [-1, -1], 'sum': 0 })
    }

    const calculateSumCardsValue = (cardsArray) => {
        let sum = 0
        for (let card of cardsArray) {
            let cardValue = cardsDeck[card].value
            if (cardValue === 14) cardValue = 11
            else if (cardValue > 10) cardValue = 10
            sum += cardValue
        }
        return sum
    }



    return (
        <div className={styles.container}>
            <h2>BlackJack</h2>

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
}

export default BlackJack