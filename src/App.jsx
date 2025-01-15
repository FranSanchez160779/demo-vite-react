import React, { useState } from 'react';
import PropTypes from 'prop-types'; // Importa PropTypes para validación de props

// Componente Square: Representa un cuadrado del tablero
function Square({ value, onSquareClick, id }) {
  return (
    <button className="square" onClick={onSquareClick} key={id}>
      {value}
    </button>
  );
}

// Validación de props para Square
Square.propTypes = {
  value: PropTypes.string, // El valor debe ser un string
  onSquareClick: PropTypes.func.isRequired, // La función es requerida
  id: PropTypes.string.isRequired, // Añadimos 'id' para evitar el uso del índice como key
};

// Componente Board: Representa el tablero de juego
function Board({ xIsNext, squares, onPlay }) {
  // Manejar clic en un cuadrado
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return; // No permitir acciones si ya hay un ganador o el cuadrado está ocupado
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  // Determinar el estado del juego
  const winner = calculateWinner(squares);
  let status;

  if (winner) {
    status = `Winner: ${winner}`;
  } else {
    const nextPlayer = xIsNext ? 'X' : 'O';
    status = `Next player: ${nextPlayer}`;
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}
}

// Validación de props para Board
Board.propTypes = {
  xIsNext: PropTypes.bool.isRequired, // Indica si es el turno de 'X'
  squares: PropTypes.arrayOf(PropTypes.string).isRequired, // Array de strings para los cuadrados
  onPlay: PropTypes.func.isRequired, // Función para manejar jugadas
};

// Componente principal: Game
export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  // Manejar jugadas
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  // Saltar a un movimiento anterior
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // Generar lista de movimientos
  const moves = history.map((_, move) => {
    const description = move > 0 ? `Go to move #${move}` : 'Go to game start';
    return (
       <li key={`move-${currentMove}-${description}`}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

// Función para calcular el ganador
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
