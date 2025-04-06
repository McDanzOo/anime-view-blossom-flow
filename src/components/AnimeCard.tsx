
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Anime } from '@/types/anime';
import { cn } from '@/lib/utils';

interface AnimeCardProps {
  anime: Anime;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  className?: string;
}

const AnimeCard: React.FC<AnimeCardProps> = ({ 
  anime, 
  isFavorite, 
  onToggleFavorite,
  className
}) => {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite(anime.id);
  };

  return (
    <div className={cn("anime-card relative overflow-hidden rounded-lg bg-anime-card transition-all", className)}>
      <Link to={`/watch/${anime.id}`} className="block h-full">
        <div className="relative aspect-[2/3] overflow-hidden">
          <img 
            src={anime.imageUrl} 
            alt={anime.title} 
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-90"></div>
          
          <button
            onClick={handleFavoriteClick}
            className="absolute top-2 right-2 z-10 rounded-full p-1.5 bg-black/50 hover:bg-anime-primary/80 transition-colors"
            aria-label={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
          >
            <Heart className={cn(
              "h-5 w-5", 
              isFavorite ? "fill-anime-secondary text-anime-secondary" : "text-white"
            )} />
          </button>
          
          <div className="absolute bottom-0 left-0 w-full p-3 text-left">
            <h3 className="font-bold text-white text-lg line-clamp-2">
              {anime.titleRu || anime.title}
            </h3>
            <div className="flex flex-wrap gap-1 mt-1">
              {anime.genres.slice(0, 2).map((genre, index) => (
                <span key={index} className="text-xs px-2 py-0.5 bg-anime-primary/60 text-white rounded-full">
                  {genre}
                </span>
              ))}
              <span className="text-xs px-2 py-0.5 bg-anime-secondary/60 text-white rounded-full ml-1">
                {anime.type}
              </span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-white/80">{anime.year}</span>
              <span className="text-xs px-2 py-0.5 bg-yellow-500/80 text-white rounded-sm">
                ★ {anime.rating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default AnimeCard;
