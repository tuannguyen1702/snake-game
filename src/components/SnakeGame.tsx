import React, { useState } from "react";
import "./SnakeGame.css";
import GridSettingForm from "./GridSettingForm";
import { GridSize, Position } from "../types";

const GRID_W = 20;
const GRID_H = 30;
const CELL_SIZE = 20;
const INITIAL_SNAKE: Position[] = [
  { x: 2, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: 0 },
];

const SnakeGame: React.FC = () => {
  const [gridW, setGridW] = useState(GRID_W);
  const [gridH, setGridH] = useState(GRID_H);
  const [openSetting, setOpenSetting] = useState(false);

  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [bait, setBait] = useState<Position>(generateBait());

  function generateBait(): Position {
    return {
      x: Math.floor(Math.random() * gridW),
      y: Math.floor(Math.random() * gridH),
    };
  }

  const setGridSize = (gridSize: GridSize) => {
    setGridW(gridSize.width);
    setGridH(gridSize.height);
    setOpenSetting(false);
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <button
          onClick={() => {
            setOpenSetting(true);
          }}
        >
          Setting
        </button>
      </div>
      <div
        className="game-board"
        style={{
          width: gridW * CELL_SIZE + 3,
          height: gridH * CELL_SIZE + 3,
        }}
      >
        <div className="snake-container">
          {snake.map((position, index) => (
            <div
              key={index}
              className="snake"
              style={{
                left: position.x * CELL_SIZE,
                top: position.y * CELL_SIZE,
              }}
            />
          ))}
        </div>

        <div
          className="bait"
          style={{
            left: bait.x * CELL_SIZE,
            top: bait.y * CELL_SIZE,
          }}
        />
      </div>

      {openSetting && (
        <GridSettingForm
          gridWidth={gridW}
          gridHeight={gridH}
          onSubmit={setGridSize}
          onCancel={() => setOpenSetting(false)}
        />
      )}
    </div>
  );
};

export default SnakeGame;
