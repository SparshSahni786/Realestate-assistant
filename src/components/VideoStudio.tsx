import React, { useEffect, useRef, useState } from 'react';
import { AspectRatio, MusicTheme, VideoProject } from '../types/property';
import {
  Play,
  Pause,
  RotateCcw,
  Download,
  Volume2,
  VolumeX,
  Maximize2,
  Music,
  Mic,
  Film,
  CheckCircle,
  Share2,
  Tv,
  Smartphone,
  Square,
  Sparkles,
} from 'lucide-react';
import {
  exportVideo,
  preloadAllImages,
  renderFrame,
} from '../utils/videoRenderer';
import { audioSynthesizer } from '../utils/audioSynthesizer';
import { calculateSceneTimings, getAspectDimensions } from '../utils/propertyLogic';

interface VideoStudioProps {
  project: VideoProject;
  onUpdateProject: (updated: Partial<VideoProject>) => void;
}

export const VideoStudio: React.FC<VideoStudioProps> = ({
  project,
  onUpdateProject,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportedVideoUrl, setExportedVideoUrl] = useState<string | null>(null);
  const [exportedFilename, setExportedFilename] = useState<string>('');
  const [preloadedImages, setPreloadedImages] = useState<HTMLImageElement[]>([]);
  const [isImagesLoaded, setIsImagesLoaded] = useState(false);
  const [activeNarrationSceneIndex, setActiveNarrationSceneIndex] = useState<number | null>(null);

  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Preload images whenever project images change
  useEffect(() => {
    let isCancelled = false;
    const urls = project.details.images.map((img) => img.url);
    if (urls.length === 0) return;

    preloadAllImages(urls).then((imgs) => {
      if (!isCancelled) {
        setPreloadedImages(imgs);
        setIsImagesLoaded(true);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [project.details.images]);

  // Audio synchronization
  useEffect(() => {
    audioSynthesizer.setMusicTheme(project.musicTheme);
    audioSynthesizer.setMusicVolume(project.musicVolume);
    audioSynthesizer.setVoiceVolume(project.voiceVolume);
    audioSynthesizer.setMuted(!project.enableMusic && !project.enableVoiceover);
  }, [
    project.musicTheme,
    project.musicVolume,
    project.voiceVolume,
    project.enableMusic,
    project.enableVoiceover,
  ]);

  // Handle Voiceover narration per scene trigger
  useEffect(() => {
    if (!isPlaying || !project.enableVoiceover) {
      audioSynthesizer.stopNarration();
      setActiveNarrationSceneIndex(null);
      return;
    }

    const timings = calculateSceneTimings(project.scenes, project.targetDurationSec);
    const activeIdx = timings.findIndex(
      (t) => currentTime >= t.startTime && currentTime < t.endTime
    );

    if (activeIdx !== -1 && activeIdx !== activeNarrationSceneIndex) {
      setActiveNarrationSceneIndex(activeIdx);
      const scene = project.scenes[activeIdx];
      if (scene && scene.voiceoverScript) {
        audioSynthesizer.speakNarration(scene.voiceoverScript);
      }
    }
  }, [
    currentTime,
    isPlaying,
    project.enableVoiceover,
    project.scenes,
    project.targetDurationSec,
    activeNarrationSceneIndex,
  ]);

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = (timestamp: number) => {
      if (lastTimeRef.current !== null && isPlaying) {
        const delta = (timestamp - lastTimeRef.current) / 1000;
        setCurrentTime((prev) => {
          const next = prev + delta;
          if (next >= project.targetDurationSec) {
            setIsPlaying(false);
            audioSynthesizer.stopAll();
            return project.targetDurationSec;
          }
          return next;
        });
      }
      lastTimeRef.current = timestamp;

      // Draw active frame
      renderFrame(ctx, project, currentTime, preloadedImages);

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, currentTime, project, preloadedImages]);

  const handleTogglePlay = () => {
    if (currentTime >= project.targetDurationSec) {
      setCurrentTime(0);
    }

    if (!isPlaying) {
      setIsPlaying(true);
      lastTimeRef.current = performance.now();
      if (project.enableMusic && project.musicTheme !== 'none') {
        audioSynthesizer.startMusic();
      }
    } else {
      setIsPlaying(false);
      lastTimeRef.current = null;
      audioSynthesizer.stopAll();
    }
  };

  const handleSeek = (newTime: number) => {
    setCurrentTime(newTime);
    audioSynthesizer.stopNarration();
    setActiveNarrationSceneIndex(null);
  };

  const handleRestart = () => {
    setCurrentTime(0);
    setActiveNarrationSceneIndex(null);
    audioSynthesizer.stopAll();
    if (isPlaying && project.enableMusic && project.musicTheme !== 'none') {
      audioSynthesizer.startMusic();
    }
  };

  const handleExport = async () => {
    if (isExporting) return;
    setIsPlaying(false);
    audioSynthesizer.stopAll();
    setIsExporting(true);
    setExportProgress(0);

    try {
      const res = await exportVideo(project, (pct) => {
        setExportProgress(pct);
      });
      setExportedVideoUrl(res.url);
      setExportedFilename(res.filename);
      setIsExporting(false);

      // Trigger instant browser download
      const link = document.createElement('a');
      link.href = res.url;
      link.download = res.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Export failed:', err);
      setIsExporting(false);
      alert('Video export encountered an issue. Please try again.');
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const { width: aspectW, height: aspectH } = getAspectDimensions(project.aspectRatio);

  return (
    <div className="space-y-5">
      {/* Aspect Ratio & Format Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
            <Tv className="w-3.5 h-3.5 text-amber-400" />
            <span>Aspect Ratio:</span>
          </span>
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => onUpdateProject({ aspectRatio: '16:9' })}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition ${
                project.aspectRatio === '16:9'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>16:9 Web</span>
            </button>
            <button
              type="button"
              onClick={() => onUpdateProject({ aspectRatio: '9:16' })}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition ${
                project.aspectRatio === '9:16'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>9:16 Reels</span>
            </button>
            <button
              type="button"
              onClick={() => onUpdateProject({ aspectRatio: '1:1' })}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition ${
                project.aspectRatio === '1:1'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Square className="w-3.5 h-3.5" />
              <span>1:1 Square</span>
            </button>
          </div>
        </div>

        {/* Video Duration Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-300">Pacing:</span>
          <select
            value={project.targetDurationSec}
            onChange={(e) => onUpdateProject({ targetDurationSec: Number(e.target.value) })}
            className="bg-slate-950 text-xs text-white border border-slate-700 rounded-lg px-2.5 py-1.5 font-medium cursor-pointer"
          >
            <option value={5}>5s Quick Preview Demo</option>
            <option value={20}>20s Quick Social Reel</option>
            <option value={25}>25s Standard Showcase</option>
            <option value={30}>30s Full Feature Tour</option>
            <option value={40}>40s Extended Luxury Tour</option>
          </select>
        </div>
      </div>

      {/* Main Canvas Viewport */}
      <div className="relative bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex items-center justify-center min-h-[380px] p-4">
        <canvas
          ref={canvasRef}
          width={aspectW}
          height={aspectH}
          className="rounded-xl shadow-2xl max-h-[460px] object-contain border border-slate-800"
          style={{
            aspectRatio: `${aspectW} / ${aspectH}`,
            maxWidth: project.aspectRatio === '9:16' ? '300px' : '100%',
          }}
        />

        {/* Hover / Inactive Center Play Button Overlay */}
        {!isPlaying && (
          <button
            type="button"
            onClick={handleTogglePlay}
            aria-label="Play Video Preview"
            className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-amber-500/90 hover:bg-amber-400 text-slate-950 flex items-center justify-center shadow-xl shadow-amber-500/30 transition-transform hover:scale-110"
          >
            <Play className="w-8 h-8 ml-1 fill-current" />
          </button>
        )}
      </div>

      {/* Playback Controls & Timeline Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
        {/* Scrub Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono text-slate-400">
            <span>{formatSeconds(currentTime)}</span>
            <span className="text-amber-400 font-bold">
              Scene {calculateSceneTimings(project.scenes, project.targetDurationSec).findIndex(
                (t) => currentTime >= t.startTime && currentTime <= t.endTime
              ) + 1} of {project.scenes.length}
            </span>
            <span>{formatSeconds(project.targetDurationSec)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={project.targetDurationSec}
            step={0.1}
            value={currentTime}
            onChange={(e) => handleSeek(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
        </div>

        {/* Player Buttons & Audio Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleTogglePlay}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center space-x-1.5 transition shadow-sm"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? 'Pause' : 'Play Preview'}</span>
            </button>
            <button
              type="button"
              onClick={handleRestart}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition"
              title="Restart Video"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Audio Presets & Vol */}
          <div className="flex items-center space-x-3 bg-slate-950/70 border border-slate-800 px-3 py-1.5 rounded-xl">
            {/* Music theme */}
            <div className="flex items-center space-x-1.5">
              <Music className="w-3.5 h-3.5 text-amber-400" />
              <select
                value={project.musicTheme}
                onChange={(e) => onUpdateProject({ musicTheme: e.target.value as MusicTheme })}
                className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer font-medium"
              >
                <option value="luxury_ambient" className="bg-slate-900">Luxury Lounge</option>
                <option value="modern_acoustic" className="bg-slate-900">Modern Acoustic</option>
                <option value="cinematic_elegance" className="bg-slate-900">Cinematic Grand</option>
                <option value="upbeat_urban" className="bg-slate-900">Upbeat Chic</option>
                <option value="none" className="bg-slate-900">Mute Music</option>
              </select>
            </div>

            <div className="h-4 w-px bg-slate-800"></div>

            {/* Voice toggle */}
            <button
              type="button"
              onClick={() => onUpdateProject({ enableVoiceover: !project.enableVoiceover })}
              className={`flex items-center space-x-1 text-xs px-2 py-1 rounded ${
                project.enableVoiceover
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Mic className="w-3 h-3" />
              <span>Voice</span>
            </button>
          </div>
        </div>
      </div>

      {/* Export Section */}
      <div className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Film className="w-4 h-4 text-amber-400" />
              <span>Ready-To-Share Video Export</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Exports high-definition MP4/WebM video with embedded typography, smooth camera motion, and mixed audio track.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href="/sample-property-video.mp4"
              download="sample-2bhk-promotional-video.mp4"
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition shrink-0"
              title="Download pre-rendered sample MP4 video"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Sample MP4 Video</span>
            </a>

            <button
              type="button"
              onClick={handleExport}
              disabled={isExporting}
              className="px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2 transition shrink-0"
            >
              <Film className="w-4 h-4" />
              <span>{isExporting ? `Encoding Video (${exportProgress}%)...` : 'Export Custom Video'}</span>
            </button>
          </div>
        </div>

        {/* Progress Bar during Export */}
        {isExporting && (
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-xs text-slate-300 font-medium">
              <span>Rendering 30fps Video Frames & Audio Track...</span>
              <span className="font-bold text-amber-400">{exportProgress}%</span>
            </div>
            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-150"
                style={{ width: `${exportProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Export Success Notification & Quick Download */}
        {exportedVideoUrl && !isExporting && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3.5 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="text-xs font-bold text-emerald-200 block">Video Export Ready!</span>
                <span className="text-[11px] text-emerald-300/80 font-mono">{exportedFilename}</span>
              </div>
            </div>
            <a
              href={exportedVideoUrl}
              download={exportedFilename}
              className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg shadow transition flex items-center space-x-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
