import { createFileRoute } from '@tanstack/react-router';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  CatalogFilters,
  CatalogPagination,
  CatalogToolbar,
} from '@/components/catalog/catalog-filters';
import { NftCard } from '@/components/nft/nft-card';

import { useNftList } from '@/hooks/use-nfts';
import { buildListQuery, catalogSearchSchema } from '@/api/search-params';


export const Route = createFileRoute('/')({
  validateSearch: catalogSearchSchema,
  component: HomePage,
});

function HomePage() {
  const search = Route.useSearch();
  const listQuery = buildListQuery(search);
  const { data, isLoading, isError, isFetching } = useNftList(listQuery);

  return (
    <>
      {/* HERO */}
      <section className="container pt-0 pb-8">
        <div className="overflow-hidden rounded-md border border-[#4a2a17] bg-[#130905] px-6 py-8 lg:px-10">
          <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#b98555]">
                Bem-vindo à Kurio
              </p>

              <h1 className="mt-4 font-display text-4xl font-black uppercase leading-[1.05] tracking-wide text-white lg:text-5xl">
                Seja dono do futuro
                <br />
                da arte digital
              </h1>

              <p className="mt-5 max-w-md text-sm leading-6 text-[#b8a89b]">
                Descubra NFTs selecionados de criadores emergentes e consagrados.
                Colecione arte digital rara, apoie artistas e tenha sua parte da
                cultura da internet.
              </p>

              <div className="mt-7">
                <Button
                  variant="primary"
                  className="bg-[#b56a33] px-6 hover:bg-[#c7773c]"
                  onClick={() => {
                    document
                      .getElementById('catalog')
                      ?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Explorar
                </Button>
              </div>

              <div className="mt-8 flex gap-2">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className={`rounded-full ${
                      i === 0
                        ? 'h-1.5 w-6 bg-[#b56a33]'
                        : 'h-1.5 w-1.5 bg-[#6b4a35]'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="aspect-square w-full max-w-[330px] overflow-hidden rounded-2xl bg-[#efe8d5]">
                <img
  src="/images/nfts/emerald-ape.png"
  alt="Emerald Ape NFT"
  className="h-full w-full object-cover"
/>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATÁLOGO */}
      <section id="catalog" className="container pb-10">
        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          <CatalogFilters search={search} />

          <div>
            <CatalogToolbar search={search} />

            {isLoading && <CatalogSkeleton />}

            {isError && (
              <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-8 text-center">
                <p className="font-display text-lg">
                  Não foi possível carregar o catálogo.
                </p>
              </div>
            )}

            {data && data.data.length === 0 && !isLoading && (
              <div className="rounded-xl border border-border bg-card/40 p-12 text-center">
                <p className="font-display text-lg">
                  Nenhum NFT encontrado.
                </p>
              </div>
            )}

            {data && data.data.length > 0 && (
              <>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {data.data.map((nft) => (
                    <NftCard key={nft.id} nft={nft} />
                  ))}
                </div>

                <CatalogPagination
                  search={search}
                  total={data.meta.total}
                  pageSize={data.meta.pageSize}
                />

                <p className="mt-4 text-center text-xs text-muted-foreground">
                  Mostrando {data.data.length} de {data.meta.total} NFTs
                  {isFetching && !isLoading && " · atualizando..."}
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* DESTAQUE */}
      <section className="container pb-16">
        <div className="mb-5">
          <h2 className="font-display text-xl font-black uppercase text-[#d18b4d]">
            NFT em destaque
          </h2>

          <p className="mt-1 text-sm text-[#d7c0a9]">
            Oferta limitada
          </p>
        </div>

        <FeaturedRow />
      </section>
    </>
  );
}

function CatalogSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-border bg-card/80">
          <Skeleton className="aspect-square w-full rounded-none" />
          <div className="space-y-2 p-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

function FeaturedRow() {
  const { data, isLoading } = useNftList({ sort: 'trending', pageSize: 4 });
  if (isLoading || !data) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square w-full rounded-2xl" />
        ))}
      </div>
    );
  }
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {data.data.map((nft) => (
        <NftCard key={nft.id} nft={nft} compact />
      ))}
    </div>
  );
}