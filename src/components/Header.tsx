import React from 'react';
import { BookOpen, Building2, Download } from 'lucide-react';
import { SAMPLE_PROPERTIES } from '../data/sampleProperties';
import { PropertyDetails, PropertyImage, Scene } from '../types/property';
import { SearchBar } from './SearchBar';

interface HeaderProps {
  currentProperty: PropertyDetails;
  currentScenes: Scene[];
  onSelectSample: (details: PropertyDetails) => void;
  onSelectScene: (sceneIndex: number) => void;
  onAddMediaImage: (image: PropertyImage) => void;
  onOpenDocs: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentProperty,
  currentScenes,
  onSelectSample,
  onSelectScene,
  onAddMediaImage,
  onOpenDocs,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Brand */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-black text-xl">
            R
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center space-x-2">
              <span className="font-extrabold tracking-tight text-white text-base">REALTY ASSISTANT</span>
              <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                AI Multimedia
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">AI Property Video Generator • Indian Real Estate (INR ₹)</p>
          </div>
        </div>

        {/* Global Fast Search Bar */}
        <SearchBar
          currentProperty={currentProperty}
          currentScenes={currentScenes}
          onSelectProperty={onSelectSample}
          onSelectScene={onSelectScene}
          onAddMediaImage={onAddMediaImage}
        />

        {/* Action Controls */}
        <div className="flex items-center space-x-2 shrink-0">
          {/* Preset Selector */}
          <div className="hidden lg:flex items-center space-x-1.5 bg-slate-800/80 border border-slate-700/80 rounded-lg p-1">
            <span className="text-xs font-semibold text-slate-400 pl-2 flex items-center">
              <Building2 className="w-3.5 h-3.5 mr-1 text-amber-400" />
              Presets:
            </span>
            <select
              aria-label="Load Sample Listing"
              onChange={(e) => {
                if (e.target.value && SAMPLE_PROPERTIES[e.target.value]) {
                  onSelectSample(SAMPLE_PROPERTIES[e.target.value]);
                }
              }}
              defaultValue=""
              className="bg-slate-900 text-xs text-white rounded px-2.5 py-1.5 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
            >
              <option value="" disabled>Load Sample Property...</option>
              <option value="sunset-loft">The Lumina 2-BHK (₹1.85 Cr - Gurugram)</option>
              <option value="emerald-villa">Villa Bellisima Estate (₹8.45 Cr - Goa)</option>
              <option value="urban-penthouse">The Crown Penthouse (₹14.50 Cr - Worli)</option>
              <option value="bangalore-loft">Indiranagar Terrace (₹3.25 Cr - Bengaluru)</option>
              <option value="expressway-2bhk">Godrej Meridian 2-BHK (₹95 Lakh)</option>
            </select>
          </div>

          {/* Download Source Code ZIP for Mac */}
          <a
            href="/realty-assistant-source.zip"
            download="realty-assistant-source.zip"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm transition"
            title="Download complete source code (.zip) for Mac"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Download Code (.ZIP)</span>
            <span className="md:hidden">.ZIP</span>
          </a>

          {/* Submission / Docs Button */}
          <button
            onClick={onOpenDocs}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Candidate Docs</span>
            <span className="sm:hidden">Docs</span>
          </button>
        </div>
      </div>
    </header>
  );
};
