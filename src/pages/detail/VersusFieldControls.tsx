/* Shared weather + terrain toggles for VersusPanel and Nuzlocke VersusTab. */
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import {
  sanitizeVersusField,
  versusTerrainForGen,
  versusWeatherForGen,
  type VersusField,
  type VersusTerrain,
  type VersusWeather,
} from '@/lib/versus-context';

const WEATHER_LABEL_KEY: Record<VersusWeather, string> = {
  none: 'versus.field.clear',
  sun: 'versus.weather.sun',
  rain: 'versus.weather.rain',
  sand: 'versus.weather.sand',
  snow: 'versus.weather.snow',
  hail: 'versus.weather.hail',
};

const TERRAIN_LABEL_KEY: Record<VersusTerrain, string> = {
  none: 'versus.field.clear',
  electric: 'versus.terrain.electric',
  grassy: 'versus.terrain.grassy',
  misty: 'versus.terrain.misty',
  psychic: 'versus.terrain.psychic',
};

export function defaultVersusField(): VersusField {
  return { weather: 'none', terrain: 'none' };
}

/** Reset field when gen changes — drops weather/terrain the new gen doesn't support. */
export function fieldForGen(field: VersusField, gen: number): VersusField {
  return sanitizeVersusField(field, gen);
}

export default function VersusFieldControls({
  gen,
  field,
  onChange,
  className,
}: {
  gen: number;
  field: VersusField;
  onChange: (field: VersusField) => void;
  className?: string;
}) {
  const { t } = useTranslation();
  const weatherOptions = versusWeatherForGen(gen);
  const terrainOptions = versusTerrainForGen(gen);
  if (!weatherOptions.length && !terrainOptions.length) return null;

  const weather = field.weather ?? 'none';
  const terrain = field.terrain ?? 'none';

  const pickWeather = (w: VersusWeather) => onChange({ ...field, weather: w });

  const pickTerrain = (tr: VersusTerrain) => onChange({ ...field, terrain: tr });

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {weatherOptions.length > 0 && (
        <div className="flex flex-wrap items-center gap-1">
          <span className="pixel-label text-[7px] text-tx-muted">{t('versus.weatherLabel')}</span>
          {weatherOptions.map((w) => (
            <button
              key={w}
              type="button"
              aria-pressed={weather === w}
              onClick={() => pickWeather(w)}
              className={cn(
                'rounded-pill border px-2 py-0.5 font-sans text-[9px] font-bold uppercase transition-colors',
                weather === w
                  ? 'border-gold/60 bg-gold/10 text-gold'
                  : 'border-hairline text-tx-muted hover:text-tx-secondary',
              )}
            >
              {t(WEATHER_LABEL_KEY[w])}
            </button>
          ))}
        </div>
      )}
      {terrainOptions.length > 0 && (
        <div className="flex flex-wrap items-center gap-1">
          <span className="pixel-label text-[7px] text-tx-muted">{t('versus.terrainLabel')}</span>
          {terrainOptions.map((tr) => (
            <button
              key={tr}
              type="button"
              aria-pressed={terrain === tr}
              onClick={() => pickTerrain(tr)}
              className={cn(
                'rounded-pill border px-2 py-0.5 font-sans text-[9px] font-bold uppercase transition-colors',
                terrain === tr
                  ? 'border-gold/60 bg-gold/10 text-gold'
                  : 'border-hairline text-tx-muted hover:text-tx-secondary',
              )}
            >
              {t(TERRAIN_LABEL_KEY[tr])}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
