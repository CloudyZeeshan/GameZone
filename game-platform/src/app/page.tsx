'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import GameCard from '@/components/GameCard';
import CategoryFilter from '@/components/CategoryFilter';
import { games } from '@/data/games';
import { GameCategory } from '@/types/game';
import { Zap, TrendingUp, Gamepad2, Clock, Star } from 'lucide-react';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<GameCategory | 'All'>('All');
  const [recentGames, setRecentGames] = useState<string[]>([]);
  const [selectedHeroGame, setSelectedHeroGame] = useState(games.find((game) => game.featured) || games[0]);

  // Load recently played games from localStorage
  useEffect(() => {
    const played = localStorage.getItem('recentlyPlayed');
    if (played) {
      try {
        setRecentGames(JSON.parse(played));
      } catch (e) {
        console.error('Failed to parse recent games:', e);
      }
    }
  }, []);

  // Filter games by selected category
  const filteredGames = useMemo(() => {
    if (selectedCategory === 'All') return games;
    return games.filter(game => game.category === selectedCategory);
  }, [selectedCategory]);

  // Get featured games
  const featuredGames = games.filter(game => game.featured);

  // Get popular games
  const popularGames = games.filter(game => game.popular);

  // Get continue playing games (recently played)
  const continuePlayingGames = recentGames
    .map(id => games.find(g => g.id === id))
    .filter(Boolean)
    .slice(0, 4);

  // JSON-LD structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'GameZone',
    description: 'Play free HTML5 games online',
    url: 'https://gamezone.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://gamezone.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    },
    hasPart: games.map(game => ({
      '@type': 'VideoGame',
      name: game.title,
      description: game.description,
      gamePlatform: 'Web Browser',
      genre: game.category
    }))
  };

  return (
    <div className="min-h-screen">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.18),_transparent_35%),radial-gradient(circle_at_right,_rgba(245,87,108,0.16),_transparent_25%),linear-gradient(180deg,_rgba(15,23,42,0.96),_rgba(15,23,42,0.96))]" />
        <div className="absolute inset-x-0 top-12 flex justify-center pointer-events-none">
          <div className="w-72 h-72 rounded-full bg-white/5 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto grid gap-12 lg:grid-cols-[1.05fr_0.95fr] items-center">
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/15 rounded-full border border-purple-500/20 text-purple-200 text-sm font-semibold shadow-lg shadow-purple-500/10">
              <Gamepad2 className="w-5 h-5 text-purple-300" />
              Game world launcher
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
              A premium gaming portal with <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-fuchsia-400 bg-clip-text text-transparent">spinning game portals</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto lg:mx-0">
              Discover the best local HTML5 games in a beautiful animated world. Tap any portal to instantly load the game and play in the same universe.
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center lg:justify-start gap-3">
              <Link
                href="#featured"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:-translate-y-0.5 hover:shadow-purple-500/50"
              >
                Explore featured games
              </Link>
              <Link
                href="#categories"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-gray-200 transition-all hover:bg-white/10"
              >
                Browse categories
              </Link>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {featuredGames.slice(0, 4).map((game) => (
                <Link
                  key={game.id}
                  href={`/game/${game.id}`}
                  className="group rounded-3xl border border-white/10 bg-white/5 p-4 text-left transition-all hover:-translate-y-1 hover:bg-white/10 hover:shadow-[0_20px_60px_-30px_rgba(124,58,237,0.8)]"
                >
                  <div className="text-3xl mb-3">{game.tags[0] === 'runner' ? '🏃' : '🎮'}</div>
                  <h3 className="text-sm font-semibold text-white group-hover:text-purple-300">{game.title}</h3>
                  <p className="text-xs text-gray-400 mt-2 line-clamp-2">{game.description}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="hero-world relative mx-auto w-[320px] h-[320px] rounded-full border border-white/10 bg-gradient-to-br from-purple-700/20 via-slate-950/60 to-pink-700/20 shadow-[0_40px_130px_-50px_rgba(124,58,237,0.6)] overflow-hidden">
              <div className="planet-core absolute inset-0 m-auto w-40 h-40 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 shadow-[0_0_60px_rgba(245,87,108,0.28)]"></div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative w-36 h-36 rounded-full border border-white/10 bg-black/30 shadow-[0_0_50px_rgba(124,58,237,0.35)] backdrop-blur-sm overflow-hidden">
                  <Image
                    src={selectedHeroGame.thumbnail}
                    alt={selectedHeroGame.title}
                    fill
                    className="object-cover opacity-90"
                    sizes="144px"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent" />
                </div>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-end p-4 text-center pointer-events-none">
                <span className="text-xs uppercase tracking-[0.35em] text-purple-300/70">Selected portal</span>
                <h3 className="mt-2 text-white text-lg font-semibold">{selectedHeroGame.title}</h3>
              </div>
              {featuredGames.slice(0, 5).map((game, index) => {
                const orbitPositions = [
                  { top: '8%', left: '50%' },
                  { top: '35%', left: '85%' },
                  { top: '75%', left: '72%' },
                  { top: '80%', left: '22%' },
                  { top: '30%', left: '10%' },
                ];
                const position = orbitPositions[index] || { top: '50%', left: '50%' };
                const isActive = selectedHeroGame?.id === game.id;
                return (
                  <button
                    key={game.id}
                    onClick={() => setSelectedHeroGame(game)}
                    className={`orbiter absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-white/10 backdrop-blur-xl shadow-[0_20px_70px_-30px_rgba(245,87,108,0.35)] transition-all ${isActive ? 'scale-110 border-purple-400 ring-2 ring-purple-500/20' : 'hover:scale-110 hover:border-purple-400'}`}
                    style={{ width: '84px', height: '84px', top: position.top, left: position.left }}
                    type="button"
                  >
                    <div className="relative w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-purple-500/40 to-pink-500/20">
                      <Image
                        src={game.thumbnail}
                        alt={game.title}
                        fill
                        className="object-cover opacity-90"
                        sizes="84px"
                        unoptimized
                      />
                      <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 transition-opacity hover:opacity-25" />
                    </div>
                    <span className="sr-only">Select {game.title}</span>
                  </button>
                );
              })}
              <div className="orbit-ring absolute inset-4 rounded-full border border-white/10"></div>
            </div>
            <div className="mt-6 text-center text-sm text-gray-400">
              <p>Tap a portal to choose the game. Then press the button below to launch it instantly.</p>
              <Link
                href={`/game/${selectedHeroGame.id}`}
                className="mt-4 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-purple-600/20 transition-all hover:-translate-y-0.5 hover:shadow-purple-500/40"
              >
                Play {selectedHeroGame.title}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_30px_80px_-60px_rgba(124,58,237,0.8)] backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.35em] text-purple-300 mb-3">Play Faster</p>
            <h3 className="text-xl font-semibold text-white mb-2">Instant loading</h3>
            <p className="text-gray-400 text-sm">Jump into games without waiting. Every portal is optimized for quick play.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_30px_80px_-60px_rgba(245,87,108,0.8)] backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.35em] text-purple-300 mb-3">Pure Arcade</p>
            <h3 className="text-xl font-semibold text-white mb-2">Curated quality</h3>
            <p className="text-gray-400 text-sm">We highlight the best game portals from your library so every session feels premium.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_30px_80px_-60px_rgba(59,130,246,0.8)] backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.35em] text-purple-300 mb-3">Mobile Ready</p>
            <h3 className="text-xl font-semibold text-white mb-2">Touch-friendly controls</h3>
            <p className="text-gray-400 text-sm">The site works smoothly on phones and tablets with fullscreen game mode and responsive menus.</p>
          </div>
        </div>
      </section>

      {/* Continue Playing Section */}
      {continuePlayingGames.length > 0 && (
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Clock className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-3xl font-bold text-white">Continue Playing</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {continuePlayingGames.map((game) => (
                <div key={game!.id} className="stagger-item">
                  <GameCard game={game!} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Popular Games Section */}
      {popularGames.length > 0 && (
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Star className="w-6 h-6 text-yellow-400" />
              </div>
              <h2 className="text-3xl font-bold text-white">Popular Games</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularGames.map((game) => (
                <div key={game.id} className="stagger-item">
                  <GameCard game={game} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Games Section */}
      {featuredGames.length > 0 && (
        <section id="featured" className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Zap className="w-6 h-6 text-yellow-400" />
              </div>
              <h2 className="text-3xl font-bold text-white">Featured Games</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredGames.map((game) => (
                <div key={game.id} className="stagger-item">
                  <GameCard game={game} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Games Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">All Games</h2>

            {/* Category Filter */}
            <div id="categories" className="mt-8">
              <CategoryFilter onCategoryChange={setSelectedCategory} />
            </div>
          </div>

          {/* Games Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGames.map((game) => (
              <div key={game.id} className="stagger-item">
                <GameCard game={game} />
              </div>
            ))}
          </div>

          {/* No Results Message */}
          {filteredGames.length === 0 && (
            <div className="text-center py-16">
              <Gamepad2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No games found for this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl p-8 md:p-12 border border-purple-800">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Play?
            </h2>
            <p className="text-gray-300 mb-6">
              Choose a game and start playing instantly. No downloads, no installations!
            </p>
            <a
              href="#featured"
              className="inline-block px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg"
            >
              Browse Games
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
