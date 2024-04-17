import React from 'react';
import Square from './Square';

export default function  KakuroGrid  ({ puzzle,onCellChange,disabled,fillable }) {
  const gridStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  };

  const rowStyle = {
    display: 'flex',
    justifyContent: 'center'
  };

  function isFillable(row,col) {
    // Returns true if the cell is NOT in the fillable array
    const fill = fillable.some(point => point.row === row && point.col === col);
    return fill;
  }

  return (
    <div style={gridStyle}>
      {puzzle.map((row, rowIndex) => (
        <div key={rowIndex} style={rowStyle}>
          {row.map((cell, cellIndex) => (
            <Square isFillable={isFillable(rowIndex,cellIndex)} key={cellIndex} value={cell}  onChange={(e) => onCellChange(rowIndex, cellIndex, e.target.value)} disabled={disabled} />
          ))}
        </div>
      ))}
    </div>
  );
};

