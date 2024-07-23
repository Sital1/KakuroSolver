import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import KakuroGrid from './Components/KakuroGrid';
import { KakuroBacktracking } from './Backtrack/KakuroSolver';
import { puzzles } from './puzzles';

function App() {

  // State to hold the current values of the puzzle
  const [puzzleIndex, setPuzzleIndex] = useState(() => {
    const storedIndex = localStorage.getItem('puzzleIndex');
    return storedIndex !== null ? parseInt(storedIndex, 10) : 0;
  });

  const [puzzle, setPuzzle] = useState(puzzles[puzzleIndex].grid);

  const handlePuzzleChange = (e) => {

    const index = e.target.value;
    setPuzzleIndex(index);
    setIsSolved(false);
    setIsSolving(false);
    setHasStarted(false);
    setHintsEnabled(false);
    setShowBackTracking(false);
    localStorage.setItem('puzzleIndex', index);
    setPuzzle(puzzles[index].grid);
  };

  useEffect(() => {

    //resetPuzzle(true);
    solvePuzzleImmediately();
  }, [puzzleIndex])

  // states to hold the puzzle solution
  const [solvedPuzzle, setSolvedPuzzle] = useState([]);
  const [solutionSteps, setSolutionSteps] = useState([]);
  const [hintsEnabled, setHintsEnabled] = useState(false);
  const [fillable, setfillable] = useState([]);


  const solvePuzzleImmediately = () => {
    console.log("solving puzzle");
    const clone = deepCloneArray(puzzle);
    const solver = new KakuroBacktracking(clone);
    const solutionSteps = solver.solveBackTrack();
    setSolvedPuzzle([...solver.board]);
    setSolutionSteps([...solver.steps]);
    const fillable = solver.fillable
    setfillable([...fillable]);

  };




  useEffect(() => {

  }, [puzzle])



  // controls the state of the puzzle
  const [showBackTracking, setShowBackTracking] = useState(false);
  const [isSolving, setIsSolving] = useState(false);
  const stop = useRef(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isSolved, setIsSolved] = useState(false);


  // controls speed slider and spped of interval
  const [speed, setSpeed] = useState(500);
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

    window.location.reload();

  };

  /**
   * Checks if right move is placed in the Fillable cells.
   */

  const validatePuzzle = () => {
    if (fillable.length > 0){
      console.log("validating");
    // Map over the current puzzle to apply or remove hints
    const updatedPuzzle = puzzle.map((row, rowIndex) =>
      row.map((cell, colIndex) => {
        if (fillable.some(point => point.row === rowIndex && point.col === colIndex) && cell!=="0") { 
          // Ensure cell is fillable
          console.log("Insisde legit cell");
          const correctValue = solvedPuzzle[rowIndex][colIndex];
          if (hintsEnabled) {
            // When hints are enabled, mark incorrect answers
            return cell === correctValue ? cell : `${cell}*`;
          } else {
            // When hints are disabled, remove any marks (assuming marked cells end with '*')
            return cell.endsWith('*') ? cell.slice(0, -1) : cell;
          }
        }
        return cell; // Return non-fillable cells unchanged
      })
    );

    setPuzzle(updatedPuzzle);
  }
  };


  useEffect(() => {

    validatePuzzle();

}, [hintsEnabled]);




const onCellChange = (rowIndex, cellIndex, value) => {
  const newPuzzle = puzzle.map((row, i) => {
    if (i === rowIndex) {
      return row.map((cell, j) => {

        if (j === cellIndex && (!cell.includes("\\") && !cell.includes("X") && !cell.includes("/"))) {

          if (hintsEnabled) {
            const correctValue = solvedPuzzle[rowIndex][cellIndex];
            const isCorrect = value === correctValue;
            return isCorrect ? value : `${value}*`;
          } else {
            return value;
          }
        }
        return cell;
      });
    }
    return [...row];
  });
  setPuzzle(newPuzzle);

  if(validateManualSolve(newPuzzle)){
    setIsSolved(true);
  }
};


function validateManualSolve(puzzle) {
  if (puzzle.length !== solvedPuzzle.length) {
      return false; // Different number of rows
  }

  for (let i = 0; i < puzzle.length; i++) {
      if (puzzle[i].length !== solvedPuzzle[i].length) {
          return false; // Different sizes of sub-arrays
      }

      for (let j = 0; j < puzzle[i].length; j++) {
          if (puzzle[i][j] !== solvedPuzzle[i][j]) {
              return false; // Different elements found
          }
      }
  }

  return true; // All elements are the same and in the same order
}


/**
 * Shows the backtracking animation.
 */
const steps = useRef(0);
const showAnimation = async () => {
  for (let i = 0; i < solutionSteps.length; i++) {
    while (stop.current) {
      await new Promise(resolve => setTimeout(resolve, 100)); // Pause here if stopped
    }
    setPuzzle(solutionSteps[i]);

    await new Promise((resolve) => setTimeout(resolve, animationSpeed.current));
  }
}

/**
 * Solves the puzzle
 */
const solvePuzzle = async () => {
  setHasStarted(true);
  setIsSolving(true);

  if (showBackTracking) {
    await showAnimation();
    setIsSolving(false);
    setIsSolved(true);
    
  } else {
    setPuzzle(prev => [...solvedPuzzle]);
    setIsSolving(false);
    setIsSolved(true);

  }
};


const renderPuzzleOptions = () => (<div>
  <h5>Select Puzzle</h5>
  <select onChange={(e) => handlePuzzleChange(e)} value={puzzleIndex}>
    {puzzles.map((p, index) => (
      <option key={index} value={index}>
        {p.name}
      </option>
    ))}
  </select>
</div>

);


return (
  <div className="appContainer">

    <div className='sidebar'>
      {renderPuzzleOptions()}
    </div>

    <div className="kakuroContainer">
      <h1>Kakuro Puzzle</h1>
      {isSolved && <p className="solved-message">Puzzle Solved!</p>}
      <KakuroGrid fillable={fillable} puzzle={puzzle} onCellChange={onCellChange} disabled={isSolving || isSolved} />
      <div className='button-group'>
        <button className='button reset-button ' onClick={() => { resetPuzzle() }} >Reset Puzzle</button>
        <button className='button solve-button' onClick={solvePuzzle} disabled={isSolving || stop.current === true||isSolved}>Solve Puzzle</button>
        {(hasStarted && showBackTracking && !isSolved) && (
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
        {showBackTracking && <><span>Speed: </span>
          <input step={speedDelta} type="range" min="100" max="1000" value={speed} id="myRange" onChange={
            (e) => {
              setSpeed(e.target.value)
              animationSpeed.current = 1100 - speed;
            }} /></>}
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
