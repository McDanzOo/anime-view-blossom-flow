
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiSources, useSettings } from '@/services/animeApi';
import { ApiSource, VideoQuality } from '@/types/anime';

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ open, onOpenChange }) => {
  const { settings, updateSettings } = useSettings();

  const handleApiChange = (apiId: string) => {
    const api = apiSources.find(api => api.id === apiId);
    if (api) {
      updateSettings({ selectedApi: api });
    }
  };

  const handleQualityChange = (quality: string) => {
    updateSettings({ preferredQuality: quality as VideoQuality });
  };

  const handleAutoplayChange = (checked: boolean) => {
    updateSettings({ autoplay: checked });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-anime-dark border-anime-card sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">Настройки</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-white">Выбор API</h3>
            <p className="text-xs text-muted-foreground">
              Выберите источник данных для аниме
            </p>
            <RadioGroup 
              value={settings.selectedApi.id} 
              onValueChange={handleApiChange}
              className="grid grid-cols-1 gap-2 mt-2"
            >
              {apiSources.map(api => (
                <div key={api.id} className="flex items-center space-x-2 rounded-md border border-anime-card p-3 hover:border-anime-primary/50">
                  <RadioGroupItem 
                    value={api.id} 
                    id={api.id}
                    className="text-anime-primary border-anime-card/50"
                  />
                  <div className="grid gap-1">
                    <Label htmlFor={api.id} className="font-medium text-white">
                      {api.name}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {api.description}
                    </p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-white">Качество видео</h3>
            <p className="text-xs text-muted-foreground">
              Выберите предпочтительное качество для просмотра аниме
            </p>
            <Select 
              value={settings.preferredQuality}
              onValueChange={handleQualityChange}
            >
              <SelectTrigger className="w-full mt-2 bg-anime-card border-anime-card/50">
                <SelectValue placeholder="Выберите качество" />
              </SelectTrigger>
              <SelectContent className="bg-anime-card border-anime-card/50">
                <SelectItem value="360p">360p</SelectItem>
                <SelectItem value="480p">480p</SelectItem>
                <SelectItem value="720p">720p</SelectItem>
                <SelectItem value="1080p">1080p</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between space-x-2">
            <div>
              <h3 className="text-sm font-medium text-white">Автовоспроизведение</h3>
              <p className="text-xs text-muted-foreground">
                Автоматически начинать следующую серию
              </p>
            </div>
            <Switch 
              checked={settings.autoplay}
              onCheckedChange={handleAutoplayChange}
              className="data-[state=checked]:bg-anime-primary"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
