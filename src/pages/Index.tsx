
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import AnimeCard from '@/components/AnimeCard';
import { fetchAnime, searchAnime, useFavorites, useSettings } from '@/services/animeApi';
import { Anime } from '@/types/anime';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const [anime, setAnime] = useState<Anime[]>([]);
  const [filteredAnime, setFilteredAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { settings } = useSettings();
  const { favorites, toggleFavorite } = useFavorites();
  const navigate = useNavigate();

  useEffect(() => {
    const loadAnime = async () => {
      setLoading(true);
      try {
        const data = await fetchAnime(settings.selectedApi);
        setAnime(data);
        setFilteredAnime(data);
      } catch (error) {
        console.error('Failed to fetch anime:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnime();
  }, [settings.selectedApi]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setLoading(true);
    
    try {
      const results = await searchAnime(query, settings.selectedApi);
      setFilteredAnime(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-anime-dark">
      <Header onSearch={handleSearch} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">
              {searchQuery ? `Результаты поиска: ${searchQuery}` : 'Популярное аниме'}
            </h1>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="anime-card space-y-2">
                  <Skeleton className="aspect-[2/3] w-full rounded-lg bg-anime-card/50" />
                  <Skeleton className="h-4 w-3/4 bg-anime-card/50" />
                  <Skeleton className="h-3 w-1/2 bg-anime-card/50" />
                </div>
              ))}
            </div>
          ) : filteredAnime.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <h2 className="text-xl font-semibold text-white mb-2">Ничего не найдено</h2>
              <p className="text-muted-foreground">
                По вашему запросу ничего не найдено. Попробуйте изменить параметры поиска.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {filteredAnime.map((item) => (
                <AnimeCard
                  key={item.id}
                  anime={item}
                  isFavorite={favorites.includes(item.id)}
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

export default Index;
