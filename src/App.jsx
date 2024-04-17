import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import KakuroGrid from './Components/KakuroGrid';
import { KakuroBacktracking } from './Backtrack/KakuroSolver';

function App() {
  const initialPuzzle = [
    ["X", "17\\", "6\\", "X", "X"], // Ensured five elements in every row
    ["\\9", "8", "0", "24\\", "X"],
    ["\\20", "0", "0", "0", "4\\"],
    ["X", "\\14", "0", "0", "0"],
    ["X", "X", "\\8", "0", "0"]
  ];
  // State to hold the current values of the puzzle
  const [puzzle, setPuzzle] = useState(initialPuzzle);
  const [showBackTracking, setShowBackTracking] = useState(false);
  const [isSolving, setIsSolving] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [stop, setStop] = useState(false);

  const speedDelta = 50;
  const animationSpeed = useRef(speed);

  const [steps, setSteps] = useState(0);

  // Function to reset the puzzle to its initial state
  const resetPuzzle = () => {
    setPuzzle([...initialPuzzle]);
  };
  const onCellChange = (rowIndex, cellIndex, value) => {
    // Create a new puzzle state based on current state
    const newPuzzle = puzzle.map((row, i) => {
      if (i === rowIndex) {
        return row.map((cell, j) => {
          if (j === cellIndex) {
            // Only update cells that are not blocked or sums
            return cell === "0" || (!cell.includes("\\") && !cell.includes("X") && !cell.includes("/")) ? value : cell;
          }
          return cell;
        });
      }
      return [...row];
    });

    setPuzzle(newPuzzle);
  };

  const showAnimation = async (steps) => {
    for (let i = 0; i < steps.length; i++) {
      setPuzzle(steps[i]);
      setSteps(i);
      console.log(1100 - speed);
      await new Promise((resolve) => setTimeout(resolve, animationSpeed.current));
    }
  }

  const solvePuzzle = async () => {
    const solver = new KakuroBacktracking(puzzle);
    const solvedBoard = solver.solveBackTrack();
    setIsSolving(true);
    if (showBackTracking) {
      const steps = solver.steps;
      await showAnimation(steps);
      setIsSolving(false)
    } else {
      setPuzzle([...solver.board]);
      setIsSolving(false);
    }
  };

  return (
    <div className="appContainer">
      <div className="kakuroContainer">
        <h1>Kakuro Puzzle</h1>
        <KakuroGrid puzzle={puzzle} onCellChange={onCellChange} disabled={isSolving} />
        <div>
          <button onClick={resetPuzzle} style={{ marginTop: '20px', fontSize: '10px', padding: '10px 20px' }}>Reset Puzzle</button>
          <button onClick={solvePuzzle} style={{ marginTop: '20px', fontSize: '10px', padding: '10px 20px' }}>Solve Puzzle</button>
          <button onClick={() => setStop(!stop)} style={{ marginTop: '20px', fontSize: '10px', padding: '10px 20px' }}>{stop ? "Resume" : "Stop"}</button>
          <input
            type="checkbox"
            checked={showBackTracking}
            onChange={(e) => setShowBackTracking(e.target.checked)}
          />
          <label>Show Backtracking</label>
          <div>
            <input step={speedDelta} type="range" min="100" max="1000" value={speed} className="slider" id="myRange" onChange={
              (e) => {
                setSpeed(e.target.value)
                animationSpeed.current = 1100 - speed;
              }} />
          </div>
        </div>
      </div>

      <div className="rulesContainer">
        <h2>Rules of Kakuro</h2>
        <p>All empty cells need to be filled with digits 1-9, ensuring that the sums are respected. No digit may be repeated in any sum group.</p>
        <h3>Notation</h3>
        <ul>
          <li><strong>'X'</strong>: Represents a cell that you don't need to fill.</li>
          <li><strong>Empty cell</strong>: Represents a cell that needs to be filled with a digit (1 - 9).</li>
          <li><strong>Cell with digit</strong>: The given digit is part of the solution, do not change it.</li>
          <li><strong>Cell with backslash</strong>: Indicates the required sum of the corresponding cells.</li>
          <li><strong>'X\'</strong>: The vertical sum X of the cells downwards.</li>
          <li><strong>'\X'</strong>: The horizontal sum X of the cells to the right.</li>
          <li><strong>'X\Y'</strong>: The vertical sum X of the cells downwards, and the horizontal sum Y of the cells to the right.</li>
        </ul>
      </div>
    </div>
  );
}

export default App;
