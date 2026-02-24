import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './App.css';

const WIN_LINES = [
  // Rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Columns
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Diagonals
  [0, 4, 8],
  [2, 4, 6],
];

function calculateWinner(squares) {
  for (const [a, b, c] of WIN_LINES) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: null };
}

// PUBLIC_INTERFACE
function App() {
  /**
   * Theme toggle is kept from the template to preserve existing container behavior.
   * The requested app is a modern light theme; light is default.
   */
  const [theme, setTheme] = useState('light');

  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const { winner, line } = useMemo(() => calculateWinner(squares), [squares]);

  const isDraw = useMemo(() => {
    if (winner) return false;
    return squares.every(Boolean);
  }, [squares, winner]);

  const statusText = useMemo(() => {
    if (winner) return `Winner: ${winner}`;
    if (isDraw) return 'It’s a draw';
    return `Turn: ${isXNext ? 'X' : 'O'}`;
  }, [winner, isDraw, isXNext]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleSquareClick = useCallback(
    (index) => {
      // Ignore clicks if the game is over or the cell is already filled.
      if (winner || squares[index]) return;

      setSquares((prev) => {
        const next = prev.slice();
        next[index] = isXNext ? 'X' : 'O';
        return next;
      });
      setIsXNext((prev) => !prev);
    },
    [winner, squares, isXNext]
  );

  const restart = useCallback(() => {
    setSquares(Array(9).fill(null));
    setIsXNext(true);
  }, []);

  return (
    <div className="App">
      <main className="ttt-shell">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>

        <section className="ttt-card" aria-label="Tic-Tac-Toe">
          <header className="ttt-header">
            <h1 className="ttt-title">Tic-Tac-Toe</h1>
            <p className="ttt-subtitle">
              Two players. One board. Take turns and win with three in a row.
            </p>
          </header>

          <div className="ttt-status" role="status" aria-live="polite">
            <span className="ttt-status-label">{statusText}</span>
          </div>

          <div className="ttt-boardWrap">
            <div className="ttt-board" role="grid" aria-label="Game board">
              {squares.map((value, idx) => {
                const isWinningCell = Boolean(line?.includes(idx));
                const disabled = Boolean(value) || Boolean(winner) || isDraw;

                return (
                  <button
                    key={idx}
                    type="button"
                    className={`ttt-cell ${value ? 'is-filled' : ''} ${
                      isWinningCell ? 'is-winning' : ''
                    }`}
                    onClick={() => handleSquareClick(idx)}
                    disabled={disabled}
                    role="gridcell"
                    aria-label={`Cell ${idx + 1}${value ? `: ${value}` : ''}`}
                  >
                    <span className="ttt-mark" aria-hidden="true">
                      {value}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="ttt-footer">
            <div className="ttt-result" aria-label="Result">
              {winner && (
                <span className="ttt-resultBadge ttt-resultBadge--win">
                  {winner} wins
                </span>
              )}
              {!winner && isDraw && (
                <span className="ttt-resultBadge ttt-resultBadge--draw">Draw</span>
              )}
              {!winner && !isDraw && (
                <span className="ttt-resultHint">First to align three wins.</span>
              )}
            </div>

            <button type="button" className="ttt-restartBtn" onClick={restart}>
              Restart
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
