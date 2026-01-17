'use client';

import React, { useState, useEffect, useRef } from 'react';
import GameCanvas from './GameCanvas';
import UIOverlay from './UIOverlay';
import { GameStatus, CompletionData } from './types';

const GameContainer: React.FC = () => {
  const [gameState, setGameState] = useState<GameStatus>('start');
  const [jumpModifier, setJumpModifier] = useState<number>(1.0);
  const [completionData, setCompletionData] = useState<CompletionData | null>(null);
  const [lives, setLives] = useState<number>(9);
  const startTimeRef = useRef<number>(0);

  // Calculate points based on completion time
  const calculatePoints = (timeInSeconds: number): number => {
    // Point system: Start with 10000 points, lose 100 points per second
    // Minimum 1000 points
    const basePoints = 10000;
    const pointsPerSecond = 100;
    const points = Math.max(1000, basePoints - Math.floor(timeInSeconds * pointsPerSecond));
    return points;
  };

  // Track game start time
  useEffect(() => {
    if (gameState === 'playing') {
      startTimeRef.current = Date.now();
      setCompletionData(null);
      setLives(9);
    }
  }, [gameState]);

  // Calculate completion data when game is won
  useEffect(() => {
    if (gameState === 'won' && startTimeRef.current > 0) {
      const completionTime = (Date.now() - startTimeRef.current) / 1000; // Convert to seconds
      const points = calculatePoints(completionTime);
      setCompletionData({
        completionTime,
        points
      });
    }
  }, [gameState]);

  const handleRestart = () => {
    setGameState('playing');
  };

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      <GameCanvas
        gameState={gameState}
        setGameState={setGameState}
        jumpModifier={jumpModifier}
        lives={lives}
        setLives={setLives}
      />
      <UIOverlay
        gameState={gameState}
        jumpModifier={jumpModifier}
        setJumpModifier={setJumpModifier}
        onRestart={handleRestart}
        completionData={completionData}
        lives={lives}
      />
    </div>
  );
};

export default GameContainer;