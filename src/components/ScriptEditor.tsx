import React from 'react';
import { Scene, VideoProject } from '../types/property';
import { Sparkles, Volume2, Clock, Check, Edit3, ShieldCheck } from 'lucide-react';
import { audioSynthesizer } from '../utils/audioSynthesizer';

interface ScriptEditorProps {
  project: VideoProject;
  onChangeScenes: (scenes: Scene[]) => void;
  onUpdateFullScript: (script: string) => void;
  scriptSource?: string;
}

export const ScriptEditor: React.FC<ScriptEditorProps> = ({
  project,
  onChangeScenes,
  onUpdateFullScript,
  scriptSource,
}) => {
  const handleSceneChange = (index: number, updated: Partial<Scene>) => {
    const next = [...project.scenes];
    next[index] = { ...next[index], ...updated };
    onChangeScenes(next);

    const reassembled = next.map((s) => s.voiceoverScript).join(' ');
    onUpdateFullScript(reassembled);
  };

  const handlePreviewVoice = (text: string) => {
    audioSynthesizer.speakNarration(text);
  };

  return (
    <div className="space-y-5">
      {/* Script Source & Grounding Assurance */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs">
        <div className="flex items-center space-x-2 text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Strict Fact Grounding:{' '}
            <strong className="text-white">
              {scriptSource === 'gemini-3.8-flash' ? 'Gemini 3.8 Flash' : 'Validated Property Logic'}
            </strong>
          </span>
        </div>
        <span className="text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium">
          Zero Hallucination
        </span>
      </div>

      {/* Scene by Scene Timeline Editor */}
      <div className="space-y-3">
        {project.scenes.map((scene, idx) => {
          const targetImg = project.details.images[scene.imageIndex] || project.details.images[0];
          const isIntro = scene.type === 'intro';
          const isOutro = scene.type === 'outro';

          return (
            <div
              key={scene.id || idx}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 transition-all hover:border-slate-700 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <span className="w-6 h-6 rounded-full bg-slate-800 text-amber-400 border border-slate-700 text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      {isIntro ? 'Opening Scene' : isOutro ? 'Closing CTA' : `Feature Scene #${idx}`}
                    </span>
                    <span className="text-[11px] text-slate-400 ml-2">
                      ({scene.durationSec}s duration)
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handlePreviewVoice(scene.voiceoverScript)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 rounded-lg border border-slate-700 transition"
                    title="Listen to this scene's voiceover"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Thumbnail & Quick Form */}
              <div className="flex gap-3">
                {targetImg && (
                  <div className="w-24 h-16 rounded-lg overflow-hidden relative shrink-0 bg-slate-950 border border-slate-800">
                    <img
                      src={targetImg.url}
                      alt={scene.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1 left-1 bg-black/70 text-[9px] text-white px-1 rounded">
                      {targetImg.label}
                    </span>
                  </div>
                )}

                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">
                      Overlay Title
                    </label>
                    <input
                      type="text"
                      value={scene.title}
                      onChange={(e) => handleSceneChange(idx, { title: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700/80 rounded px-2.5 py-1 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">
                      Badge / Tag
                    </label>
                    <input
                      type="text"
                      value={scene.badgeText || ''}
                      onChange={(e) => handleSceneChange(idx, { badgeText: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700/80 rounded px-2.5 py-1 text-xs text-amber-300 font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Voiceover Script Box */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Voiceover Narration & Subtitle
                </label>
                <textarea
                  rows={2}
                  value={scene.voiceoverScript}
                  onChange={(e) =>
                    handleSceneChange(idx, {
                      voiceoverScript: e.target.value,
                      caption: e.target.value,
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
