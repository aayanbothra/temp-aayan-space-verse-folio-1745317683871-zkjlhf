
/// <reference types="vite/client" />

interface Window {
  gtag: (
    command: 'config' | 'event' | 'js',
    targetId: string,
    config?: Record<string, any>
  ) => void;
  dataLayer: any[];
}
