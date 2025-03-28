import React, { useState } from 'react';
import './SnakeGame.css'; // Vẫn dùng CSS chung
import { GridSize } from '../types';

interface GridSettingFormProps {
  gridWidth: number;
  gridHeight: number;
  onSubmit: (gridSize: GridSize) => void;
}

const GridSettingForm: React.FC<GridSettingFormProps> = ({
  gridWidth,
  gridHeight,
  onSubmit,
}) => {

  const [gridW, setGridW] = useState(gridWidth);
  const [gridH, setGridH] = useState(gridHeight);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({width: gridW, height: gridH});
  };

  return (
    <form onSubmit={handleSubmit} className="grid-setting-form">
      <div>
        <label>Width: </label>
        <input
          type="number"
          min="5"
          max="50"
          value={gridW}
          onChange={(e) => setGridW(Number(e.target.value))}
        />
      </div>
      <div>
        <label>Height: </label>
        <input
          type="number"
          min="5"
          max="50"
          value={gridH}
          onChange={(e) => setGridH(Number(e.target.value))}
        />
      </div>
      <button type="submit">Apply</button>
    </form>
  );
};

export default GridSettingForm;