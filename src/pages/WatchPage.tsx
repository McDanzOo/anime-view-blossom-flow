
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, PlayCircle, ChevronDown, ChevronUp, Heart } from 'lucide-react';
import Header from '@/components/Header';
import VideoPlayer from '@/components/VideoPlayer';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { fetchAnimeById, useFavorites, useSettings } from '@/services/animeApi';
import { Anime, Episode } from '@/types/anime';

const WatchPage = () => {
  const { animeId } = useParams<{ animeId: string }>();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [episodesOpen, setEpisodesOpen] = useState(true);
  const { settings } = useSettings();
  const { favorites, toggleFavorite } = useFavorites();
  const navigate = useNavigate();

  const isFavorite = animeId ? favorites.includes(animeId) : false;

  useEffect(() => {
    const loadAnime = async () => {
      if (!animeId) return;
      
      setLoading(true);
      try {
        const data = await fetchAnimeById(animeId, settings.selectedApi);
        
        if (data) {
          setAnime(data);
          // Select the first episode by default
          if (data.episodes.length > 0 && !selectedEpisode) {
            setSelectedEpisode(data.episodes[0]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch anime:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnime();
  }, [animeId, settings.selectedApi]);

  const handleEpisodeSelect = (episode: Episode) => {
    setSelectedEpisode(episode);
    // Scroll to top on mobile when selecting an episode
    if (window.innerWidth < 768) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextEpisode = () => {
    if (!anime || !selectedEpisode) return;
    
    const currentIndex = anime.episodes.findIndex(ep => ep.id === selectedEpisode.id);
    if (currentIndex !== -1 && currentIndex < anime.episodes.length - 1) {
      setSelectedEpisode(anime.episodes[currentIndex + 1]);
    }
  };

  const toggleEpisodesList = () => {
    setEpisodesOpen(!episodesOpen);
  };

  const handleFavoriteToggle = () => {
    if (animeId) {
      toggleFavorite(animeId);
    }
  };

  return (
    <div className="min-h-screen bg-anime-dark">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <Button
          variant="ghost"
          className="text-white mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад
        </Button>
        
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="aspect-video w-full rounded-lg bg-anime-card/50" />
            <Skeleton className="h-8 w-1/2 bg-anime-card/50" />
            <Skeleton className="h-4 w-3/4 bg-anime-card/50" />
          </div>
        ) : anime ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {selectedEpisode && (
                <VideoPlayer 
                  episode={selectedEpisode} 
                  onNextEpisode={handleNextEpisode}
                />
              )}
              
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h1 className="text-xl md:text-2xl font-bold text-white">
                  {anime.titleRu || anime.title}
                </h1>
                
                <Button
                  variant="outline"
                  className={cn(
                    "border-anime-card bg-transparent hover:bg-anime-card/50",
                    isFavorite && "text-anime-secondary border-anime-secondary hover:text-anime-secondary hover:border-anime-secondary"
                  )}
                  onClick={handleFavoriteToggle}
                >
                  <Heart className={cn("mr-2 h-4 w-4", isFavorite && "fill-anime-secondary")} />
                  {isFavorite ? 'В избранном' : 'Добавить в избранное'}
                </Button>
              </div>
              
              <Accordion type="single" collapsible className="w-full" defaultValue="description">
                <AccordionItem value="description" className="border-anime-card">
                  <AccordionTrigger className="text-white hover:text-anime-primary/90">Описание</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <div className="text-xs text-muted-foreground">Год</div>
                        <div className="text-white">{anime.year}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Тип</div>
                        <div className="text-white">{anime.type}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Статус</div>
                        <div className="text-white">{anime.status}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Рейтинг</div>
                        <div className="text-white">★ {anime.rating.toFixed(1)}</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {anime.genres.map((genre, index) => (
                          <span 
                            key={index} 
                            className="text-xs px-2 py-0.5 bg-anime-card text-white rounded-full"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                      <p>{anime.description}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Серии</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white lg:hidden"
                  onClick={toggleEpisodesList}
                >
                  {episodesOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              <div className={cn("space-y-2", !episodesOpen && "hidden lg:block")}>
                {anime.episodes.map((episode) => (
                  <div
                    key={episode.id}
                    className={cn(
                      "flex items-center rounded-md p-2 cursor-pointer transition-colors",
                      selectedEpisode?.id === episode.id
                        ? "bg-anime-primary/20 text-anime-primary"
                        : "bg-anime-card hover:bg-anime-card/70 text-white"
                    )}
                    onClick={() => handleEpisodeSelect(episode)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span className="font-medium mr-2">Серия {episode.number}</span>
                        {selectedEpisode?.id === episode.id && (
                          <PlayCircle className="h-4 w-4 animate-pulse-light" />
                        )}
                      </div>
                      {episode.title && (
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {episode.title}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <h2 className="text-xl font-semibold text-white mb-2">Аниме не найдено</h2>
            <p className="text-muted-foreground">
              Информация об этом аниме недоступна или была удалена
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default WatchPage;
