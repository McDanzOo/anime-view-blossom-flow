
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Heart, Settings, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import SettingsModal from './SettingsModal';

interface HeaderProps {
  onSearch?: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-anime-dark/95 border-b border-anime-card backdrop-blur-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gradient">АнимеВью</span>
          </Link>
        </div>

        <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center max-w-md w-full relative mx-4">
          <Input
            type="search"
            placeholder="Поиск аниме..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-anime-card/50 border-anime-primary/30 focus-visible:ring-anime-primary/50"
          />
          <Button 
            type="submit" 
            variant="ghost" 
            size="icon"
            className="absolute right-0 text-muted-foreground hover:text-white"
          >
            <Search className="h-4 w-4" />
          </Button>
        </form>

        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className={cn(
              "text-muted-foreground hover:text-white hover:bg-anime-card",
              isActive('/') && "text-anime-primary"
            )}
          >
            <Link to="/">
              <Home className="h-5 w-5" />
              <span className="sr-only">Главная</span>
            </Link>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            asChild
            className={cn(
              "text-muted-foreground hover:text-white hover:bg-anime-card",
              isActive('/favorites') && "text-anime-primary"
            )}
          >
            <Link to="/favorites">
              <Heart className="h-5 w-5" />
              <span className="sr-only">Избранное</span>
            </Link>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSettingsOpen(true)}
            className="text-muted-foreground hover:text-white hover:bg-anime-card"
          >
            <Settings className="h-5 w-5" />
            <span className="sr-only">Настройки</span>
          </Button>
        </div>
      </div>
      
      <form onSubmit={handleSearchSubmit} className="md:hidden px-4 pb-3">
        <div className="relative">
          <Input
            type="search"
            placeholder="Поиск аниме..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-anime-card/50 border-anime-primary/30 focus-visible:ring-anime-primary/50"
          />
          <Button 
            type="submit" 
            variant="ghost" 
            size="icon"
            className="absolute right-0 top-0 text-muted-foreground hover:text-white"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </form>

      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </header>
  );
};

export default Header;
