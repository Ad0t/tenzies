import Die from "./Dices";
import { useState, useEffect, useRef } from "react";
import Confetti from 'react-confetti'
import { nanoid } from "nanoid";

export default function App() {
    const [dice, setDice] = useState(() => generateAllNewDice())
    const buttonRef = useRef(null)

    const gameWon = dice.every(die => die.isHeld) && dice.every(die => die.value === dice[0].value)
    useEffect (() => {
        if (gameWon) {
            buttonRef.current.focus()
        }
    }, [gameWon])

    function generateAllNewDice () {
        // const newDice = []
        // for (let i = 0; i < 10; i++) {
        //     const rand = Math.ceil(Math.random() * 6)
        //     newDice.push(rand)
        // }
        // return newDice

        return new Array(10)
            .fill(0)
            // .map(() => Math.ceil(Math.random() * 6))
            .map(() => ({
                value: Math.ceil(Math.random() * 6), 
                isHeld: false, 
                id: nanoid()
            }))
    }

    function rollDice () {
        if (!gameWon) {
            setDice(oldDice => oldDice.map(die => 
                die.isHeld ? die : { ...die, value: Math.ceil(Math.random() * 6)}
            ))
        } else {
            setDice(generateAllNewDice())
        }
    }

    function hold (id) {
        setDice(oldDice => oldDice.map(die => 
            die.id === id ? {...die, isHeld: !die.isHeld} : die
            )
        )
    }

    // console.log(generateAllNewDice())
    const diceElements = dice.map(dieObj => (
        <Die 
            key={dieObj.id} 
            value={dieObj.value} 
            isHeld={dieObj.isHeld} 
            hold={() => hold(dieObj.id)}
        />
    ))

    return (
        <main>
            {gameWon && <Confetti />}
            <div className="head">
                <h1 className="title">Tenzies</h1>
                <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
            </div>
            <div className="dice-container">
                {diceElements}
            </div>

            <button ref={buttonRef} className="roll-btn" onClick={rollDice}>
                {gameWon ? "New Game": "Roll" }
            </button>

        </main>
    )
}