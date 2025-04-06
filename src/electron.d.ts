
interface Electron {
  downloadVideo: (url: string, filename: string) => void;
  onDownloadPathSelected: (callback: (data: { url: string, savePath: string }) => void) => void;
}

interface Window {
  electron: Electron;
}
