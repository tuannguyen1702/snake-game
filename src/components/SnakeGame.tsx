import React, { useCallback, useEffect, useState } from "react";
import "./SnakeGame.css";
import GridSettingForm from "./GridSettingForm";
import { Direction, GridSize, Position } from "../types";

const GRID_SIZE_DEFAULT: GridSize = { width: 20, height: 30 };
const CELL_SIZE = 20;
const INITIAL_SNAKE: Position[] = [
  { x: 2, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: 0 },
];

const SnakeGame: React.FC = () => {
  const [gridSize, setGridSize] = useState(GRID_SIZE_DEFAULT);
  const [openSetting, setOpenSetting] = useState(false);
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [bait, setBait] = useState<Position | undefined>();
  const [direction, setDirection] = useState<Direction | "">("");
  const [gameOver, setGameOver] = useState<boolean>(false);

  const generateBait = () => {
    return {
      x: Math.floor(Math.random() * gridSize.width),
      y: Math.floor(Math.random() * gridSize.height),
    };
  };

  const handleSetGridSize = (gridSize: GridSize) => {
    setGridSize(gridSize);
    setOpenSetting(false);
  };

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setBait(generateBait());
    setDirection("");
    setGameOver(() => false);
  };

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          if (direction !== "DOWN") setDirection("UP");
          break;
        case "ArrowDown":
          if (direction !== "UP") setDirection("DOWN");
          break;
        case "ArrowLeft":
          if (direction !== "RIGHT") setDirection("LEFT");
          break;
        case "ArrowRight":
          if (direction !== "LEFT") setDirection("RIGHT");
          break;
      }
    },
    [direction]
  );

  useEffect(() => {
    if (!bait || !direction || gameOver) return;

    const moveSnake = setInterval(() => {
      setSnake((prevSnake) => {
        const newSnake = [...prevSnake];
        const head = { ...newSnake[0] };

        switch (direction) {
          case "UP":
            head.y--;
            break;
          case "DOWN":
            head.y++;
            break;
          case "LEFT":
            head.x--;
            break;
          case "RIGHT":
            head.x++;
            break;
        }

        // Check collision with walls
        if (
          head.x < 0 ||
          head.x >= gridSize.width ||
          head.y < 0 ||
          head.y >= gridSize.height
        ) {
          setGameOver(true);
          return prevSnake;
        }

        if (
          newSnake.some(
            (position) => position.x === head.x && position.y === head.y
          )
        ) {
          setGameOver(true);
          return prevSnake;
        }

        newSnake.unshift(head);

        // Check if bail is eaten
        if (head.x === bait.x && head.y === bait.y) {
          setBait(generateBait());
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 150);

    return () => clearInterval(moveSnake);
  }, [direction, bait, gameOver]);

  useEffect(() => {
    resetGame();
  }, [gridSize]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

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
          width: gridSize.width * CELL_SIZE + 3,
          height: gridSize.height * CELL_SIZE + 3,
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

        {bait && (
          <div
            className="bait"
            style={{
              left: bait.x * CELL_SIZE,
              top: bait.y * CELL_SIZE,
            }}
          />
        )}
      </div>

      {openSetting && (
        <GridSettingForm
          gridSize={gridSize}
          onSubmit={handleSetGridSize}
          onCancel={() => setOpenSetting(false)}
        />
      )}
      {gameOver && (
        <div className="game-over">
          <p>Game Over!</p>
          <button className="btn-primary" onClick={resetGame}>Play Again</button>
        </div>
      )}
    </div>
  );
};

export default SnakeGame;
