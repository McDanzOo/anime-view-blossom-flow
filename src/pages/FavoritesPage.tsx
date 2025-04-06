
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import AnimeCard from '@/components/AnimeCard';
import { Anime } from '@/types/anime';
import { getFavoriteAnime, useFavorites, useSettings } from '@/services/animeApi';
import { Skeleton } from '@/components/ui/skeleton';

const FavoritesPage = () => {
  const [favoriteAnime, setFavoriteAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const { favorites, toggleFavorite } = useFavorites();
  const { settings } = useSettings();

  useEffect(() => {
    const loadFavorites = async () => {
      if (favorites.length === 0) {
        setFavoriteAnime([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await getFavoriteAnime(favorites, settings.selectedApi);
        setFavoriteAnime(data);
      } catch (error) {
        console.error('Failed to fetch favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [favorites, settings.selectedApi]);

  return (
    <div className="min-h-screen bg-anime-dark">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-white">Избранное</h1>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {Array.from({ length: Math.min(favorites.length, 5) }).map((_, i) => (
                <div key={i} className="anime-card space-y-2">
                  <Skeleton className="aspect-[2/3] w-full rounded-lg bg-anime-card/50" />
                  <Skeleton className="h-4 w-3/4 bg-anime-card/50" />
                  <Skeleton className="h-3 w-1/2 bg-anime-card/50" />
                </div>
              ))}
            </div>
          ) : favoriteAnime.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <h2 className="text-xl font-semibold text-white mb-2">Список избранного пуст</h2>
              <p className="text-muted-foreground">
                Добавьте аниме в избранное, нажав на иконку сердечка на карточке аниме
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {favoriteAnime.map((item) => (
                <AnimeCard
                  key={item.id}
                  anime={item}
                  isFavorite={true}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default FavoritesPage;
