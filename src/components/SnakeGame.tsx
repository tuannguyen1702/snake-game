import React, { useCallback, useEffect, useState } from "react";
import "./SnakeGame.css";
import GridSettingForm from "./GridSettingForm";
import { Direction, GridSize, Position } from "../types";

const GRID_SIZE_DEFAULT: GridSize = { width: 15, height: 20 };
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
  const [youWin, setYouWin] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const generateBait = (newSnake: Position[]) => {
    if (newSnake.length >= gridSize.height * gridSize.width) return;

    const newBaitPosition = {
      x: Math.floor(Math.random() * gridSize.width),
      y: Math.floor(Math.random() * gridSize.height),
    };

    // Check bait position - The bait will be regenerated if it is at the snake's current position.
    const isOccupied = newSnake.some(
      (snakeItem) =>
        snakeItem.x === newBaitPosition.x && snakeItem.y === newBaitPosition.y
    );

    if (isOccupied) {
      return generateBait(newSnake);
    }

    return newBaitPosition;
  };

  const handleSetGridSize = (gridSize: GridSize) => {
    setGridSize(gridSize);
    setOpenSetting(false);
  };

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setBait(generateBait(INITIAL_SNAKE));
    setDirection("");
    setScore(0);
    setGameOver(false);
    setYouWin(false);
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
    if (!bait || !direction || gameOver || youWin) return;

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

        
        if (
          // Check collision with walls
          head.x < 0 ||
          head.x >= gridSize.width ||
          head.y < 0 ||
          head.y >= gridSize.height ||
          // Check collision with itself
          newSnake.some(
            (position) => position.x === head.x && position.y === head.y
          )
        ) {
          setGameOver(true);
          return prevSnake;
        }

        newSnake.unshift(head);

        // Check you win
        if (newSnake.length >= gridSize.height * gridSize.width - 1) {
          setScore((prev) => prev + 1);
          setYouWin(true);
          return newSnake;
        }

        // Check if bail is eaten
        if (head.x === bait.x && head.y === bait.y) {
          setScore((prev) => prev + 1);
          setBait(generateBait(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 200);

    return () => clearInterval(moveSnake);
  }, [direction, bait, gameOver, youWin]);

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
        <h2 className="game-score">Score: {score}</h2>
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
          <h2>You Lose</h2>
          <button className="btn-primary" onClick={resetGame}>
            Play Again
          </button>
        </div>
      )}

      {youWin && (
        <div className="game-win">
          <h2>You Win!</h2>
          <button className="btn-primary" onClick={resetGame}>
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default SnakeGame;
