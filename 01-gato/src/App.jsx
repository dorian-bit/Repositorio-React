import { useState, useEffect } from 'react'
import './App.css'
import confetti from 'canvas-confetti'
import {Square} from './components/Square.jsx'
import { TURNS } from './constants.jsx'
import {checkWinnerFrom, checkEndGame} from './logic/board.jsx'
import { WinnerModal } from './components/WinnerModal.jsx'
import { resetGameStorage, saveGameToStorage } from './logic/storage'

function App() {
  const [board, setBoard] = useState(() => {
    console.log('inicializar estado del board')
    const boardFromStorage = window.localStorage.getItem('board')
    if (boardFromStorage) return JSON.parse(boardFromStorage)
    return Array(9).fill(null)
})

  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem('turn')
    return turnFromStorage ?? TURNS.X /* EL OPERADOR ?? MIRA SI ES NULL O UNDEFINED */
  })
  // null es que no hay ganador, false es que hay un empate
  const [winner, setWinner] = useState(null) 
  
  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)

    resetGameStorage()
  } 

  const updateBoard = (index ) => {
    // no actualizamos esta posicion
    // si ya tiene algo
    if (board[index] || winner) return
    // actualizar el tablero
    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard) // asincrona
    // cambiar el turno
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)
    // guardar aqui partida
    saveGameToStorage( {
      board: newBoard, 
      turn: newTurn} )
    // revisar si hay un ganador
    const newWinner = checkWinnerFrom(newBoard)
    if (newWinner) {
      confetti()
      setWinner(newWinner)
    } else if (checkEndGame(newBoard)){
      setWinner(false) //Empate
    }
  }

  return (
    <main className='board'>
      <h1>Gato</h1>
      <button onClick={resetGame}>Reset del Juego</button>
      <section className='game'>
        {
          board.map((square, index) => {
            return (
              <Square key={index} index={index} updateBoard={updateBoard}>
                {square}
              </Square>  
            )
          })
        }
      </section>
      <section className='turn'>
        <Square isSelected={turn === TURNS.X}>
          {TURNS.X}
        </Square>
        <Square isSelected={turn === TURNS.O}>
          {TURNS.O}
        </Square> 
      </section>
     <WinnerModal resetGame={resetGame} winner={winner}/>
    </main>
  )
}

export default App
