import React, { useState } from "react";
import "./SnakeGame.css"; // Vẫn dùng CSS chung
import { GridSize } from "../types";

interface GridSettingFormProps {
  gridWidth: number;
  gridHeight: number;
  onSubmit: (gridSize: GridSize) => void;
  onCancel?: () => void;
}

const GridSettingForm: React.FC<GridSettingFormProps> = ({
  gridWidth,
  gridHeight,
  onSubmit,
  onCancel,
}) => {
  const [gridW, setGridW] = useState(gridWidth);
  const [gridH, setGridH] = useState(gridHeight);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ width: gridW, height: gridH });
  };

  return (
    <form onSubmit={handleSubmit} className="grid-setting-form">
      <div>
        <label className="form-label">Width: </label>
        <input
          type="number"
          min="5"
          max="50"
          value={gridW}
          onChange={(e) => setGridW(Number(e.target.value))}
        />
      </div>
      <div>
        <label className="form-label">Height: </label>
        <input
          type="number"
          min="5"
          max="50"
          value={gridH}
          onChange={(e) => setGridH(Number(e.target.value))}
        />
      </div>
      <div className="form-footer">
        <button
          type="button"
          onClick={() => {
            onCancel?.();
          }}
        >
          Cancel
        </button>
        <button className="btn-primary" type="submit">
          Apply
        </button>
      </div>
    </form>
  );
};

export default GridSettingForm;
