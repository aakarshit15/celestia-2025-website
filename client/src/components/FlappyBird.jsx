import React, { useState, useEffect, useRef } from "react";
import bgImg from "../assets/flappybird_bg.png";
import pillarImgSrc from "../assets/pillar.png";
import birdImg from "../assets/aladin.png";

const FlappyBird = () => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState("start");

  // Bird properties
  const bird = useRef(200);
  const speed = useRef(0);
  const gravity = 0.25;
  const jump = -10;

  // Obstacles
  const obstacles = useRef([]);
  const obstacles_timer = useRef(0);

  // Score
  const score = useRef(0);

  // Pillar speed
  const pillarSpeed = useRef(1.5); // starts slow

  // Background animation for mobile
  const bgOffset = useRef(0);
  const isMobile = useRef(window.innerWidth <= 768);
  const bgWidth = useRef(0);
  const bgHeight = useRef(0);

  // Images
  const bg = useRef(new Image());
  bg.current.src = bgImg;
  bg.current.onload = () => {
    bgWidth.current = bg.current.width;
    bgHeight.current = bg.current.height;
  };
  const pillarImg = useRef(new Image());
  pillarImg.current.src = pillarImgSrc;
  const birdImgRef = useRef(new Image());
  birdImgRef.current.src = birdImg;

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflow = "hidden";
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      isMobile.current = window.innerWidth <= 768;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let frameId;

    const GAP = 600;
    const MIN_PIPE_HEIGHT = 150;
    const birdX = 80;
    const birdWidth = 80;
    const birdHeight = 120;

    const drawBird = () => {
      ctx.drawImage(
        birdImgRef.current,
        birdX - birdWidth / 2,
        bird.current - birdHeight / 2,
        birdWidth,
        birdHeight
      );
    };

    const drawScore = () => {
      ctx.fillStyle = "white";
      ctx.font = "bold 40px Arial";
      ctx.textAlign = "center";
      ctx.lineWidth = 4;
      ctx.strokeStyle = "black";
      ctx.strokeText(score.current, canvas.width / 2, 60);
      ctx.fillText(score.current, canvas.width / 2, 60);
    };

    const drawTitle = () => {
      // Responsive font sizes
      const titleSize = Math.min(canvas.width / 8, 100);
      const instructionSize = Math.min(canvas.width / 20, 35);
      
      // Responsive bird size for start screen
      const startBirdWidth = Math.min(canvas.width / 6, 100);
      const startBirdHeight = Math.min(canvas.width / 4, 150);

      // Draw semi-transparent overlay for better text visibility
      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      const overlayY = canvas.height / 2 - canvas.height / 4;
      const overlayHeight = canvas.height / 2;
      ctx.fillRect(0, overlayY, canvas.width, overlayHeight);

      // Title with shadow effect
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      ctx.shadowBlur = 15;
      ctx.shadowOffsetX = 4;
      ctx.shadowOffsetY = 4;
      
      ctx.fillStyle = "#FFD700";
      ctx.font = `bold ${titleSize}px 'Brush Script MT', cursive`;
      ctx.textAlign = "center";
      ctx.lineWidth = Math.max(titleSize / 10, 8);
      ctx.strokeStyle = "#8B4513";
      ctx.strokeText("Flappy Bird", canvas.width / 2, canvas.height / 2 - canvas.height / 8);
      ctx.fillText("Flappy Bird", canvas.width / 2, canvas.height / 2 - canvas.height / 8);

      // Reset shadow for bird
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Animated bird (simple bounce effect)
      const bounceOffset = Math.sin(Date.now() / 300) * 15;
      ctx.drawImage(
        birdImgRef.current,
        canvas.width / 2 - startBirdWidth / 2,
        canvas.height / 2 - startBirdHeight / 2 + bounceOffset,
        startBirdWidth,
        startBirdHeight
      );

      // "Click to start" with pulsing effect
      const pulseAlpha = 0.7 + Math.sin(Date.now() / 500) * 0.3;
      ctx.fillStyle = `rgba(255, 255, 255, ${pulseAlpha})`;
      ctx.font = `bold ${instructionSize}px Arial`;
      ctx.lineWidth = 3;
      ctx.strokeStyle = "rgba(0, 0, 0, 0.8)";
      ctx.strokeText("Click to Start", canvas.width / 2, canvas.height / 2 + canvas.height / 6);
      ctx.fillText("Click to Start", canvas.width / 2, canvas.height / 2 + canvas.height / 6);

      // Add a subtle instruction hint
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      ctx.font = `${instructionSize * 0.5}px Arial`;
      ctx.fillText("Click or tap to flap", canvas.width / 2, canvas.height / 2 + canvas.height / 6 + instructionSize);
    };

    const drawGameOver = () => {
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillRect(canvas.width / 2 - 200, canvas.height / 2 - 80, 400, 160);

      ctx.fillStyle = "red";
      ctx.font = "bold 40px Arial";
      ctx.textAlign = "center";
      ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 10);

      ctx.fillStyle = "white";
      ctx.font = "20px Arial";
      ctx.fillText(
        "Click anywhere to restart",
        canvas.width / 2,
        canvas.height / 2 + 40
      );
    };

    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background - preserve aspect ratio and scroll on mobile
      if (isMobile.current && bgWidth.current > 0) {
        // Calculate scale to fit height, maintaining aspect ratio
        const scale = canvas.height / bgHeight.current;
        const scaledWidth = bgWidth.current * scale;
        
        if (gameState === "playing" || gameState === "gameOver") {
          bgOffset.current -= 1;
          if (bgOffset.current <= -scaledWidth) {
            bgOffset.current = 0;
          }
        }
        
        // Draw two copies for seamless scrolling
        ctx.drawImage(bg.current, bgOffset.current, 0, scaledWidth, canvas.height);
        ctx.drawImage(bg.current, bgOffset.current + scaledWidth, 0, scaledWidth, canvas.height);
      } else {
        // Desktop: stretch to fill screen
        ctx.drawImage(bg.current, 0, 0, canvas.width, canvas.height);
      }

      if (gameState === "start") {
        drawTitle();
      }

      if (gameState === "playing") {
        speed.current += gravity;
        bird.current += speed.current;

        drawBird();

        // Gradually increase pillar speed over time
        if (pillarSpeed.current < 6) pillarSpeed.current += 0.001;

        // Spawn pillars slower
        if (obstacles_timer.current % 220 === 0) {
          const maxPipeHeight = canvas.height - GAP - MIN_PIPE_HEIGHT;
          const topHeight =
            Math.random() * (maxPipeHeight - MIN_PIPE_HEIGHT) + MIN_PIPE_HEIGHT;

          obstacles.current.push({
            x: canvas.width,
            top: topHeight,
            bottom: topHeight + GAP,
            passed: false,
          });
        }

        obstacles.current.forEach((obs, index) => {
          obs.x -= pillarSpeed.current;

          const pipeWidth = 50;

          // Draw top and bottom pillars as rectangles (fast, fewer pixels)
          ctx.drawImage(pillarImg.current, obs.x, 0, pipeWidth, obs.top);
          ctx.drawImage(pillarImg.current, obs.x, obs.bottom, pipeWidth, canvas.height - obs.bottom);

          const hitX =
            birdX + birdWidth / 2 > obs.x && birdX - birdWidth / 2 < obs.x + pipeWidth;
          const hitY =
            bird.current - birdHeight / 2 < obs.top ||
            bird.current + birdHeight / 2 > obs.bottom;

          if (hitX && hitY) setGameState("gameOver");

          if (!obs.passed && obs.x + pipeWidth < birdX - birdWidth / 2) {
            score.current++;
            obs.passed = true;
          }

          if (obs.x + pipeWidth < 0) obstacles.current.splice(index, 1);
        });

        if (bird.current + birdHeight / 2 > canvas.height) setGameState("gameOver");

        obstacles_timer.current++;
        drawScore();
      }

      if (gameState === "gameOver") {
        drawBird();
        obstacles.current.forEach((obs) => {
          const pipeWidth = 50;
          ctx.drawImage(pillarImg.current, obs.x, 0, pipeWidth, obs.top);
          ctx.drawImage(pillarImg.current, obs.x, obs.bottom, pipeWidth, canvas.height - obs.bottom);
        });
        drawScore();
        drawGameOver();
      }

      frameId = requestAnimationFrame(gameLoop);
    };

    gameLoop();
    return () => cancelAnimationFrame(frameId);
  }, [gameState]);

  const handleClick = () => {
    if (gameState === "start" || gameState === "gameOver") {
      setGameState("playing");
      bird.current = 200;
      speed.current = 0;
      score.current = 0;
      obstacles.current = [];
      obstacles_timer.current = 0;
      pillarSpeed.current = 1.5;
    } else if (gameState === "playing") {
      speed.current = jump;
    }
  };

  return <canvas ref={canvasRef} className="w-screen h-screen block" onClick={handleClick} />;
};

export default FlappyBird;