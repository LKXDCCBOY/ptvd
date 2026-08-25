import React, { useState, useMemo } from 'react'
import {
  Video, Music, Archive, Scissors, Filter, Image, ChevronRight,
  Sparkles, Search, RotateCw, Zap, Film, VolumeX, Combine,
  Split, Repeat, Trash2, Cpu, Wrench, Info, Download, Type,
  Copyright, Aperture, Circle, Palette, Radio, Contrast,
  Maximize, EyeOff, Layers, AlertTriangle, Wand2
} from 'lucide-react'
import { presetTemplates, presetCategories } from '../data/presets'
import { getPresetTranslation } from '../data/presetTranslations'
import { useFFmpegStore } from '../store/ffmpegStore'
import { PresetTemplate, PresetCategory } from '../types'
import { useI18n } from '../i18n'

const iconMap: Record<string, React.ReactNode> = {
  video: <Video className="w-4 h-4" />,
  music: <Music className="w-4 h-4" />,
  archive: <Archive className="w-4 h-4" />,
  scissors: <Scissors className="w-4 h-4" />,
  filter: <Filter className="w-4 h-4" />,
  image: <Image className="w-4 h-4" />,
  maximize: <Maximize className="w-4 h-4" />,
  sun: <Sparkles className="w-4 h-4" />,
  rewind: <RotateCw className="w-4 h-4" />,
  rotate: <RotateCw className="w-4 h-4" />,
  zap: <Zap className="w-4 h-4" />,
  film: <Film className="w-4 h-4" />,
  'volume-x': <VolumeX className="w-4 h-4" />,
  combine: <Combine className="w-4 h-4" />,
  split: <Split className="w-4 h-4" />,
  repeat: <Repeat className="w-4 h-4" />,
  'trash-2': <Trash2 className="w-4 h-4" />,
  cpu: <Cpu className="w-4 h-4" />,
  wrench: <Wrench className="w-4 h-4" />,
  info: <Info className="w-4 h-4" />,
  download: <Download className="w-4 h-4" />,
  type: <Type className="w-4 h-4" />,
  copyright: <Copyright className="w-4 h-4" />,
  aperture: <Aperture className="w-4 h-4" />,
  blur: <EyeOff className="w-4 h-4" />,
  circle: <Circle className="w-4 h-4" />,
  palette: <Palette className="w-4 h-4" />,
  radio: <Radio className="w-4 h-4" />,
  contrast: <Contrast className="w-4 h-4" />,
  layout: <Layers className="w-4 h-4" />,
  sparkles: <Sparkles className="w-4 h-4" />,
}

const PresetTemplates: React.FC = () => {
  const { setCommand, selectedPreset, setSelectedPreset } = useFFmpegStore()
  const [activeCategory, setActiveCategory] = useState<PresetCategory | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const { t, language } = useI18n()

  const getTranslatedTemplate = (template: PresetTemplate) => {
    const translation = getPresetTranslation(template.id, language)
    if (translation) {
      return { ...template, name: translation.name, description: translation.description }
    }
    return template
  }

  const filteredTemplates = useMemo(() => {
    let result = activeCategory === 'all'
      ? presetTemplates
      : presetTemplates.filter((t) => t.category === activeCategory)

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter((t) => {
        const translated = getTranslatedTemplate(t)
        return (
          translated.name.toLowerCase().includes(query) ||
          translated.description.toLowerCase().includes(query) ||
          t.command.toLowerCase().includes(query)
        )
      })
    }
    return result
  }, [activeCategory, searchQuery, language])

  const handleSelectPreset = (preset: PresetTemplate) => {
    setSelectedPreset(preset)
    setCommand(preset.command)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-neon-blue" />
          <h3 className="text-dark-100 text-sm font-medium">{t.presets.title}</h3>
          <span className="text-dark-300 text-xs bg-dark-700 px-1.5 py-0.5 rounded">
            {presetTemplates.length}
          </span>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.presets.searchPlaceholder}
          className="w-full bg-dark-700 border border-dark-500 rounded-lg py-2 pl-8 pr-3 text-sm text-dark-100 placeholder-dark-400 focus:outline-none focus:border-neon-green transition-colors"
        />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {presetCategories.map((category) => (
          <button
            key={category.value}
            onClick={() => setActiveCategory(category.value)}
            className={`px-2 py-1 rounded-md text-xs transition-colors ${
              activeCategory === category.value
                ? 'bg-neon-green text-dark-900 font-medium'
                : 'bg-dark-700 text-dark-200 hover:bg-dark-600'
            }`}
          >
            {t.presets.categories[category.value]}
          </button>
        ))}
      </div>

      <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-6 text-dark-400">
            <Search className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">{t.presets.noResults}</p>
          </div>
        ) : (
          filteredTemplates.map((template) => {
            const translated = getTranslatedTemplate(template)
            return (
            <button
              key={template.id}
              onClick={() => handleSelectPreset(template)}
              className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-all ${
                selectedPreset?.id === template.id
                  ? 'bg-neon-green/10 border border-neon-green/30'
                  : 'bg-dark-700/50 hover:bg-dark-700 border border-transparent'
              }`}
            >
              <div className="p-2 rounded-md bg-dark-600 text-dark-200 shrink-0">
                {iconMap[template.icon] || <Video className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-dark-100 text-sm font-medium leading-tight">{translated.name}</p>
                <p className="text-dark-300 text-xs truncate leading-tight">{translated.description}</p>
                {(template.complex || template.wasmWarning) && (
                  <div className="flex items-center gap-1 mt-1">
                    {template.complex && (
                      <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 text-xs">
                        <Wand2 className="w-3 h-3" />
                        {t.presets.complex}
                      </span>
                    )}
                    {template.wasmWarning && (
                      <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 text-xs">
                        <AlertTriangle className="w-3 h-3" />
                        {t.presets.wasmWarning}
                      </span>
                    )}
                  </div>
                )}
                {template.usageHint && (
                  <p className="text-dark-400 text-xs truncate mt-1">{template.usageHint}</p>
                )}
              </div>
              <ChevronRight className="w-4 h-4 text-dark-400 shrink-0" />
            </button>
          )})
        )}
      </div>
    </div>
  )
}

export default PresetTemplates
