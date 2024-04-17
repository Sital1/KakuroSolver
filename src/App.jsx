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

  // states to hold the puzzle solution
  const [solvedPuzzle, setSolvedPuzzle] = useState([]);
  const [solutionSteps, setSolutionSteps] = useState([]);
  const [hintsEnabled, setHintsEnabled] = useState(false);
  const [fillable, setfillable] = useState([]);


  const solvePuzzleImmediately = () => {


    const clone = deepCloneArray(puzzle);
    const solver = new KakuroBacktracking(clone);
    const solutionSteps = solver.solveBackTrack();
    setSolvedPuzzle([...solver.board]);
    setSolutionSteps([...solver.steps]);
    const fillable = solver.fillable
    console.log(fillable)
    setfillable([...fillable]);

  };

  useEffect(() => {

    solvePuzzleImmediately();
  }, []);

  useEffect(() => {
    console.log("callllled");
   }, [puzzle])



  // states for showing solution
  const [showBackTracking, setShowBackTracking] = useState(false);
  const [isSolving, setIsSolving] = useState(false);
  const [speed, setSpeed] = useState(500);
  const stop = useRef(false);
  const [hasStarted, setHasStarted] = useState(false);
  const speedDelta = 50;
  const animationSpeed = useRef(speed);


  function deepCloneArray(arr) {
    return arr.map(item => {
      if (Array.isArray(item)) {
        return deepCloneArray(item);
      } else if (typeof item === 'object' && item !== null) {
        return { ...item };
      }
      return item;
    });
  }

  // Function to reset the puzzle to its initial state
  const resetPuzzle = () => {
    setPuzzle([...initialPuzzle]);
  };

  const validatePuzzle = () => {
    const newPuzzle = puzzle.map((row, rowIndex) => {
      return row.map((cell, colIndex) => {
        if (!["X", "\\","0"].some(char => cell.includes(char))) { // Assuming these denote non-fillable cells
          const correctValue = solvedPuzzle[rowIndex][colIndex];
          if (cell !== correctValue) {
            return `${cell}*`; // Mark incorrect cells
          }
        }
        return cell;
      });
    });
  
    setPuzzle(newPuzzle);
  };
  
  useEffect(() => {
    if (hintsEnabled) {
      validatePuzzle();
    }
  }, [hintsEnabled]);

  const onCellChange = (rowIndex, cellIndex, value) => {
    const newPuzzle = puzzle.map((row, i) => {
      if (i === rowIndex) {
        return row.map((cell, j) => {
          // Check if it's the cell being changed and if it's not a blocked cell
          if (j === cellIndex && (!cell.includes("\\") && !cell.includes("X") && !cell.includes("/"))) {
            // Apply hints only if they are enabled
            if (hintsEnabled) {
              const correctValue = solvedPuzzle[rowIndex][cellIndex];
              console.log(correctValue);
              const isCorrect = value === correctValue;
              return isCorrect ? value : `${value}*`; // Mark incorrect values only if hints are enabled
            } else {
              return value; // If hints are not enabled, just update the value normally
            }
          }
          return cell;
        });
      }
      return [...row];
    });
    console.log("Setting Puzzle");
    setPuzzle(newPuzzle);
  };

  const showAnimation = async (steps) => {
    for (let i = 0; i < solutionSteps.length; i++) {
      while (stop.current) {
        console.log("stopped");
        await new Promise(resolve => setTimeout(resolve, 100)); // Pause here if stopped
      }
      setPuzzle(solutionSteps[i]);
      // setSteps(i);
      await new Promise((resolve) => setTimeout(resolve, animationSpeed.current));
    }
  }

  const solvePuzzle = async () => {
    setHasStarted(true);

    setIsSolving(true);
    if (showBackTracking) {
      await showAnimation();
      setIsSolving(false)
    } else {
      setPuzzle(prev => [...solvedPuzzle]);
      setIsSolving(false);
    }
  };

  return (
    <div className="appContainer">
      <div className="kakuroContainer">
        <h1>Kakuro Puzzle</h1>
        <KakuroGrid fillable={fillable} puzzle={puzzle} onCellChange={onCellChange} disabled={isSolving} />
        <div className='button-group'>
          <button className='button reset-button ' onClick={resetPuzzle} >Reset Puzzle</button>
          <button className='button solve-button' onClick={solvePuzzle} >Solve Puzzle</button>
          {(hasStarted && showBackTracking) && (
            <button onClick={() => {
              stop.current = !stop.current;
              setIsSolving(!stop.current);
            }}
              className={`button ${stop.current ? 'resume-button' : 'stop-button'}`}

            >
              {stop.current ? "Resume" : "Stop"}
            </button>
          )}
          <input
            type="checkbox"
            checked={showBackTracking}
            onChange={(e) => setShowBackTracking(e.target.checked)}
          />
          <label>Show Backtracking</label>
        </div>
        <div className='slider'>
          <span>Speed: </span>
          <input step={speedDelta} type="range" min="100" max="1000" value={speed} id="myRange" onChange={
            (e) => {
              setSpeed(e.target.value)
              animationSpeed.current = 1100 - speed;
            }} />
          <label>
            <input
              type="checkbox"
              checked={hintsEnabled}
              onChange={(e) => setHintsEnabled(e.target.checked)}
            />
            Enable Hints
          </label>
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
