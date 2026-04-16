import Link from 'next/link';
import Image from 'next/image';
import { Game } from '@/types/game';
import { Star, ExternalLink, Play } from 'lucide-react';

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  // Track recently played games
  const handleGameClick = () => {
    try {
      const played = localStorage.getItem('recentlyPlayed');
      let recentGames: string[] = played ? JSON.parse(played) : [];
      
      // Remove if already exists
      recentGames = recentGames.filter(id => id !== game.id);
      
      // Add to beginning
      recentGames.unshift(game.id);
      
      // Keep only last 8
      recentGames = recentGames.slice(0, 8);
      
      localStorage.setItem('recentlyPlayed', JSON.stringify(recentGames));
    } catch (e) {
      console.error('Failed to save recent game:', e);
    }
  };

  return (
    <Link
      href={`/game/${game.id}`}
      onClick={handleGameClick}
      className="group block bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 hover-lift card-float"
      style={{
        perspective: '1000px',
      }}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-purple-600 to-pink-600">
        <Image
          src={game.thumbnail}
          alt={game.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized
        />
        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
          <div className="transform scale-0 group-hover:scale-100 transition-transform duration-300">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500 rounded-full animate-ping opacity-75"></div>
              <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-6 shadow-2xl">
                <Play className="w-12 h-12 text-white fill-white" />
              </div>
            </div>
          </div>
        </div>
        {/* Featured Badge */}
        {game.featured && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
            <Star className="w-3 h-3" />
            Featured
          </div>
        )}
        {/* Popular Badge */}
        {game.popular && !game.featured && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
            <Star className="w-3 h-3" />
            Popular
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 bg-gradient-to-b from-gray-800 to-gray-900 group-hover:from-gray-700 group-hover:to-gray-800 transition-colors"
        style={{
          borderTop: '1px solid rgba(124, 58, 237, 0.2)',
        }}
      >
        <h3 className="text-white font-bold text-lg mb-2 group-hover:text-purple-400 transition-colors">
          {game.title}
        </h3>
        <p className="text-gray-400 text-sm line-clamp-2 mb-3">
          {game.description}
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full font-medium">
            {game.category}
          </span>
          {game.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
