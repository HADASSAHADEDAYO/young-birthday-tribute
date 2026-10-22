import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Volume2, VolumeX, Play, Pause, Music, Sliders, Disc, Upload, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import { MusicSettings } from '../types';
import { ambientAudio } from '../utils/audioSynthesizer';

interface MusicPlayerProps {
  settings: MusicSettings;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onOpenAdmin: () => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  settings,
  isPlaying,
  onTogglePlay,
  onOpenAdmin,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(settings.volume || 0.7);
  const [expanded, setExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const hasAudioFile = Boolean(settings.audioUrl && settings.audioUrl.trim().length > 0);

  // Volume & Mute synchronizer
  useEffect(() => {
    const effectiveVolume = isMuted ? 0 : volume;
    if (audioRef.current) {
      audioRef.current.volume = effectiveVolume;
    }
    ambientAudio.setVolume(effectiveVolume);
  }, [volume, isMuted]);

  // Synchronize playback if toggled externally (e.g., from Navbar or Video tribute events)
  useEffect(() => {
    if (!settings.enabled) {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
      }
      ambientAudio.pause();
      return;
    }

    if (isPlaying) {
      if (hasAudioFile && audioRef.current && !usingFallback) {
        if (audioRef.current.paused) {
          audioRef.current.play().catch((err) => {
            console.warn('External play sync blocked or error:', err);
            if (err.name !== 'NotAllowedError') {
              setUsingFallback(true);
              ambientAudio.play();
            }
          });
        }
      } else {
        ambientAudio.play();
      }
    } else {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
      }
      ambientAudio.pause();
    }
  }, [isPlaying, hasAudioFile, settings.enabled, usingFallback]);

  // Pause background music if a video starts playing anywhere on page
  useEffect(() => {
    const handleVideoPlay = () => {
      if (isPlaying) {
        onTogglePlay();
      }
    };

    window.addEventListener('tribute-video-playing', handleVideoPlay);
    return () => window.removeEventListener('tribute-video-playing', handleVideoPlay);
  }, [isPlaying, onTogglePlay]);

  if (!settings.enabled) {
    return null;
  }

  // Direct user-gesture handler for iOS Safari and mobile devices
  const handleUserTogglePlay = () => {
    setHasError(false);
    setErrorMessage(null);

    if (isPlaying) {
      // Pause
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
      }
      ambientAudio.pause();
      setIsLoading(false);
      onTogglePlay();
    } else {
      // Play - trigger synchronously within the touch/click event loop for iOS
      setIsLoading(true);

      if (hasAudioFile && audioRef.current && !usingFallback) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsLoading(false);
              setHasError(false);
              setErrorMessage(null);
            })
            .catch((err) => {
              console.warn('Audio play request failed:', err);
              setIsLoading(false);
              if (err.name === 'NotAllowedError') {
                // Browsers require user gesture; will play on next tap
              } else {
                // Graceful fallback to ambient audio generator
                setHasError(true);
                setErrorMessage('Cloud stream unavailable. Switched to acoustic tribute mode.');
                setUsingFallback(true);
                ambientAudio.play();
              }
            });
        }
      } else {
        ambientAudio.play();
        setIsLoading(false);
      }

      onTogglePlay();
    }
  };

  const handleAudioError = () => {
    console.warn('Audio element encountered a media error. Gracefully falling back to acoustic ambient generator.');
    setIsLoading(false);
    setHasError(true);
    setErrorMessage('Network error loading track. Playing acoustic ambient loop.');
    setUsingFallback(true);
    if (isPlaying) {
      ambientAudio.play();
    }
  };

  const handleRetryAudio = () => {
    setHasError(false);
    setErrorMessage(null);
    setUsingFallback(false);
    ambientAudio.pause();

    if (audioRef.current) {
      setIsLoading(true);
      audioRef.current.load();
      audioRef.current
        .play()
        .then(() => {
          setIsLoading(false);
          if (!isPlaying) onTogglePlay();
        })
        .catch((err) => {
          console.warn('Retry failed:', err);
          setIsLoading(false);
          setHasError(true);
          setUsingFallback(true);
          if (isPlaying) ambientAudio.play();
        });
    }
  };

  const handleMuteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (newVol > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const displayTitle = usingFallback
    ? 'Warm Celebration Melody'
    : (settings.title || 'Champ (feat. D Smoke)');

  const displayArtist = usingFallback
    ? 'Acoustic Guitar Tribute'
    : (settings.artist || 'Fireboy DML');

  return (
    <div className="fixed bottom-5 right-3 sm:right-6 z-40 select-none max-w-[calc(100vw-1.5rem)]">
      {hasAudioFile && (
        <audio
          ref={audioRef}
          src={settings.audioUrl}
          loop
          preload="metadata"
          playsInline
          crossOrigin="anonymous"
          onWaiting={() => setIsLoading(true)}
          onPlaying={() => {
            setIsLoading(false);
            setHasError(false);
          }}
          onError={handleAudioError}
          onEnded={() => {
            if (audioRef.current) {
              audioRef.current.currentTime = 0;
              audioRef.current.play().catch(console.warn);
            }
          }}
        />
      )}

      {/* Expanded Control Drawer */}
      {expanded && (
        <div className="mb-3 p-4 bg-[#3B2923] text-[#F6EBDD] rounded-2xl shadow-2xl border border-[#D5AA61]/40 w-80 animate-in slide-in-from-bottom-2 duration-200 backdrop-blur-xl">
          <div className="flex items-center justify-between pb-3 border-b border-[#F6EBDD]/15 mb-3">
            <div className="flex items-center gap-2">
              <Disc className={`w-4 h-4 text-[#D5AA61] ${isPlaying && !isLoading ? 'animate-spin' : ''}`} />
              <span className="text-xs uppercase tracking-wider font-semibold text-[#D5AA61]">
                Soundtrack Tribute
              </span>
            </div>
            <button
              onClick={() => setExpanded(false)}
              className="text-[#F6EBDD]/60 hover:text-white text-xs cursor-pointer p-1"
              aria-label="Close soundtrack settings"
            >
              ✕
            </button>
          </div>

          <div className="mb-3 flex items-start justify-between gap-3">
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate text-[#F6EBDD]">
                {displayTitle}
              </p>
              <p className="text-xs text-[#D5AA61] truncate mt-0.5">
                {displayArtist}
              </p>
            </div>

            {hasError && (
              <button
                onClick={handleRetryAudio}
                className="shrink-0 p-1.5 bg-[#B85F43] hover:bg-[#9E4D34] text-white rounded-lg text-[10px] flex items-center gap-1 cursor-pointer"
                title="Retry loading MP3"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Retry</span>
              </button>
            )}
          </div>

          {/* Graceful Error / Notice Banner */}
          {errorMessage && (
            <div className="mb-3 p-2 bg-amber-900/40 border border-amber-600/40 rounded-xl text-[11px] text-amber-200 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span className="leading-tight">{errorMessage}</span>
            </div>
          )}

          {/* Volume Slider */}
          <div className="flex items-center gap-2 mb-3 bg-black/20 p-2 rounded-xl border border-white/5">
            <button
              onClick={handleMuteToggle}
              className="text-[#F6EBDD]/80 hover:text-white p-1 cursor-pointer"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-[#D8A092]" /> : <Volume2 className="w-4 h-4 text-[#D5AA61]" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-full h-1.5 bg-[#523A32] rounded-lg appearance-none cursor-pointer accent-[#D5AA61]"
              aria-label="Volume slider"
            />
            <span className="text-[10px] text-stone-400 font-mono w-7 text-right">
              {Math.round((isMuted ? 0 : volume) * 100)}%
            </span>
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-[#F6EBDD]/15">
            <button
              onClick={onOpenAdmin}
              className="text-[11px] text-[#D5AA61] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Upload className="w-3 h-3" />
              <span>Change Music Track</span>
            </button>
            <span className="text-[10px] text-[#F6EBDD]/60 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#D5AA61]" />
              {isPlaying ? 'Playing' : 'Paused'}
            </span>
          </div>
        </div>
      )}

      {/* Main Attractive Floating Play / Pause Music Pill */}
      <div className={`flex items-center gap-1.5 p-1.5 bg-[#3B2923]/95 hover:bg-[#3B2923] backdrop-blur-md rounded-full shadow-[0_10px_30px_rgba(59,41,35,0.45)] border ${
        isPlaying ? 'border-[#D5AA61]' : 'border-[#D5AA61]/40'
      } text-[#F6EBDD] transition-all group`}>
        
        {/* Play / Pause Primary Action Button */}
        <button
          onClick={handleUserTogglePlay}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer min-h-[46px] ${
            isPlaying
              ? 'bg-[#B85F43] hover:bg-[#9E4D34] text-white shadow-md'
              : 'bg-white/10 hover:bg-white/20 text-[#F6EBDD]'
          }`}
          aria-label={isPlaying ? 'Pause celebration soundtrack' : 'Play celebration soundtrack'}
        >
          {isLoading ? (
            <RefreshCw className="w-4 h-4 animate-spin text-[#D5AA61]" />
          ) : isPlaying ? (
            <div className="w-4 h-4 flex items-center justify-center">
              <Pause className="w-3.5 h-3.5 fill-current" />
            </div>
          ) : (
            <div className="w-4 h-4 flex items-center justify-center">
              <Play className="w-4 h-4 fill-current text-[#D5AA61] ml-0.5" />
            </div>
          )}

          {/* Text & Track Tagline */}
          <div className="flex flex-col text-left">
            <span className="font-bold tracking-wide text-xs leading-none">
              {isLoading ? 'Loading...' : isPlaying ? 'Pause Music' : 'Play Music'}
            </span>
            <span className="text-[10px] font-medium text-[#D5AA61] leading-tight mt-0.5 max-w-[130px] sm:max-w-[180px] truncate">
              {displayArtist} - {displayTitle}
            </span>
          </div>

          {/* Sound wave equalizer animation when playing */}
          {isPlaying && !isLoading && (
            <span className="flex items-end gap-0.5 h-3.5 ml-1" aria-hidden="true">
              <span className="w-0.5 h-2 bg-white rounded-full animate-bounce [animation-delay:0ms]"></span>
              <span className="w-0.5 h-3.5 bg-[#D5AA61] rounded-full animate-bounce [animation-delay:150ms]"></span>
              <span className="w-0.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:300ms]"></span>
              <span className="w-0.5 h-3 bg-[#D5AA61] rounded-full animate-bounce [animation-delay:75ms]"></span>
            </span>
          )}
        </button>

        {/* Quick Mute button */}
        <button
          onClick={handleMuteToggle}
          className="p-2 text-[#F6EBDD]/80 hover:text-white rounded-full transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
          title={isMuted ? 'Unmute' : 'Mute'}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted || volume === 0 ? (
            <VolumeX className="w-4 h-4 text-[#D8A092]" />
          ) : (
            <Volume2 className="w-4 h-4 text-[#D5AA61]" />
          )}
        </button>

        {/* Expand Drawer Button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-2 text-[#F6EBDD]/80 hover:text-[#D5AA61] rounded-full transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
          title="Track details & volume"
          aria-label="Soundtrack options"
        >
          <Sliders className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};
