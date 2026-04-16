'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { getGameById, getGamesByCategory } from '@/lib/games';
import GameCard from '@/components/GameCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ArrowLeft, Share2, Maximize2, Gamepad2, Tag, Trophy, Info, RotateCcw, LogOut } from 'lucide-react';

export default function GamePage() {
  const params = useParams();
  const gameId = params?.id as string;
  const [isLoading, setIsLoading] = useState(true);
  const [isGameLoaded, setIsGameLoaded] = useState(false);
  const [game, setGame] = useState<any>(null);
  const [relatedGames, setRelatedGames] = useState<any[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setIsGameLoaded(false);

    const foundGame = getGameById(gameId);

    if (!foundGame) {
      notFound();
      return;
    }

    setGame(foundGame);

    const related = getGamesByCategory(foundGame.category)
      .filter(g => g.id !== foundGame.id)
      .slice(0, 4);
    setRelatedGames(related);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [gameId]);

  // Listen for game over messages from iframe
  const handleGameMessage = useCallback((event: MessageEvent) => {
    if (event.data && event.data.type === 'gameOver') {
      const { score, highScore: newHighScore } = event.data;
      const storedHigh = Number(localStorage.getItem(`game-highscore-${game?.id}`) || 0);
      const updatedHigh = Math.max(storedHigh, score, newHighScore || 0);

      setCurrentScore(score);
      setHighScore(updatedHigh);
      if (game) {
        localStorage.setItem(`game-highscore-${game.id}`, updatedHigh.toString());
      }
    }

    // Handle exit game message
    if (event.data && event.data.type === 'exitGame') {
      window.location.href = '/';
    }
  }, [game]);

  useEffect(() => {
    window.addEventListener('message', handleGameMessage);
    return () => window.removeEventListener('message', handleGameMessage);
  }, [handleGameMessage]);

  useEffect(() => {
    setIsTouchDevice(typeof navigator !== 'undefined' && ('maxTouchPoints' in navigator ? navigator.maxTouchPoints > 0 : 'ontouchstart' in window));
  }, []);

  useEffect(() => {
    if (!game) return;
    const savedScore = localStorage.getItem(`game-highscore-${game.id}`);
    if (savedScore) {
      setHighScore(Number(savedScore));
    }
  }, [game]);

  const handleShare = () => {
    if (navigator.share && game) {
      navigator.share({
        title: game.title,
        text: game.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const toggleFullscreen = () => {
    const iframe = document.getElementById('game-iframe');
    if (!iframe) return;

    if (!document.fullscreenElement) {
      iframe.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleExit = () => {
    window.location.href = '/';
  };

  const handleRestart = () => {
    const iframe = document.getElementById('game-iframe') as HTMLIFrameElement;
    if (iframe) {
      iframe.src = iframe.src;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading game..." />
      </div>
    );
  }

  if (!game) {
    notFound();
    return null;
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Games</span>
            </Link>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRestart}
                className="p-2 bg-gray-800 rounded-lg text-gray-400 hover:text-green-400 hover:bg-gray-700 transition-colors"
                title="Restart Game"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <button
                onClick={handleExit}
                className="p-2 bg-gray-800 rounded-lg text-gray-400 hover:text-red-400 hover:bg-gray-700 transition-colors"
                title="Exit to Home"
              >
                <LogOut className="w-5 h-5" />
              </button>
              <button
                onClick={handleShare}
                className="p-2 bg-gray-800 rounded-lg text-gray-400 hover:text-purple-400 hover:bg-gray-700 transition-colors"
                title="Share"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={toggleFullscreen}
                className="p-2 bg-gray-800 rounded-lg text-gray-400 hover:text-purple-400 hover:bg-gray-700 transition-colors"
                title="Fullscreen"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Game Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Game Title & Info */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {game.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-semibold">
                  {game.category}
                </span>
                <div className="flex flex-wrap gap-2">
                  {game.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 px-2 py-1 bg-gray-800 text-gray-400 rounded-full text-xs"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Score Display */}
            {highScore > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/30">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <div>
                  <p className="text-xs text-gray-400">High Score</p>
                  <p className="text-xl font-bold text-yellow-500">{highScore.toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>
          <p className="text-gray-400">{game.description}</p>
        </div>

        {/* Game Frame */}
        <div className="relative bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-800 group">
          {/* Loading Overlay */}
          {!isGameLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
              <LoadingSpinner size="lg" text="Loading game..." />
            </div>
          )}
          
          {/* Game Controls Overlay */}
          {showControls && isGameLoaded && (
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <button
                onClick={toggleFullscreen}
                className="p-2 bg-black/70 backdrop-blur-sm rounded-lg text-white hover:bg-black/90 transition-colors"
                title="Fullscreen"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
            </div>
          )}
          
          <iframe
            id="game-iframe"
            src={game.url}
            className="w-full min-h-[420px] h-[60vh] sm:h-[70vh] lg:h-[65vh]"
            allowFullScreen
            onLoad={() => setIsGameLoaded(true)}
            title={game.title}
            allow="autoplay; fullscreen; microphone; gamepad; gyroscope; accelerometer"
            style={{ touchAction: 'manipulation' }}
          />
        </div>

        {/* Game Controls Info */}
        <div className="mt-4 p-4 bg-gradient-to-r from-gray-800/70 to-gray-900/70 rounded-lg border border-gray-700">
          <div className="flex flex-col gap-3 text-gray-300 text-sm sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-purple-400 flex-shrink-0" />
              <span>Tap the game to focus. Use touch controls or fullscreen on mobile for the best experience.</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={toggleFullscreen}
                className="inline-flex items-center gap-2 rounded-full bg-purple-500/20 px-3 py-2 text-white text-xs font-semibold transition-colors hover:bg-purple-500/30"
              >
                <Maximize2 className="w-4 h-4" />
                Fullscreen
              </button>
              <button
                onClick={handleRestart}
                className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-gray-200 text-xs font-semibold transition-colors hover:bg-white/10"
              >
                <RotateCcw className="w-4 h-4" />
                Restart
              </button>
            </div>
          </div>
        </div>

        {/* Related Games */}
        {relatedGames.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedGames.map((relatedGame) => (
                <GameCard key={relatedGame.id} game={relatedGame} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
