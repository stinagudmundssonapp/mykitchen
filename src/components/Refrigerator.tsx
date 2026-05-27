'use client';

import { useState } from 'react';
import { useRefrigerator } from '@/context/RefrigeratorContext';
import { X, Plus, Leaf } from 'lucide-react';

const SECTION_LABELS = {
  top: 'Øverste hylle',
  middle: 'Midthylle',
  vegetable: 'Grønnsakskuff',
};

const SECTION_ICONS = {
  top: '🧈',
  middle: '🥛',
  vegetable: '🥬',
};

export default function Refrigerator() {
  const { items, addItem, removeItem } = useRefrigerator();
  const [input, setInput] = useState('');
  const [activeSection, setActiveSection] = useState<'top' | 'middle' | 'vegetable'>('middle');

  const handleAddItem = () => {
    if (input.trim()) {
      addItem(input.trim(), activeSection);
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddItem();
    }
  };

  const itemsBySection = {
    top: items.filter(item => item.section === 'top'),
    middle: items.filter(item => item.section === 'middle'),
    vegetable: items.filter(item => item.section === 'vegetable'),
  };

  const Section = ({ section, label, icon }: { section: 'top' | 'middle' | 'vegetable'; label: string; icon: string }) => (
    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">{icon}</span>
        <h2 className="text-lg font-semibold text-gray-800">{label}</h2>
        <span className="ml-auto text-sm text-gray-500">{itemsBySection[section].length} varer</span>
      </div>
      <div className="flex flex-wrap gap-2 min-h-12">
        {itemsBySection[section].map(item => (
          <div
            key={item.id}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium border border-blue-200"
          >
            <span>{item.name}</span>
            <button
              onClick={() => removeItem(item.id)}
              className="ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
              aria-label={`Slett ${item.name}`}
            >
              <X size={14} />
            </button>
          </div>
        ))}
        {itemsBySection[section].length === 0 && (
          <p className="text-gray-400 text-sm self-center">Ingen varer ennå</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🧊 MyKitchen</h1>
          <p className="text-gray-600">Hva har du i kjøleskapet?</p>
        </div>

        {/* Add Item Input */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="F.eks. melk, tomat, egg..."
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select
                value={activeSection}
                onChange={e => setActiveSection(e.target.value as any)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="top">🧈 Hylle</option>
                <option value="middle">🥛 Midt</option>
                <option value="vegetable">🥬 Grønt</option>
              </select>
            </div>
            <button
              onClick={handleAddItem}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors sm:px-4"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Legg til</span>
            </button>
          </div>
        </div>

        {/* Refrigerator Sections */}
        <div className="space-y-4">
          <Section section="top" label={SECTION_LABELS.top} icon={SECTION_ICONS.top} />
          <Section section="middle" label={SECTION_LABELS.middle} icon={SECTION_ICONS.middle} />
          <Section section="vegetable" label={SECTION_LABELS.vegetable} icon={SECTION_ICONS.vegetable} />
        </div>

        {/* Stats */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200 text-center">
          <p className="text-sm text-gray-600">
            Du har totalt <span className="font-semibold text-blue-700">{items.length}</span> varer i kjøleskapet
          </p>
        </div>
      </div>
    </div>
  );
}
