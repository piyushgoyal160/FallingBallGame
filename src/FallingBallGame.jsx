import { useState, useEffect, useRef } from "react";

export default function FallingBallGame() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const gameOngoing = gameStarted && !gameOver;

  const startGame = () => {
    setScore(0);
    setGameStarted(true);
    setGameOver(false);
  };

  return (
    <div className="bg-[#01310f] text-[#f2f4cb] w-[92dvw] max-w-170 aspect-[9/14] md:aspect-square max-h-[80dvh] p-4 md:p-8 gap-4 flex flex-col items-center justify-between rounded-xl text-center relative overflow-hidden">
      <h1 className="text-3xl md:text-5xl font-serif">Falling Ball Game</h1>
      <p className="text-xl md:text-2xl">
        Score: {score} | High Score: {highScore}
      </p>
      {!gameOngoing && (
        <button
          onClick={startGame}
          className="bg-[#008a37] py-2 md:py-4 p-4 md:px-10 rounded-md text-xl md:text-2xl"
        >
          {gameOver ? "Play Again" : "Play Game"}
        </button>
      )}
      <div className="bg-[#00421b] basis-4/5 md:basis-3/5 self-stretch rounded-xl">
        {gameOngoing && (
          <Game
            score={score}
            setScore={setScore}
            setHighScore={setHighScore}
            setGameOver={setGameOver}
          />
        )}
      </div>
    </div>
  );
}

function Game({ score, setScore, setHighScore, setGameOver }) {
  const [ballPosition, setBallPosition] = useState({ x: 50, y: 0 });
  const [speed, setSpeed] = useState(0.5);
  const [bowlX, setBowlX] = useState(50);
  const [catchEffect, setCatchEffect] = useState(false);
  const gameAreaRef = useRef(null);
  const missedCatchRef = useRef(false);
  const animationRef = useRef(null);

  const gameContainerRect = gameAreaRef?.current?.getBoundingClientRect();

  const handleMouseMove = (event) => {
    if (!gameContainerRect) return;
    let clientX = event.touches ? event.touches[0].clientX : event.clientX;
    let relativeX =
      ((clientX - gameContainerRect.left) / gameContainerRect.width) * 100;
    setBowlX(Math.max(10, Math.min(90, relativeX)));
  };

  useEffect(() => {
    const updateBallPosition = () => {
      setBallPosition((prev) => {
        if (prev.y >= 90) {
          if (Math.abs(prev.x - bowlX) < 14) {
            setScore((s) => s + 10);  // Production
        //  setScore((s) => s + 5);      Development 
            setSpeed((s) => Math.min(s + 0.05, 1));
            setCatchEffect(true);
            setTimeout(() => setCatchEffect(false), 300);
            missedCatchRef.current = false;
            return { x: Math.random() * 80 + 10, y: 0 };
          } else {
            if (!missedCatchRef.current) {
              missedCatchRef.current = true;
              return prev;
            } else {
              setGameOver(true);
              setHighScore((prevHigh) => Math.max(prevHigh, score));
              return prev;
            }
          }
        }
        return { x: prev.x, y: prev.y + speed };
      });

      animationRef.current = requestAnimationFrame(updateBallPosition);
    };

    animationRef.current = requestAnimationFrame(updateBallPosition);

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [score, setScore, setGameOver, setHighScore, speed, bowlX]);

  return (
    <div
      ref={gameAreaRef}
      className="w-full h-full relative overflow-hidden cursor-none"
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
    >
      <img
        src="/coin.png"
        alt="Coin"
        className={`absolute w-10 h-10 bg-red-500 rounded-full transition-transform duration-300 ${
          catchEffect ? "scale-125 bg-green-500" : ""
        }`}
        style={{
          left: `${ballPosition.x}%`,
          top: `${ballPosition.y}%`,
          transform: "translate(-50%, -50%)",
        }}
      />
      <div
        className="absolute bottom-2 w-32 h-6 bg-[#f2f4cb] rounded-lg transition-transform duration-100"
        style={{ left: `${bowlX}%`, transform: "translateX(-50%)" }}
      ></div>
      {/* <img
        id="car"
        src="/car2.jpeg"
        alt="Car"
        className="absolute bottom-2 w-32 rounded-lg transition-transform duration-100"
        style={{ left: `${bowlX}%`, transform: "translateX(-50%)" }}
      /> */}
      {catchEffect && (
        <div
          className="absolute size-14 bg-green-400 rounded-full animate-ping"
          style={{
            left: `calc(${bowlX}% - 27px)`,
            bottom: "1%",
            // transform: "translate(-50%, 50%)",
          }}
        ></div>
      )}
    </div>
  );
}
