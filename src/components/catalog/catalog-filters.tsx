import { Link, useNavigate } from '@tanstack/react-router';
import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DEFAULT_PAGE_SIZE,
  NETWORK_LABELS,
  NETWORKS,
  SORT_LABELS,
  SORT_OPTIONS,
  
  type CatalogSearchParams,
  type SortOption,
} from '@/api/search-params';
import type { NftCollection } from '@/types';

import {
  useNftCollections,
  useNftNetworkCounts,
} from '@/hooks/use-nfts';

import { X } from 'lucide-react';

export interface CatalogFiltersProps {
  search: CatalogSearchParams;
}

export function CatalogFilters({ search }: CatalogFiltersProps) {
  const navigate = useNavigate({ from: '/' });
 const collections = useNftCollections();
const networkCounts = useNftNetworkCounts();
  const [maxPriceDraft, setMaxPriceDraft] = useState(Number(search.maxPrice ?? 10));

  const update = useCallback(
    (patch: Partial<CatalogSearchParams>) => {
      navigate({
        search: (prev) => ({ ...prev, ...patch, page: 1 }),
        replace: true,
      });
    },
    [navigate],
  );

  const clear = useCallback(() => {
    navigate({ search: {}, replace: true });
  }, [navigate]);

  const hasFilters = Boolean(
    search.q ||
    search.collection ||
    search.category ||
    search.network ||
    search.rarity ||
    search.minPrice ||
    search.maxPrice,
  );

  return (
    <aside aria-label="Filtros do catálogo" className="space-y-6">
      <div className="card-surface p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider">Categorias</h2>
        {collections.isLoading ? (
          <Skeleton className="h-32" />
        ) : (
          <ul className="space-y-2 text-sm">
            {(collections.data ?? []).map((col: NftCollection) => (
              <li key={col.id}>
                <FilterRow
                  label={col.name}
                  count={col.count}
                  active={search.collection === col.slug}
                  onClick={() =>
                    update({ collection: search.collection === col.slug ? undefined : col.slug })
                  }
                />
              </li>
            ))}
          </ul>
        )}

        <h2 className="mb-4 mt-6 text-sm font-semibold uppercase tracking-wider">Faixa de preço</h2>

        <div className="space-y-4">
          <div className="relative px-1">
            <input
              type="range"
              min={0}
              max={10}
              step={0.1}
              value={maxPriceDraft}
              onChange={(e) => setMaxPriceDraft(Number(e.target.value))}
              aria-label="Preço máximo em ETH"
              className="h-2 w-full cursor-pointer rounded-full bg-orange-500 accent-orange-500"
            />
          </div>

          <p className="text-sm text-muted-foreground">
            Preço:{Number(search.minPrice ?? 0).toFixed(2)}-{''}
            {Number(search.maxPrice ?? 10).toFixed(2)} ETH
          </p>
          <button
            type="button"
            onClick={() => update({ maxPrice: maxPriceDraft.toFixed(2) })}
            className="mt-3 w-1/2 rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-orange-600"
          >
            Aplicar
          </button>
        </div>
 <h2 className="mb-3 mt-6 text-sm font-semibold uppercase tracking-wider">
    Rede
  </h2>

  {networkCounts.isLoading ? (
    <Skeleton className="h-24" />
  ) : (
    <ul className="space-y-2 text-sm">
      <li>
        <FilterRow
          label="Todas"
          count={networkCounts.data?.reduce(
            (sum, item) => sum + item.count,
            0,
          ) ?? 0}
          active={!search.network}
          onClick={() => update({ network: undefined })}
        />
      </li>

      {NETWORKS.map((network) => {
        const item = networkCounts.data?.find(
          (n) => n.network === network,
        );

        return (
          <li key={network}>
            <FilterRow
              label={NETWORK_LABELS[network]}
              count={item?.count ?? 0}
              active={search.network === network}
              onClick={() =>
                update({
                  network:
                    search.network === network
                      ? undefined
                      : network,
                })
              }
            />
          </li>
        );
      })}
    </ul>
  )}

{hasFilters && (
  <Button
    variant="ghost"
    className="mt-3 flex w-full items-center justify-center gap-2 rounded-md bg-orange-500 px-3 py-2 text-sm font-semibold text-black transition hover:bg-orange-600"
    onClick={clear}
  >
    <X className="h-4 w-4 shrink-0" />
    <span className="whitespace-nowrap">Limpar filtros</span>
  </Button>
)}

 <h2 className="mb-3 mt-6 text-sm font-semibold uppercase tracking-wider text-orange-500">
    NFT em destaque
  </h2>
  <p className="text-center text-xs font-semibold uppercase tracking-wider text-white">
  Oferta limitada
</p>
       aquiii
      </div>

      
    </aside>
  );
}

function FilterRow({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count?: number;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex w-full items-center justify-between rounded-md px-2 py-1 text-left text-sm transition-colors ${
        active ? 'bg-primary/15 text-primary' : 'text-foreground/80 hover:bg-secondary'
      }`}
    >
      <span className="truncate">{label}</span>
      {count !== undefined && <span className="text-xs text-muted-foreground">{count}</span>}
    </button>
  );
}

export function CatalogToolbar({ search }: CatalogFiltersProps) {
  const navigate = useNavigate({ from: '/' });
  const setSort = (sort: SortOption | undefined) =>
    navigate({ search: (prev) => ({ ...prev, sort, page: 1 }), replace: true });

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div className="flex gap-6 border-b border-border">
        {[
          { id: 'all', label: 'Todos os NFTs' },
          { id: 'recent', label: 'Novos lançamentos' },
          { id: 'trending', label: 'Em alta' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() =>
              setSort(
                tab.id === 'recent' ? 'recent' : tab.id === 'trending' ? 'trending' : undefined,
              )
            }
            className={`relative pb-3 text-sm font-medium transition-colors ${
              (tab.id === 'recent' && search.sort === 'recent') ||
              (tab.id === 'trending' && search.sort === 'trending') ||
              (tab.id === 'all' && !search.sort)
                ? 'text-primary'
                : 'text-foreground/70 hover:text-foreground'
            }`}
          >
            {tab.label}
            {((tab.id === 'recent' && search.sort === 'recent') ||
              (tab.id === 'trending' && search.sort === 'trending') ||
              (tab.id === 'all' && !search.sort)) && (
              <span className="absolute -bottom-px left-0 h-[2px] w-full bg-primary" />
            )}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Ordenar por:</span>
        <Select value={search.sort ?? 'recent'} onValueChange={(v) => setSort(v as SortOption)}>
          <SelectTrigger aria-label="Ordenar por">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {SORT_LABELS[option]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export function CatalogPagination({
  search,
  total,
  pageSize,
}: {
  search: CatalogSearchParams;
  total: number;
  pageSize?: number;
}) {
  const navigate = useNavigate({ from: '/' });
  const size = pageSize ?? search.pageSize ?? DEFAULT_PAGE_SIZE;
  const totalPages = Math.max(1, Math.ceil(total / size));
  const current = Math.min(totalPages, search.page ?? 1);
  const setPage = (page: number) =>
    navigate({ search: (prev) => ({ ...prev, page }), replace: true });

  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Paginação do catálogo" className="mt-8 flex items-center justify-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        disabled={current <= 1}
        onClick={() => setPage(current - 1)}
        aria-label="Página anterior"
      >
        Anterior
      </Button>
      {Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter((p) => p === 1 || p === totalPages || Math.abs(p - current) <= 2)
        .map((p, i, arr) => (
          <span key={p} className="flex items-center gap-2">
            {i > 0 && arr[i - 1] !== p - 1 && <span className="text-muted-foreground">…</span>}
            <button
              type="button"
              onClick={() => setPage(p)}
              aria-current={p === current ? 'page' : undefined}
              className={`h-9 min-w-9 rounded-md px-3 text-sm font-semibold transition-colors ${
                p === current
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-border text-foreground/80 hover:bg-secondary'
              }`}
            >
              {p}
            </button>
          </span>
        ))}
      <Button
        variant="ghost"
        size="sm"
        disabled={current >= totalPages}
        onClick={() => setPage(current + 1)}
        aria-label="Próxima página"
      >
        Próxima
      </Button>
    </nav>
  );
}

// Helper to keep types happy with Link when used elsewhere
export const _CatalogLink = Link;
