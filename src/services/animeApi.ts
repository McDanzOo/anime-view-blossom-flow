
import { useState, useEffect } from 'react';
import { Anime, ApiSource, Episode, VideoQuality, UserSettings } from '../types/anime';
import { toast } from '@/components/ui/use-toast';

// Default API sources - these would be actual API endpoints in a real app
export const apiSources: ApiSource[] = [
  {
    id: 'anilibria',
    name: 'AniLibria',
    url: 'https://api.anilibria.tv',
    description: 'Русская озвучка аниме'
  },
  {
    id: 'animego',
    name: 'AnimeGO',
    url: 'https://animego.org/api',
    description: 'Аниме с русской озвучкой и субтитрами'
  },
  {
    id: 'shikimori',
    name: 'Shikimori',
    url: 'https://shikimori.one/api',
    description: 'Каталог аниме с рейтингами и отзывами'
  }
];

// Mock data for demonstration
const mockAnimeData: Anime[] = [
  {
    id: '1',
    title: 'Demon Slayer: Kimetsu no Yaiba',
    titleRu: 'Клинок, рассекающий демонов',
    description: 'Действие аниме происходит в Японии в эпоху Тайсё. Главный герой Танджиро Камадо — старший сын в семье, потерявший своего отца и взявший на себя заботу о своих близких.',
    imageUrl: 'https://cdn.myanimelist.net/images/anime/1286/99889l.jpg',
    episodes: [
      {
        id: 'ep1',
        number: 1,
        title: 'Cruetly',
        sources: [
          { quality: '360p', url: 'https://example.com/ep1-360p' },
          { quality: '720p', url: 'https://example.com/ep1-720p' },
          { quality: '1080p', url: 'https://example.com/ep1-1080p' },
        ]
      },
      // More episodes...
    ],
    year: 2019,
    status: 'Завершен',
    type: 'TV',
    genres: ['Действие', 'Фэнтези', 'История'],
    rating: 8.9
  },
  {
    id: '2',
    title: 'Attack on Titan',
    titleRu: 'Атака титанов',
    description: 'Уже многие годы человечество ведёт борьбу с титанами — огромными существами, которые не обладают особым интеллектом, зато едят людей.',
    imageUrl: 'https://cdn.myanimelist.net/images/anime/10/47347l.jpg',
    episodes: [
      {
        id: 'ep1',
        number: 1,
        title: 'To You, 2000 Years From Now',
        sources: [
          { quality: '360p', url: 'https://example.com/aot-ep1-360p' },
          { quality: '720p', url: 'https://example.com/aot-ep1-720p' },
          { quality: '1080p', url: 'https://example.com/aot-ep1-1080p' },
        ]
      },
      // More episodes...
    ],
    year: 2013,
    status: 'Завершен',
    type: 'TV',
    genres: ['Действие', 'Фэнтези', 'Драма'],
    rating: 9.1
  },
  {
    id: '3',
    title: 'My Hero Academia',
    titleRu: 'Моя геройская академия',
    description: 'В мире, где большинство людей обладают суперсилой, родился мальчик Идзуку Мидория, у которого её нет. Несмотря на это, он мечтает стать героем.',
    imageUrl: 'https://cdn.myanimelist.net/images/anime/10/78745l.jpg',
    episodes: [
      {
        id: 'ep1',
        number: 1,
        title: 'Izuku Midoriya: Origin',
        sources: [
          { quality: '360p', url: 'https://example.com/mha-ep1-360p' },
          { quality: '720p', url: 'https://example.com/mha-ep1-720p' },
          { quality: '1080p', url: 'https://example.com/mha-ep1-1080p' },
        ]
      },
      // More episodes...
    ],
    year: 2016,
    status: 'Выходит',
    type: 'TV',
    genres: ['Действие', 'Комедия', 'Школа'],
    rating: 8.5
  },
  {
    id: '4',
    title: 'Jujutsu Kaisen',
    titleRu: 'Магическая битва',
    description: 'Школьник Юдзи Итадори, обладающий огромной физической силой, живет обычной жизнью старшеклассника. Однажды, чтобы спасти друзей от нападения проклятий, он съедает палец Сукуны, в результате становясь его сосудом.',
    imageUrl: 'https://cdn.myanimelist.net/images/anime/1171/109222l.jpg',
    episodes: [
      {
        id: 'ep1',
        number: 1,
        title: 'Ryomen Sukuna',
        sources: [
          { quality: '360p', url: 'https://example.com/jjk-ep1-360p' },
          { quality: '720p', url: 'https://example.com/jjk-ep1-720p' },
          { quality: '1080p', url: 'https://example.com/jjk-ep1-1080p' },
        ]
      },
      // More episodes...
    ],
    year: 2020,
    status: 'Выходит',
    type: 'TV',
    genres: ['Действие', 'Фэнтези', 'Сверхъестественное'],
    rating: 8.8
  },
  {
    id: '5',
    title: 'Spy x Family',
    titleRu: 'Семья шпиона',
    description: 'Талантливому шпиону необходимо создать фиктивную семью, чтобы выполнить важное задание. Не подозревая друг о друге, он удочеряет девочку-телепата и женится на профессиональной убийце.',
    imageUrl: 'https://cdn.myanimelist.net/images/anime/1441/122795l.jpg',
    episodes: [
      {
        id: 'ep1',
        number: 1,
        title: 'Operation Strix',
        sources: [
          { quality: '360p', url: 'https://example.com/sxf-ep1-360p' },
          { quality: '720p', url: 'https://example.com/sxf-ep1-720p' },
          { quality: '1080p', url: 'https://example.com/sxf-ep1-1080p' },
        ]
      },
      // More episodes...
    ],
    year: 2022,
    status: 'Выходит',
    type: 'TV',
    genres: ['Действие', 'Комедия', 'Шпионский'],
    rating: 8.7
  },
  {
    id: '6',
    title: 'Chainsaw Man',
    titleRu: 'Человек-бензопила',
    description: 'Дэндзи был обычным парнем, убивающим демонов вместе со своим демоном-питомцем Почитой, чтобы расплатиться с долгами. Но после предательства и смерти Почита спасает его, сливаясь с его телом.',
    imageUrl: 'https://cdn.myanimelist.net/images/anime/1806/126216l.jpg',
    episodes: [
      {
        id: 'ep1',
        number: 1,
        title: 'Dog & Chainsaw',
        sources: [
          { quality: '360p', url: 'https://example.com/csm-ep1-360p' },
          { quality: '720p', url: 'https://example.com/csm-ep1-720p' },
          { quality: '1080p', url: 'https://example.com/csm-ep1-1080p' },
        ]
      },
      // More episodes...
    ],
    year: 2022,
    status: 'Завершен',
    type: 'TV',
    genres: ['Действие', 'Фэнтези', 'Ужасы'],
    rating: 8.6
  }
];

// Default settings
export const defaultSettings: UserSettings = {
  selectedApi: apiSources[0],
  preferredQuality: '720p',
  autoplay: true,
  darkMode: true
};

// Load settings from localStorage
export const loadSettings = (): UserSettings => {
  const savedSettings = localStorage.getItem('animeSettings');
  if (savedSettings) {
    try {
      return JSON.parse(savedSettings);
    } catch (error) {
      console.error('Failed to parse settings:', error);
    }
  }
  return defaultSettings;
};

// Save settings to localStorage
export const saveSettings = (settings: UserSettings): void => {
  localStorage.setItem('animeSettings', JSON.stringify(settings));
};

// Load favorites from localStorage
export const loadFavorites = (): string[] => {
  const savedFavorites = localStorage.getItem('animeFavorites');
  if (savedFavorites) {
    try {
      return JSON.parse(savedFavorites);
    } catch (error) {
      console.error('Failed to parse favorites:', error);
      return [];
    }
  }
  return [];
};

// Save favorites to localStorage
export const saveFavorites = (favorites: string[]): void => {
  localStorage.setItem('animeFavorites', JSON.stringify(favorites));
};

// Custom hook for settings
export const useSettings = () => {
  const [settings, setSettings] = useState<UserSettings>(loadSettings());

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  return {
    settings,
    updateSettings: (newSettings: Partial<UserSettings>) => {
      setSettings(prev => ({ ...prev, ...newSettings }));
      toast({
        title: "Настройки обновлены",
        description: "Ваши предпочтения были сохранены"
      });
    }
  };
};

// Custom hook for favorites
export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>(loadFavorites());

  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);

  const toggleFavorite = (animeId: string) => {
    setFavorites(prev => {
      if (prev.includes(animeId)) {
        toast({
          title: "Удалено из избранного",
          description: "Аниме удалено из списка избранного"
        });
        return prev.filter(id => id !== animeId);
      } else {
        toast({
          title: "Добавлено в избранное",
          description: "Аниме добавлено в список избранного"
        });
        return [...prev, animeId];
      }
    });
  };

  return { favorites, toggleFavorite };
};

// Function to fetch all anime
export const fetchAnime = async (apiSource: ApiSource): Promise<Anime[]> => {
  // In a real app, this would make an actual API call
  // For now, we'll just return our mock data after a short delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockAnimeData;
};

// Function to fetch a single anime by ID
export const fetchAnimeById = async (id: string, apiSource: ApiSource): Promise<Anime | null> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const anime = mockAnimeData.find(anime => anime.id === id);
  return anime || null;
};

// Function to search anime
export const searchAnime = async (query: string, apiSource: ApiSource): Promise<Anime[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  if (!query) return mockAnimeData;
  
  const lowerQuery = query.toLowerCase();
  return mockAnimeData.filter(anime => 
    anime.title.toLowerCase().includes(lowerQuery) || 
    (anime.titleRu && anime.titleRu.toLowerCase().includes(lowerQuery))
  );
};

// Function to get favorite anime
export const getFavoriteAnime = async (favoriteIds: string[], apiSource: ApiSource): Promise<Anime[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockAnimeData.filter(anime => favoriteIds.includes(anime.id));
};
