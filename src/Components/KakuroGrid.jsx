import React from 'react';
import Square from './Square';

export default function  KakuroGrid  ({ puzzle,onCellChange,disabled }) {
  const gridStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  };

  const rowStyle = {
    display: 'flex',
    justifyContent: 'center'
  };

  return (
    <div style={gridStyle}>
      {puzzle.map((row, rowIndex) => (
        <div key={rowIndex} style={rowStyle}>
          {row.map((cell, cellIndex) => (
            <Square key={cellIndex} value={cell} onChange={(e) => onCellChange(rowIndex, cellIndex, e.target.value)} disabled={disabled} />
          ))}
        </div>
      ))}
    </div>
  );
};

