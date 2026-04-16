'use client';

import { useState } from 'react';
import { categories } from '@/data/games';
import { GameCategory } from '@/types/game';

interface CategoryFilterProps {
  onCategoryChange: (category: GameCategory | 'All') => void;
}

export default function CategoryFilter({ onCategoryChange }: CategoryFilterProps) {
  const [activeCategory, setActiveCategory] = useState<GameCategory | 'All'>('All');

  const handleCategoryClick = (category: GameCategory | 'All') => {
    setActiveCategory(category);
    onCategoryChange(category);
  };

  return (
    <div className="relative z-10 flex flex-wrap gap-3 justify-center">
      {categories.map((category) => (
        <button
          key={category.name}
          onClick={() => handleCategoryClick(category.name as GameCategory | 'All')}
          className={`
            px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-purple-500 hover:scale-105
            ${
              activeCategory === category.name
                ? `${category.color} text-white shadow-lg shadow-purple-500/20`
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }
          `}
        >
          <span className="mr-2">{category.icon}</span>
          {category.name}
        </button>
      ))}
    </div>
  );
}
