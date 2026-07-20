/* Route stub — the /pokemon/:id detail page is built by the page agent. */
import { useParams } from 'react-router';
import PokeballLoader from '@/components/PokeballLoader';

export default function PokemonDetail() {
  const { id } = useParams();
  return (
    <div className="mx-auto grid min-h-[60dvh] max-w-content place-items-center px-4 py-24">
      <div className="flex flex-col items-center gap-6">
        <PokeballLoader variant="inline" />
        <p className="pixel-label text-[10px] text-tx-muted">ENTRY {id ?? '?'} — COMING ONLINE</p>
      </div>
    </div>
  );
}
