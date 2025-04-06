import React, { useState, useRef, useEffect } from 'react';
import { useSettings } from '@/services/animeApi';
import { Play, Pause, VolumeX, Volume2, Maximize, SkipForward, Settings, Download } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Episode, VideoQuality } from '@/types/anime';
import { toast } from '@/hooks/use-toast';

interface VideoPlayerProps {
  episode: Episode;
  onNextEpisode?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ episode, onNextEpisode }) => {
  const { settings } = useSettings();
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [selectedQuality, setSelectedQuality] = useState<VideoQuality>(settings.preferredQuality);
  const [hideControlsTimeout, setHideControlsTimeout] = useState<NodeJS.Timeout | null>(null);
  const [downloading, setDownloading] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const selectedSource = episode.sources.find(source => source.quality === selectedQuality) 
    || episode.sources[episode.sources.length - 1]; // Fallback to best quality

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onTimeUpdate = () => setCurrentTime(video.currentTime);
    const onDurationChange = () => setDuration(video.duration);
    const onVolumeChange = () => {
      setVolume(video.volume);
      setMuted(video.muted);
    };
    const onFullscreenChange = () => {
      setFullscreen(document.fullscreenElement !== null);
    };
    const onEnded = () => {
      if (settings.autoplay && onNextEpisode) {
        onNextEpisode();
      } else {
        setPlaying(false);
      }
    };

    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('durationchange', onDurationChange);
    video.addEventListener('volumechange', onVolumeChange);
    video.addEventListener('ended', onEnded);
    document.addEventListener('fullscreenchange', onFullscreenChange);

    return () => {
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('durationchange', onDurationChange);
      video.removeEventListener('volumechange', onVolumeChange);
      video.removeEventListener('ended', onEnded);
      document.removeEventListener('fullscreenchange', onFullscreenChange);
    };
  }, [onNextEpisode, settings.autoplay]);

  useEffect(() => {
    // Set the source when the quality changes
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      const wasPlaying = !videoRef.current.paused;
      
      videoRef.current.src = selectedSource.url;
      videoRef.current.currentTime = currentTime;
      
      if (wasPlaying) {
        videoRef.current.play().catch(e => console.error("Failed to play:", e));
      }
    }
  }, [selectedQuality, selectedSource.url]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(e => console.error("Failed to play:", e));
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted;
    }
  };

  const handleVolumeChange = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.volume = value[0];
      videoRef.current.muted = value[0] === 0;
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0];
    }
  };

  const resetControlsTimeout = () => {
    if (hideControlsTimeout) {
      clearTimeout(hideControlsTimeout);
    }
    setControlsVisible(true);
    
    const timeout = setTimeout(() => {
      if (playing) {
        setControlsVisible(false);
      }
    }, 3000);
    
    setHideControlsTimeout(timeout);
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const response = await fetch(selectedSource.url);
      const blob = await response.blob();
      
      // Create a temporary link to download the file
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Create filename from anime episode details
      const fileName = `episode_${episode.number}${episode.title ? `_${episode.title}` : ''}_${selectedQuality}.mp4`;
      link.setAttribute('download', fileName);
      
      // Trigger download and clean up
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Загрузка началась",
        description: `Эпизод ${episode.number} будет сохранен на ваше устройство`,
      });
    } catch (error) {
      console.error('Download failed:', error);
      toast({
        variant: "destructive",
        title: "Ошибка загрузки",
        description: "Не удалось скачать видео. Пожалуйста, попробуйте еще раз.",
      });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative aspect-video bg-black w-full overflow-hidden rounded-lg"
      onMouseMove={resetControlsTimeout}
      onMouseLeave={() => playing && setControlsVisible(false)}
      onClick={() => togglePlay()}
    >
      <video
        ref={videoRef}
        src={selectedSource.url}
        className="w-full h-full"
        onClick={(e) => {
          e.stopPropagation();
          togglePlay();
        }}
      />
      
      {/* Controls overlay */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 transition-opacity duration-300",
          controlsVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 p-4">
          <div className="text-white text-sm font-medium">
            Серия {episode.number}{episode.title ? `: ${episode.title}` : ''}
          </div>
        </div>
        
        {/* Center play button */}
        {!playing && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="w-16 h-16 rounded-full bg-anime-primary/30 hover:bg-anime-primary/50 text-white"
              onClick={togglePlay}
            >
              <Play className="h-8 w-8" />
            </Button>
          </div>
        )}
        
        {/* Bottom controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
          {/* Progress bar */}
          <Slider
            value={[currentTime]}
            min={0}
            max={duration || 100}
            step={0.1}
            onValueChange={handleSeek}
            className="cursor-pointer"
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={togglePlay}
              >
                {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
              
              {onNextEpisode && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={onNextEpisode}
                >
                  <SkipForward className="h-5 w-5" />
                </Button>
              )}
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={toggleMute}
                >
                  {muted || volume === 0 ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </Button>
                
                <div className="w-20 hidden sm:block">
                  <Slider
                    value={[muted ? 0 : volume]}
                    min={0}
                    max={1}
                    step={0.01}
                    onValueChange={handleVolumeChange}
                  />
                </div>
              </div>
              
              <span className="text-xs text-white hidden sm:inline-block">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={handleDownload}
                disabled={downloading}
              >
                <Download className="h-5 w-5" />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40 bg-anime-dark border-anime-card">
                  <DropdownMenuRadioGroup 
                    value={selectedQuality} 
                    onValueChange={(value) => setSelectedQuality(value as VideoQuality)}
                  >
                    {episode.sources.map(source => (
                      <DropdownMenuRadioItem 
                        key={source.quality} 
                        value={source.quality}
                        className="cursor-pointer text-white"
                      >
                        {source.quality}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={toggleFullscreen}
              >
                <Maximize className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
