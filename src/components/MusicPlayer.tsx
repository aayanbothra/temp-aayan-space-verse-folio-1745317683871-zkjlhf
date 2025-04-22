
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [volume, setVolume] = useState(80);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize audio when component mounts
  useEffect(() => {
    if (audioRef.current) {
      // Set initial volume
      audioRef.current.volume = volume / 100;

      // Add event listeners for audio loading
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current?.duration || 0);
        setIsLoaded(true);
        console.log("Audio loaded, duration:", audioRef.current?.duration);
      });

      // Error handling for audio
      audioRef.current.addEventListener('error', (e) => {
        console.error("Audio loading error:", e);
      });
    }

    // Clean up
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('loadedmetadata', () => {});
        audioRef.current.removeEventListener('error', () => {});
      }
    };
  }, []);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error("Play error:", error);
          });
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  const handleProgressChange = (value: number[]) => {
    const newTime = value[0];
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn(
      "w-full max-w-2xl mx-auto glass-panel p-6 space-y-4",
      "hover:bg-white/15 transition-all duration-300"
    )}>
      <audio 
        ref={audioRef} 
        src="/videoplayback.mp3"
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        preload="metadata"
      />
      
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-lg">Treat You Better (Instrumental Remix)</h3>
          <p className="text-sm opacity-70">The Musical Paradox</p>
        </div>
      </div>

      <div className="space-y-2">
        <Slider
          value={[currentTime]}
          max={duration || 100}
          step={0.1}
          onValueChange={handleProgressChange}
          className="cursor-pointer"
        />
        <div className="flex justify-between text-xs opacity-70">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.currentTime = Math.max(0, currentTime - 10);
              }
            }}
          >
            <SkipBack size={20} />
          </button>
          
          <button 
            className="p-3 bg-purple-500 hover:bg-purple-600 rounded-full transition-colors"
            onClick={handlePlayPause}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          
          <button 
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.currentTime = Math.min(
                  audioRef.current.duration || 0,
                  currentTime + 10
                );
              }
            }}
          >
            <SkipForward size={20} />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <Volume2 size={18} className="opacity-70" />
          <div className="w-24">
            <Slider
              value={[volume]}
              max={100}
              step={1}
              onValueChange={handleVolumeChange}
              className="cursor-pointer"
            />
          </div>
        </div>
      </div>
      
      {!isLoaded && (
        <div className="text-center text-sm text-yellow-400">
          Loading audio...
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;
