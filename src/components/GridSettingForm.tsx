import React, { useState } from "react";
import "./SnakeGame.css"; // Vẫn dùng CSS chung
import { GridSize } from "../types";

interface GridSettingFormProps {
  gridSize: GridSize;
  maxGridSize?: GridSize;
  minGridSize?: GridSize;
  onSubmit: (gridSize: GridSize) => void;
  onCancel?: () => void;
}

const GridSettingForm: React.FC<GridSettingFormProps> = ({
  gridSize,
  onSubmit,
  onCancel,
  maxGridSize,
  minGridSize
}) => {
  const [gridW, setGridW] = useState(gridSize.width);
  const [gridH, setGridH] = useState(gridSize.height);

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
          min={minGridSize?.width || 5}
          max={maxGridSize?.width || 50}
          value={gridW}
          onChange={(e) => setGridW(Number(e.target.value))}
        />
      </div>
      <div>
        <label className="form-label">Height: </label>
        <input
          type="number"
          min={minGridSize?.height || 5}
          max={maxGridSize?.height || 35}
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
