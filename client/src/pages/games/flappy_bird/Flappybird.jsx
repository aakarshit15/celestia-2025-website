import React, { useState, useEffect, useRef } from "react";
import bgImg from "../../../assets/flappybird_bg.png";
import pillarImgSrc from "../../../assets/pillar.png";
import birdImg from "../../../assets/aladin.png";

const FlappyBird = () => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState("start");

  // Bird properties
  const bird = useRef(200);
  const speed = useRef(0);
  const gravity = useRef(0.5); // faster fall
  const jump = useRef(-11); // stronger jump to balance gravity
  const strongJump = -13; // stronger jump for higher score

  // Obstacles
  const obstacles = useRef([]);

  // Score
  const score = useRef(0);

  // Pillar speed
  const pillarSpeed = useRef(3.5); // faster pillar movement

  // Difficulty scaling
  const difficultyTimer = useRef(0);

  // Background animation for mobile
  const bgOffset = useRef(0);
  const isMobile = useRef(window.innerWidth <= 768);
  const bgWidth = useRef(0);
  const bgHeight = useRef(0);

  // Game over timer
  const gameOverTimer = useRef(null);
  const showRestart = useRef(false);

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

  // Basic page styling
  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflow = "hidden";
  }, []);

  // Canvas resizing
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

  // Start restart timer when game over
  useEffect(() => {
    if (gameState === "gameOver") {
      showRestart.current = false;
      if (gameOverTimer.current) clearTimeout(gameOverTimer.current);
      gameOverTimer.current = setTimeout(() => {
        showRestart.current = true;
        gameOverTimer.current = null;
      }, 3000);
    }
  }, [gameState]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let frameId;

    const MIN_PIPE_HEIGHT = 50;
    const GAP_MIN = 320;
    const GAP_MAX = 400;
    const birdX = 80;
    const birdWidth = 80;
    const birdHeight = 100;

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
      const titleSize = Math.min(canvas.width / 8, 100);
      const instructionSize = Math.min(canvas.width / 20, 35);
      const startBirdWidth = Math.min(canvas.width / 6, 100);
      const startBirdHeight = Math.min(canvas.height / 4, 150);

      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      const overlayY = canvas.height / 2 - canvas.height / 4;
      const overlayHeight = canvas.height / 2;
      ctx.fillRect(0, overlayY, canvas.width, overlayHeight);

      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      ctx.shadowBlur = 15;
      ctx.shadowOffsetX = 4;
      ctx.shadowOffsetY = 4;

      ctx.fillStyle = "#FFD700";
      ctx.font = `bold ${titleSize}px 'Brush Script MT', cursive`;
      ctx.textAlign = "center";
      ctx.lineWidth = Math.max(titleSize / 10, 8);
      ctx.strokeStyle = "#8B4513";
      ctx.strokeText(
        "Flappy Bird",
        canvas.width / 2,
        canvas.height / 2 - canvas.height / 8
      );
      ctx.fillText(
        "Flappy Bird",
        canvas.width / 2,
        canvas.height / 2 - canvas.height / 8
      );

      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      const bounceOffset = Math.sin(Date.now() / 300) * 15;
      ctx.drawImage(
        birdImgRef.current,
        canvas.width / 2 - startBirdWidth / 2,
        canvas.height / 2 - startBirdHeight / 2 + bounceOffset,
        startBirdWidth,
        startBirdHeight
      );

      const pulseAlpha = 0.7 + Math.sin(Date.now() / 500) * 0.3;
      ctx.fillStyle = `rgba(255, 255, 255, ${pulseAlpha})`;
      ctx.font = `bold ${instructionSize}px Arial`;
      ctx.lineWidth = 3;
      ctx.strokeStyle = "rgba(0, 0, 0, 0.8)";
      ctx.strokeText(
        "Click or press SPACE to Start",
        canvas.width / 2,
        canvas.height / 2 + canvas.height / 6
      );
      ctx.fillText(
        "Click or press SPACE to Start",
        canvas.width / 2,
        canvas.height / 2 + canvas.height / 6
      );

      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      ctx.font = `${instructionSize * 0.5}px Arial`;
      ctx.fillText(
        "Click, tap, or press SPACE to flap",
        canvas.width / 2,
        canvas.height / 2 + canvas.height / 6 + instructionSize
      );
    };

    const drawGameOver = () => {
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillRect(canvas.width / 2 - 200, canvas.height / 2 - 100, 400, 200);

      ctx.fillStyle = "red";
      ctx.font = "bold 40px Arial";
      ctx.textAlign = "center";
      ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 20);

      ctx.fillStyle = "white";
      ctx.font = "20px Arial";
      ctx.fillText(
        `Your Score is: ${score.current}`,
        canvas.width / 2,
        canvas.height / 2 + 20
      );
    };

    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background scrolling
      if (isMobile.current && bgWidth.current > 0) {
        const scale = canvas.height / bgHeight.current;
        const scaledWidth = bgWidth.current * scale;
        if (gameState === "playing" || gameState === "gameOver") {
          bgOffset.current -= 2;
          if (bgOffset.current <= -scaledWidth) bgOffset.current = 0;
        }
        ctx.drawImage(
          bg.current,
          bgOffset.current,
          0,
          scaledWidth,
          canvas.height
        );
        ctx.drawImage(
          bg.current,
          bgOffset.current + scaledWidth,
          0,
          scaledWidth,
          canvas.height
        );
      } else {
        ctx.drawImage(bg.current, 0, 0, canvas.width, canvas.height);
      }

      if (gameState === "start") drawTitle();

      if (gameState === "playing") {
        if (score.current >= 20) jump.current = strongJump;

        // Increase difficulty faster over time
        difficultyTimer.current++;
        if (difficultyTimer.current % 180 === 0) {
          if (pillarSpeed.current < 12) pillarSpeed.current += 0.25;
          if (gravity.current < 1.3) gravity.current += 0.03;
          if (jump.current > -16) jump.current -= 0.3;
        }

        speed.current += gravity.current;
        bird.current += speed.current;
        drawBird();

        // Spawn pillars
        const lastPillar = obstacles.current[obstacles.current.length - 1];
        const distanceBetween = Math.random() * (380 - 260) + 260;

        if (!lastPillar || lastPillar.x < canvas.width - distanceBetween) {
          const randomGap = Math.random() * (GAP_MAX - GAP_MIN) + GAP_MIN;
          const maxTopHeight = canvas.height - randomGap - MIN_PIPE_HEIGHT;
          const topHeight =
            Math.random() * (maxTopHeight - MIN_PIPE_HEIGHT) + MIN_PIPE_HEIGHT;

          obstacles.current.push({
            x: canvas.width,
            top: topHeight,
            bottom: topHeight + randomGap,
            passed: false,
          });
        }

        obstacles.current.forEach((obs, index) => {
          obs.x -= pillarSpeed.current;

          const pipeWidth = 60;
          ctx.drawImage(pillarImg.current, obs.x, 0, pipeWidth, obs.top);
          ctx.drawImage(
            pillarImg.current,
            obs.x,
            obs.bottom,
            pipeWidth,
            canvas.height - obs.bottom
          );

          // Collision detection
          const collisionPadding = 20;
          const hitX =
            birdX + birdWidth / 2 - collisionPadding > obs.x &&
            birdX - birdWidth / 2 + collisionPadding < obs.x + pipeWidth;
          const hitY =
            bird.current - birdHeight / 2 + collisionPadding < obs.top ||
            bird.current + birdHeight / 2 - collisionPadding > obs.bottom;

          if (hitX && hitY) setGameState("gameOver");

          if (!obs.passed && obs.x + pipeWidth < birdX - birdWidth / 2) {
            score.current++;
            obs.passed = true;
          }

          if (obs.x + pipeWidth < 0) obstacles.current.splice(index, 1);
        });

        if (bird.current + birdHeight / 2 > canvas.height)
          setGameState("gameOver");

        drawScore();
      }

      if (gameState === "gameOver") {
        drawBird();
        obstacles.current.forEach((obs) => {
          const pipeWidth = 60;
          ctx.drawImage(pillarImg.current, obs.x, 0, pipeWidth, obs.top);
          ctx.drawImage(
            pillarImg.current,
            obs.x,
            obs.bottom,
            pipeWidth,
            canvas.height - obs.bottom
          );
        });
        drawScore();
        drawGameOver();

        if (showRestart.current) {
          ctx.fillStyle = "white";
          ctx.font = "20px Arial";
          ctx.textAlign = "center";
          ctx.fillText(
            "Click or press SPACE to restart",
            canvas.width / 2,
            canvas.height / 2 + 60
          );
        }
      }

      frameId = requestAnimationFrame(gameLoop);
    };

    gameLoop();
    return () => cancelAnimationFrame(frameId);
  }, [gameState]);

  const handleClick = () => {
    if (
      gameState === "start" ||
      (gameState === "gameOver" && showRestart.current)
    ) {
      setGameState("playing");
      bird.current = 200;
      speed.current = 0;
      score.current = 0;
      obstacles.current = [];
      pillarSpeed.current = 3.5;
      gravity.current = 0.5;
      jump.current = -11;
      difficultyTimer.current = 0;
      showRestart.current = false;
      if (gameOverTimer.current) clearTimeout(gameOverTimer.current);
    } else if (gameState === "playing") {
      speed.current = jump.current;
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space" || e.key === " ") {
        e.preventDefault();
        handleClick();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState]);

  return (
    <canvas
      ref={canvasRef}
      className="w-screen h-screen block"
      onClick={handleClick}
      onTouchStart={handleClick}
    />
  );
};

export default FlappyBird;
