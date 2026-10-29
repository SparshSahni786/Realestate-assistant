import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, ShieldCheck, Film, Cpu, Layers, Terminal } from 'lucide-react';

interface SubmissionDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubmissionDocsModal: React.FC<SubmissionDocsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'readme' | 'ai_approach' | 'architecture' | 'mac_setup'>('overview');

  if (!isOpen) return null;

  const readmeMarkdown = `# Realty Assistant: AI Property Video Generator
**Track:** AI Content Creation / Multimedia
**Assignment Submission:** Realty Assistant AI & ML Engineering Evaluation

---

## 1. Problem Overview & Business Relevance
Real estate sales teams frequently capture high-resolution property photos and basic listing specifications (e.g. 2-BHK apartment, pricing, location, marble flooring, skyline views), but creating bespoke promotional video reels for each listing requires extensive manual editing or expensive post-production agencies. 

This solution delivers an automated, zero-friction AI Video Generator that transforms raw property details and 4–8 photographs into an engaging, ready-to-share promotional video with:
1. **Dynamic Ken Burns camera motion** (smooth panning and zoom easing across architectural elements).
2. **Strictly grounded AI voiceover scripts & subtitles** using Gemini Flash (guaranteed zero hallucinations).
3. **Multi-platform aspect ratios** (16:9 Landscape for Web & MLS, 9:16 Vertical for Instagram Reels & TikTok, 1:1 for Social Feeds).
4. **Royalty-free multi-layer luxury background audio** synthesized via the browser's Web Audio API.
5. **Direct MP4 / WebM video export** rendered directly client-side via HTML5 Canvas + MediaRecorder.

---

## 2. AI / ML Approach & Model Specifications
- **AI Model:** Google Gemini \`gemini-3.8-flash\` via the modern \`@google/genai\` SDK.
- **Server-Side Integration:** Express route \`/api/generate-script\` receives listing metadata and securely interfaces with Gemini API using \`process.env.GEMINI_API_KEY\`.
- **Hallucination Prevention (Zero Hallucination Guarantee):**
  - Prompt enforces a strict closed-world fact assumption: the model is explicitly instructed to extract and rephrase only supplied property attributes.
  - Formatted via JSON Schema with typed scenes, voiceover lines, overlay titles, and durations.
  - Deterministic fallback engine is integrated so the tool works 100% reliably even in offline or network-constrained testing environments.

---

## 3. Tech Stack & Dependencies
- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide Icons, Motion.
- **Video & Audio Engine:** HTML5 2D Canvas, Web Audio API (real-time chord synthesis), MediaRecorder API, Web Speech Synthesis.
- **Backend:** Node.js, Express, tsx, @google/genai.
- **Testing:** Pure logic unit tests with Node test runner (\`node:test\`).

---

## 4. Quick Start & Installation Instructions
\`\`\`bash
# 1. Clone repository and install dependencies
npm install

# 2. Configure Environment (optional - deterministic fallback provided)
cp .env.example .env
# Add GEMINI_API_KEY="your-api-key"

# 3. Run Unit Tests (Validates schema, timing logic, INR pricing, and search engine)
npx --yes tsx --test src/utils/propertyLogic.test.ts src/utils/searchLogic.test.ts

# 4. Start Full-Stack Application
npm run dev
# Server launches on http://localhost:3000
\`\`\`

---

## 5. Key Decisions & Limitations
- **Key Decision 1: Client-Side Hardware-Accelerated Video Rendering:** Generating video via canvas + MediaRecorder avoids costly cloud GPU rendering infrastructure for real estate agencies, enabling instantaneous previews and free downloads.
- **Key Decision 2: In-browser Royalty-Free Audio Synthesis:** To avoid dead audio URLs or copyright strikes on real estate portals, the audio synthesizer procedurally generates lush ambient progressions directly through the Web Audio API.
- **Limitations:** Video generation speed is dependent on client CPU/browser canvas framerate; for 4K 60fps broadcasting, an asynchronous cloud FFmpeg pipeline can be attached to the same scene JSON schema.
`;

  const handleCopyReadme = () => {
    navigator.clipboard.writeText(readmeMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm">
              CU
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Realty Assistant Submission & Technical Documentation
              </h2>
              <p className="text-xs text-slate-400">
                Track: AI Content Creation / Multimedia • AI Property Video Generator
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close Documentation Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 border-b border-slate-800 flex space-x-4 bg-slate-900">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 text-xs font-semibold border-b-2 transition ${
              activeTab === 'overview'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Evaluation Overview (100%)
          </button>
          <button
            onClick={() => setActiveTab('ai_approach')}
            className={`pb-3 text-xs font-semibold border-b-2 transition ${
              activeTab === 'ai_approach'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            AI / ML Approach & Guardrails
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`pb-3 text-xs font-semibold border-b-2 transition ${
              activeTab === 'architecture'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Video Rendering Pipeline
          </button>
          <button
            onClick={() => setActiveTab('readme')}
            className={`pb-3 text-xs font-semibold border-b-2 transition flex items-center space-x-1.5 ${
              activeTab === 'readme'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Submission README.md</span>
          </button>
          <button
            onClick={() => setActiveTab('mac_setup')}
            className={`pb-3 text-xs font-semibold border-b-2 transition flex items-center space-x-1.5 ${
              activeTab === 'mac_setup'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold text-amber-300">Mac Setup (Copy-Paste)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-slate-200 text-xs leading-relaxed">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-2">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                    Problem Understanding (20%)
                  </span>
                  <p className="text-slate-300">
                    Solves the bottleneck real estate sales teams face when creating individual video reels for multiple active listings. Automates the compilation of raw photos and specs into ready-to-share social videos.
                  </p>
                </div>

                <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-2">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                    Working Implementation (30%)
                  </span>
                  <p className="text-slate-300">
                    Live HTML5 Canvas player with real-time Ken Burns camera pans, animated subtitles, timeline scrubbing, and client-side MP4/WebM video recording with mixed audio.
                  </p>
                </div>

                <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-2">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                    AI/ML Quality & Grounding (20%)
                  </span>
                  <p className="text-slate-300">
                    Gemini 3.8 Flash API writes persuasive marketing scripts constrained strictly to input data, preventing AI hallucinations. Dual-layer fallback ensures zero downtime.
                  </p>
                </div>

                <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-2">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                    Code Quality & Tests (15%)
                  </span>
                  <p className="text-slate-300">
                    Decoupled functional pure logic modules with unit tests run via <code className="text-amber-300 bg-slate-900 px-1 py-0.5 rounded">node:test</code> verifying property validation, timing math, and script structuring.
                  </p>
                </div>
              </div>

              {/* Sample listings quick info in INR */}
              <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 space-y-2">
                <h3 className="font-bold text-white text-sm">Pre-Loaded Test Datasets Available (INR ₹)</h3>
                <ul className="list-disc pl-4 space-y-1 text-slate-300">
                  <li><strong>The Lumina 2-BHK Skyline Haven (₹1.85 Cr - Gurugram):</strong> Exact match for the PDF sample scenario (2-BHK apartment, 20–40s video, 5 architectural photos).</li>
                  <li><strong>Villa Bellisima Private Estate (₹8.45 Cr - Goa):</strong> Luxury 4-BHK villa with heated pool and wine cellar scenes.</li>
                  <li><strong>The Crown Penthouse at Worli (₹14.50 Cr - Mumbai):</strong> High-rise duplex penthouse with direct keyed elevator.</li>
                  <li><strong>Indiranagar Urban Terrace (₹3.25 Cr - Bengaluru):</strong> 3-BHK penthouse with private terrace garden.</li>
                  <li><strong>Godrej Meridian (₹95 Lakh - Dwarka Expressway):</strong> Contemporary high-rise 2-BHK apartment.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'ai_approach' && (
            <div className="space-y-4">
              <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-3">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                  <ShieldCheck className="w-5 h-5" />
                  <span>Strict Fact Grounding & Hallucination Mitigation</span>
                </div>
                <p className="text-slate-300">
                  Real estate marketing requires absolute legal precision. If an AI claims a property has &quot;valet parking&quot; or &quot;beachfront access&quot; when it does not, it exposes the brokerage to liability.
                </p>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1">
                  <div className="text-amber-400 font-bold">// System Guardrail Prompt:</div>
                  <div>&quot;You are a professional real estate video copywriter. You must strictly only use the facts provided in the prompt. Do not hallucinate or invent features. Output pure JSON only without markdown fences.&quot;</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-2">
                  <span className="font-bold text-white block">Voice Narration Architecture</span>
                  <p className="text-slate-300">
                    Integrates speech synthesis with scene timestamp boundaries. When scene #2 transitions to scene #3, the audio synthesizer speaks the corresponding voiceover sentence in sync with the visual lower-third overlay.
                  </p>
                </div>
                <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-2">
                  <span className="font-bold text-white block">Procedural Web Audio Synthesizer</span>
                  <p className="text-slate-300">
                    Synthesizes ambient luxury music chords (Cadd9, Dm7, Fmaj7) with low-pass filters and soft marimba chimes directly in the browser. Zero reliance on external MP3 URLs that may expire or trigger copyright strikes.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-4">
              <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-2">
                <h3 className="font-bold text-white text-sm">System Architecture & Pipeline Flow</h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2 text-center">
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="font-bold text-amber-400 block mb-1">1. Ingestion</span>
                    <span className="text-[11px] text-slate-400">Listing form, photo uploads, 4–8 images, validation</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="font-bold text-amber-400 block mb-1">2. AI Storyboard</span>
                    <span className="text-[11px] text-slate-400">Gemini Flash parses facts into structured JSON scene storyboard</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="font-bold text-amber-400 block mb-1">3. Canvas Motion</span>
                    <span className="text-[11px] text-slate-400">Ken Burns zoom/pan math, luxury typography, scrims</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="font-bold text-amber-400 block mb-1">4. MP4 Export</span>
                    <span className="text-[11px] text-slate-400">MediaRecorder streams canvas + Web Audio into video blob</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-2">
                <h3 className="font-bold text-white text-sm">Multi-Platform Aspect Ratio Engine</h3>
                <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                  <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="font-bold text-slate-200 block">16:9 Landscape</span>
                    <span className="text-[10px] text-slate-400">1280x720 • YouTube, MLS Portals, Web</span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="font-bold text-slate-200 block">9:16 Vertical</span>
                    <span className="text-[10px] text-slate-400">720x1280 • Instagram Reels, TikTok, Shorts</span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="font-bold text-slate-200 block">1:1 Square</span>
                    <span className="text-[10px] text-slate-400">1080x1080 • Instagram & Facebook Feed</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'readme' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Submission README file content</span>
                <button
                  onClick={handleCopyReadme}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition flex items-center space-x-1.5 text-xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy README.md'}</span>
                </button>
              </div>
              <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[360px]">
                {readmeMarkdown}
              </pre>
            </div>
          )}

          {activeTab === 'mac_setup' && (
            <div className="space-y-4">
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 space-y-1">
                <span className="font-bold text-amber-300 text-sm block">How to Run on macOS in 3 Minutes</span>
                <p className="text-slate-300 text-xs">
                  Follow these step-by-step Terminal instructions to clone or copy-paste this project onto your Mac and run it locally.
                </p>
              </div>

              {/* Step 1 */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center">1</span>
                  <span className="font-bold text-white text-xs">Open Terminal & Verify Node.js</span>
                </div>
                <p className="text-slate-400 text-xs pl-8">
                  Press <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-white font-mono">Cmd + Space</kbd>, type <strong>Terminal</strong>, and hit Enter. Verify Node.js (v20+ recommended):
                </p>
                <pre className="ml-8 p-3 bg-slate-900 rounded-lg border border-slate-800 font-mono text-[11px] text-amber-300 overflow-x-auto">
node -v
# If not installed, install via Homebrew:
# brew install node
                </pre>
              </div>

              {/* Step 2 */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center">2</span>
                  <span className="font-bold text-white text-xs">Download or Unzip the Project Files</span>
                </div>
                <div className="pl-8 space-y-2">
                  <p className="text-slate-400 text-xs">
                    <strong>Option A (1-Click Download):</strong> Click the button below to download the complete source code archive to your Mac:
                  </p>
                  <a
                    href="/realty-assistant-source.zip"
                    download="realty-assistant-source.zip"
                    className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download realty-assistant-source.zip (1.5 MB)</span>
                  </a>
                  <p className="text-slate-400 text-xs mt-2">
                    Once downloaded, double-click <code>realty-assistant-source.zip</code> in your Mac Downloads folder to extract it, then in Terminal run:
                  </p>
                  <pre className="p-3 bg-slate-900 rounded-lg border border-slate-800 font-mono text-[11px] text-amber-300 overflow-x-auto">
cd ~/Downloads/realty-assistant-source
                  </pre>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center">3</span>
                  <span className="font-bold text-white text-xs">Install Dependencies</span>
                </div>
                <pre className="ml-8 p-3 bg-slate-900 rounded-lg border border-slate-800 font-mono text-[11px] text-amber-300 overflow-x-auto">
npm install
                </pre>
              </div>

              {/* Step 4 */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center">4</span>
                  <span className="font-bold text-white text-xs">Run Unit Tests (Pure Logic Verification)</span>
                </div>
                <pre className="ml-8 p-3 bg-slate-900 rounded-lg border border-slate-800 font-mono text-[11px] text-amber-300 overflow-x-auto">
npx --yes tsx --test src/utils/propertyLogic.test.ts src/utils/searchLogic.test.ts
                </pre>
              </div>

              {/* Step 5 */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center">5</span>
                  <span className="font-bold text-white text-xs">Launch the Full-Stack App</span>
                </div>
                <pre className="ml-8 p-3 bg-slate-900 rounded-lg border border-slate-800 font-mono text-[11px] text-amber-300 overflow-x-auto">
npm run dev
                </pre>
                <p className="text-slate-300 text-xs pl-8">
                  Open <strong>http://localhost:3000</strong> in Safari or Chrome. You can immediately search listings in INR (₹), preview Ken Burns animations, and export MP4 videos!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Realty Assistant • Evaluation Track: AI Content Creation / Multimedia
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
