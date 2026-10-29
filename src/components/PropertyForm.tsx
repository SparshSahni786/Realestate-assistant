import React, { useState } from 'react';
import { PropertyDetails, PropertyImage, ValidationResult } from '../types/property';
import { Plus, Trash2, Image as ImageIcon, AlertCircle, Sparkles, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { SAMPLE_PROPERTIES } from '../data/sampleProperties';

interface PropertyFormProps {
  details: PropertyDetails;
  onChange: (updated: PropertyDetails) => void;
  validation: ValidationResult;
  onGenerateScript: () => void;
  isGeneratingScript: boolean;
}

export const PropertyForm: React.FC<PropertyFormProps> = ({
  details,
  onChange,
  validation,
  onGenerateScript,
  isGeneratingScript,
}) => {
  const [newFeature, setNewFeature] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageLabel, setNewImageLabel] = useState('');
  const [showAddImageModal, setShowAddImageModal] = useState(false);

  const handleFieldChange = (field: keyof PropertyDetails, value: any) => {
    onChange({ ...details, [field]: value });
  };

  const handleAddFeature = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeature.trim()) return;
    const current = details.keyFeatures || [];
    handleFieldChange('keyFeatures', [...current, newFeature.trim()]);
    setNewFeature('');
  };

  const handleRemoveFeature = (index: number) => {
    const current = [...(details.keyFeatures || [])];
    current.splice(index, 1);
    handleFieldChange('keyFeatures', current);
  };

  const handleAddImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl.trim()) return;
    const newImg: PropertyImage = {
      id: `custom-img-${Date.now()}`,
      url: newImageUrl.trim(),
      label: newImageLabel.trim() || `View ${details.images.length + 1}`,
      isCustom: true,
    };
    handleFieldChange('images', [...details.images, newImg]);
    setNewImageUrl('');
    setNewImageLabel('');
    setShowAddImageModal(false);
  };

  const handleRemoveImage = (index: number) => {
    const current = [...details.images];
    current.splice(index, 1);
    handleFieldChange('images', current);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          const newImg: PropertyImage = {
            id: `upload-${Date.now()}`,
            url: uploadEvent.target.result as string,
            label: file.name.replace(/\.[^/.]+$/, ''),
            isCustom: true,
          };
          handleFieldChange('images', [...details.images, newImg]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Validation Banner */}
      {!validation.isValid && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-xs text-red-200">
          <div className="flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold text-red-300 block mb-1">Missing Required Details:</span>
              <ul className="list-disc pl-4 space-y-0.5">
                {validation.errors.map((err, i) => (
                  <li key={i}>{err.message}</li>
                ))}
              </ul>
              <button
                onClick={() => onChange(SAMPLE_PROPERTIES['sunset-loft'])}
                className="mt-2.5 inline-flex items-center space-x-1.5 px-2.5 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded font-semibold transition"
              >
                <span>Autofill with 2-BHK Listing</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Warnings Banner */}
      {validation.warnings.length > 0 && validation.isValid && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-200">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="flex-1">
              {validation.warnings.map((w, i) => (
                <div key={i}>{w}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 1. Core Property Metadata */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h2 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>1. Listing Information</span>
          </h2>
          <span className="text-[11px] text-slate-400 font-medium">Step 1 of 3</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1">Property Name / Project *</label>
            <input
              type="text"
              value={details.propertyName}
              onChange={(e) => handleFieldChange('propertyName', e.target.value)}
              placeholder="e.g. The Lumina 2-BHK Skyline Haven"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Property Type *</label>
            <select
              value={details.propertyType}
              onChange={(e) => handleFieldChange('propertyType', e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
            >
              <option value="2-BHK Designer Apartment">2-BHK Designer Apartment</option>
              <option value="3-BHK Luxury Apartment">3-BHK Luxury Apartment</option>
              <option value="4-BHK Mediterranean Villa">4-BHK Mediterranean Villa</option>
              <option value="Duplex Penthouse">Duplex Penthouse</option>
              <option value="Modern Studio Residence">Modern Studio Residence</option>
              <option value="Gated Community Estate">Gated Community Estate</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Listing Price (INR ₹) *</label>
            <input
              type="text"
              value={details.price}
              onChange={(e) => handleFieldChange('price', e.target.value)}
              placeholder="e.g. ₹1.85 Cr or ₹95 Lakh"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-400 font-medium"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1">Location & Neighborhood *</label>
            <input
              type="text"
              value={details.location}
              onChange={(e) => handleFieldChange('location', e.target.value)}
              placeholder="e.g. DLF Cyber City, Sector 42, Gurugram"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Bedrooms / Layout</label>
            <input
              type="text"
              value={details.bedrooms || ''}
              onChange={(e) => handleFieldChange('bedrooms', e.target.value)}
              placeholder="e.g. 2 Beds"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Carpet / Super Area</label>
            <input
              type="text"
              value={details.areaSqft || ''}
              onChange={(e) => handleFieldChange('areaSqft', e.target.value)}
              placeholder="e.g. 1,320 sq.ft."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
          </div>
        </div>
      </div>

      {/* 2. Key Features */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>2. Key Features & Amenities</span>
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              These will form the individual highlight scenes in the promotional video.
            </p>
          </div>
          <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
            {details.keyFeatures.length} Added
          </span>
        </div>

        {/* Feature Tags List */}
        <div className="flex flex-wrap gap-2">
          {details.keyFeatures.map((feat, idx) => (
            <div
              key={idx}
              className="bg-slate-800 border border-slate-700/80 rounded-lg px-3 py-1.5 flex items-center space-x-2 text-xs text-slate-200"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span>{feat}</span>
              <button
                type="button"
                onClick={() => handleRemoveFeature(idx)}
                className="text-slate-400 hover:text-red-400 ml-1 transition"
                aria-label={`Remove feature ${feat}`}
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Feature Input */}
        <form onSubmit={handleAddFeature} className="flex gap-2">
          <input
            type="text"
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            placeholder="Add highlight (e.g. Private Pool, Italian Marble, Sunset Balcony)..."
            className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-400"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 font-semibold text-xs rounded-lg border border-slate-700 transition flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </form>
      </div>

      {/* 3. Photos & Images (4-8 Required) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>3. Property Photos ({details.images.length})</span>
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              4 to 8 images recommended. Each photo maps directly to a cinematic Ken Burns scene.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <label className="cursor-pointer px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition">
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>Upload Photo</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
            <button
              type="button"
              onClick={() => setShowAddImageModal(!showAddImageModal)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition"
            >
              <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
              <span>Image URL</span>
            </button>
          </div>
        </div>

        {/* Add URL Drawer */}
        {showAddImageModal && (
          <form onSubmit={handleAddImage} className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
                required
              />
              <input
                type="text"
                value={newImageLabel}
                onChange={(e) => setNewImageLabel(e.target.value)}
                placeholder="Label (e.g. Master Bedroom, Rooftop Deck)"
                className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddImageModal(false)}
                className="px-2.5 py-1 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-slate-950 rounded"
              >
                Add Image
              </button>
            </div>
          </form>
        )}

        {/* Image Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {details.images.map((img, idx) => (
            <div
              key={img.id || idx}
              className="relative group bg-slate-950 rounded-xl overflow-hidden border border-slate-800 aspect-video flex flex-col justify-end"
            >
              <img
                src={img.url}
                alt={img.label}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent"></div>
              
              <div className="relative p-2 flex items-center justify-between text-white z-10">
                <div className="truncate pr-1">
                  <span className="text-[10px] font-bold text-amber-400 block">Scene #{idx + 1}</span>
                  <span className="text-xs font-medium text-slate-200 truncate block">{img.label}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="opacity-0 group-hover:opacity-100 p-1 bg-red-500/80 hover:bg-red-600 text-white rounded transition"
                  aria-label={`Remove image ${img.label}`}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Contact & Call to Action */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
        <h2 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          <span>4. Contact & Closing CTA</span>
        </h2>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Call to Action / Broker Contact Info
          </label>
          <textarea
            rows={2}
            value={details.contactText}
            onChange={(e) => handleFieldChange('contactText', e.target.value)}
            placeholder="e.g. Schedule a Private Tour: +1 (555) 389-0199 | visit realtyassistant.com"
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-400"
          />
        </div>
      </div>

      {/* AI Script Generation CTA */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>AI Script & Voiceover Generation</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md">
            Gemini Flash writes a concise, high-converting voiceover and scene subtitles strictly using provided listing details.
          </p>
        </div>
        <button
          type="button"
          onClick={onGenerateScript}
          disabled={isGeneratingScript || !validation.isValid}
          className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2 transition shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isGeneratingScript ? 'Writing AI Script...' : 'Generate AI Storyboard'}</span>
        </button>
      </div>
    </div>
  );
};
