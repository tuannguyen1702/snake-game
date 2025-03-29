import React, { useCallback, useEffect, useState } from "react";
import "./SnakeGame.css";
import GridSettingForm from "./GridSettingForm";
import { Direction, GridSize, Position } from "../types";

import keys from "../assets/keys.svg";
import settings from "../assets/settings.svg";
import help from "../assets/help.svg";

const GRID_SIZE_DEFAULT: GridSize = { width: 15, height: 20 };
const GRID_SIZE_MIN: GridSize = { width: 5, height: 5 };
const CELL_SIZE = 20;
const DIRECTION_DEFAULT = "RIGHT";
const INITIAL_SNAKE: Position[] = [
  { x: 2, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: 0 },
];

const SnakeGame: React.FC = () => {
  const [gridSize, setGridSize] = useState(GRID_SIZE_DEFAULT);
  const [maxGridSize, setMaxGridSize] = useState<GridSize | undefined>();
  const [openSetting, setOpenSetting] = useState(false);
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [bait, setBait] = useState<Position | undefined>();
  const [direction, setDirection] = useState<Direction>(DIRECTION_DEFAULT);
  const [isStarted, setIsStarted] = useState<boolean>(false);

  const [gameOver, setGameOver] = useState<boolean>(false);
  const [youWin, setYouWin] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [showHelp, setShowHelp] = useState<boolean>(true);

  const generateBait = (newSnake: Position[]) => {
    // Check if the snake occupies the entire grid (no space for bait)
    // If true, return undefined to indicate no new bait can be generated
    if (newSnake.length >= gridSize.height * gridSize.width) return;

    const newBaitPosition = {
      x: Math.floor(Math.random() * gridSize.width),
      y: Math.floor(Math.random() * gridSize.height),
    };

    // Check if the new bait position overlaps with any part of the snake
    const isOccupied = newSnake.some(
      (snakeItem) =>
        snakeItem.x === newBaitPosition.x && snakeItem.y === newBaitPosition.y
    );

    // If the position is occupied by the snake, recursively call generateBait to try again
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
    setDirection(DIRECTION_DEFAULT);
    setIsStarted(false);
    setScore(0);
    setGameOver(false);
    setYouWin(false);
  };

  // Function to calculate grid size based on viewport dimensions
  const updateMaxGridSize = () => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Calculate max grid size to fit the viewport, leaving padding
    let maxWidth = Math.floor((viewportWidth - CELL_SIZE - 32) / CELL_SIZE); // 32px padding
    let maxHeight = Math.floor((viewportHeight - CELL_SIZE - 100) / CELL_SIZE); // 100px for header and padding

    if (maxWidth < GRID_SIZE_MIN.width) maxWidth = GRID_SIZE_MIN.width;
    if (maxHeight < GRID_SIZE_MIN.height) maxHeight = GRID_SIZE_MIN.height;

    setMaxGridSize({ width: maxWidth, height: maxHeight });

    if (maxWidth < gridSize.width || maxHeight < gridSize.height)
      setGridSize({
        width: maxWidth < gridSize.width ? maxWidth : gridSize.width,
        height: maxHeight < gridSize.height ? maxHeight : gridSize.height,
      });
  };

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (openSetting) return;

      let newDirection: Direction | null = null;

      switch (e.key) {
        case "ArrowUp":
          if (direction !== "DOWN") newDirection = "UP";
          break;
        case "ArrowDown":
          if (direction !== "UP") newDirection = "DOWN";
          break;
        case "ArrowLeft":
          if (direction !== "RIGHT") newDirection = "LEFT";
          break;
        case "ArrowRight":
          if (direction !== "LEFT") newDirection = "RIGHT";
          break;
      }

      if (newDirection) {
        setDirection(newDirection);

        if (!isStarted) {
          setIsStarted(true);
          setShowHelp(false);
        }
      }
    },
    [direction]
  );

  useEffect(() => {
    if (!isStarted || !bait || !direction || gameOver || youWin) return;

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
  }, [direction, bait, gameOver, youWin, isStarted]);

  useEffect(() => {
    resetGame();
  }, [gridSize]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  useEffect(() => {
    window.addEventListener("resize", updateMaxGridSize);
    return () => {
      window.removeEventListener("resize", updateMaxGridSize);
    };
  }, [gridSize]);

  useEffect(() => {
    updateMaxGridSize();
  }, []);

  return (
    <div className="game-container">
      <div className="game-header">
        <h3 className="game-score">Score: {score}</h3>
        <button
          className="btn-link"
          onClick={() => {
            setShowHelp(true);
            resetGame();
          }}
        >
          <img height={20} src={help} />
        </button>
        <button
          className="btn-link"
          onClick={() => {
            setOpenSetting(true);
            resetGame();
          }}
        >
          <img height={20} src={settings} />
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
                transform: `translate(${position.x * CELL_SIZE}px, ${
                  position.y * CELL_SIZE
                }px)`,
              }}
            />
          ))}
        </div>

        {bait && (
          <div
            className="bait"
            style={{
              transform: `translate(${bait.x * CELL_SIZE}px, ${
                bait.y * CELL_SIZE
              }px)`,
            }}
          />
        )}
      </div>

      {openSetting && (
        <GridSettingForm
          gridSize={gridSize}
          maxGridSize={maxGridSize}
          minGridSize={GRID_SIZE_MIN}
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

      {showHelp && (
        <div className="game-help">
          <img width={100} src={keys} />
        </div>
      )}
    </div>
  );
};

export default SnakeGame;
