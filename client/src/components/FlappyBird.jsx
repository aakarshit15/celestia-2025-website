import React, { useState, useEffect, useRef } from "react";
import bgImg from "../assets/flappybird_bg.png";      // background image
import pillarImgSrc from "../assets/pillar.png"; // small pillar image

const FlappyBird = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Bird properties
  const bird = useRef(200);
  const speed = useRef(0);
  const gravity = 0.6;
  const jump = -10;

  // Obstacles
  const obstacles = useRef([]);
  const obstacles_timer = useRef(0);

  // Images
  const bg = useRef(new Image());
  bg.current.src = bgImg;

  const pillarImg = useRef(new Image());
  pillarImg.current.src = pillarImgSrc;

  // Fullscreen canvas & disable scrolling
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.style.overflow = "hidden";

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let frameId;

    const GAP = 300; // gap for bird to fly through
    const MIN_PIPE_HEIGHT = 180;

    const gameLoop = () => {
      if (gameOver) return;

      // Draw background
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(bg.current, 0, 0, canvas.width, canvas.height);

      // Bird physics
      speed.current += gravity;
      bird.current += speed.current;

      // Draw bird
      ctx.fillStyle = "yellow";
      ctx.beginPath();
      ctx.arc(80, bird.current, 15, 0, Math.PI * 2);
      ctx.fill();

      // Obstacles
      if (obstacles_timer.current % 180 === 0) {
        const maxPipeHeight = canvas.height - GAP - MIN_PIPE_HEIGHT;
        const topHeight = Math.random() * (maxPipeHeight - MIN_PIPE_HEIGHT) + MIN_PIPE_HEIGHT;

        obstacles.current.push({
          x: canvas.width,
          top: topHeight,
          bottom: topHeight + GAP,
        });
      }

      obstacles.current.forEach((obs, index) => {
        obs.x -= 3;

        // Draw repeating pillar images
        const imgHeight = pillarImg.current.height;

        // Top pillar
        for (let y = 0; y < obs.top; y += imgHeight) {
          ctx.drawImage(pillarImg.current, obs.x, y, 50, imgHeight);
        }

        // Bottom pillar
        for (let y = obs.bottom; y < canvas.height; y += imgHeight) {
          ctx.drawImage(pillarImg.current, obs.x, y, 50, imgHeight);
        }

        // Collision detection
        if (
          80 + 15 > obs.x &&
          80 - 15 < obs.x + 50 &&
          (bird.current - 15 < obs.top || bird.current + 15 > obs.bottom)
        ) {
          setGameOver(true);
        }

        // Score update
        if (obs.x + 50 === 80) setScore((s) => s + 1);

        // Remove off-screen pillars
        if (obs.x + 50 < 0) obstacles.current.splice(index, 1);
      });

      // Ground check
      if (bird.current + 15 > canvas.height) setGameOver(true);

      obstacles_timer.current++;
      frameId = requestAnimationFrame(gameLoop);
    };

    gameLoop();
    return () => cancelAnimationFrame(frameId);
  }, [gameOver]);

  const handleJump = () => {
    if (!gameOver) {
      speed.current = jump;
    } else {
      // Reset game
      bird.current = 200;
      speed.current = 0;
      obstacles.current = [];
      obstacles_timer.current = 0;
      setScore(0);
      setGameOver(false);
    }
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 z-0"
        style={{ display: "block" }}
        onClick={handleJump}
      />
      {/* Score top-right */}
      <div className="absolute top-4 right-4 text-white text-2xl font-bold z-10">
        Score: {score}
      </div>
      {/* Game Over message */}
      {gameOver && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-500 text-3xl font-bold z-10">
          Game Over! Click to restart
        </div>
      )}
    </div>
  );
};

export default FlappyBird;
