import React, { useState } from "react";
import "./SnakeGame.css";
import GridSettingForm from "./GridSettingForm";
import { GridSize } from "../types";

const GRID_W = 20;
const GRID_H = 30;
const CELL_SIZE = 20;

const SnakeGame: React.FC = () => {
  const [gridW, setGridW] = useState(GRID_W);
  const [gridH, setGridH] = useState(GRID_H);

  const setGridSize = (gridSize: GridSize) => {
    setGridW(gridSize.width)
    setGridH(gridSize.height)
  }

  return (
    <div className="game-container">
      <div
        className="game-board"
        style={{
          width: gridW * CELL_SIZE,
          height: gridH * CELL_SIZE,
        }}
      ></div>

      <GridSettingForm gridWidth={gridW} gridHeight={gridH} onSubmit={setGridSize} />
    </div>
  );
};

export default SnakeGame;
