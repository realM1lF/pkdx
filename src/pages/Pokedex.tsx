/* Route stub — the /pokedex grid page is built by the page agent. */
import PokeballLoader from '@/components/PokeballLoader';

export default function Pokedex() {
  return (
    <div className="mx-auto grid min-h-[60dvh] max-w-content place-items-center px-4 py-24">
      <div className="flex flex-col items-center gap-6">
        <PokeballLoader variant="inline" />
        <p className="pixel-label text-[10px] text-tx-muted">POKÉDEX GRID — COMING ONLINE</p>
      </div>
    </div>
  );
}
