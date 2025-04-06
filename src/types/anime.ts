
export interface Anime {
  id: string;
  title: string;
  titleRu?: string;
  description: string;
  imageUrl: string;
  episodes: Episode[];
  year: number;
  status: string;
  type: string;
  genres: string[];
  rating: number;
}

export interface Episode {
  id: string;
  number: number;
  title?: string;
  sources: VideoSource[];
}

export interface VideoSource {
  quality: string;
  url: string;
}

export interface ApiSource {
  id: string;
  name: string;
  url: string;
  description: string;
}

export type VideoQuality = '360p' | '480p' | '720p' | '1080p';

export interface UserSettings {
  selectedApi: ApiSource;
  preferredQuality: VideoQuality;
  autoplay: boolean;
  darkMode: boolean;
}
