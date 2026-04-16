'use client';

import { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getGameById, getGamesByCategory } from '@/lib/games';
import GameCard from '@/components/GameCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ArrowLeft, Share2, Maximize2, Gamepad2, Tag } from 'lucide-react';

export default function GamePage() {
  const params = useParams();
  const gameId = params?.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isGameLoaded, setIsGameLoaded] = useState(false);
  const [game, setGame] = useState<any>(null);
  const [relatedGames, setRelatedGames] = useState<any[]>([]);

  useEffect(() => {
    // Simulate loading
    setIsLoading(true);
    setIsGameLoaded(false);
    
    const foundGame = getGameById(gameId);
    
    if (!foundGame) {
      notFound();
      return;
    }

    setGame(foundGame);
    
    // Get related games from same category
    const related = getGamesByCategory(foundGame.category)
      .filter(g => g.id !== foundGame.id)
      .slice(0, 4);
    setRelatedGames(related);

    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [gameId]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: game?.title,
        text: game?.description,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
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
                onClick={handleShare}
                className="p-2 bg-gray-800 rounded-lg text-gray-400 hover:text-purple-400 hover:bg-gray-700 transition-colors"
                title="Share"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <a
                href={game.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-lg text-gray-400 hover:text-purple-400 hover:bg-gray-700 transition-colors"
                title="Open in new tab"
              >
                <Maximize2 className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Game Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Game Title & Info */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
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
          </div>
          <p className="text-gray-400">{game.description}</p>
        </div>

        {/* Game Frame */}
        <div className="relative bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-800">
          {!isGameLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <LoadingSpinner size="lg" text="Loading game..." />
            </div>
          )}
          <iframe
            src={game.url}
            className="w-full"
            style={{ height: '70vh', minHeight: '600px' }}
            allowFullScreen
            onLoad={() => setIsGameLoaded(true)}
            title={game.title}
            allow="autoplay; fullscreen; microphone; gamepad"
          />
        </div>

        {/* Game Controls Info */}
        <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Gamepad2 className="w-5 h-5 text-purple-400" />
            <span>Use mouse or arrow keys to play. Click the game to focus.</span>
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
