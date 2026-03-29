import { vi } from "vitest";
import type { ReactNode } from "react";

const mockHomeData = {
  pokemon: [
    { id: 1, name: "bulbasaur", types: [{ type: { name: "grass" } }, { type: { name: "poison" } }] },
    { id: 2, name: "ivysaur", types: [{ type: { name: "grass" } }, { type: { name: "poison" } }] },
    { id: 3, name: "venusaur", types: [{ type: { name: "grass" } }, { type: { name: "poison" } }] },
  ],
  count: 3,
  nextOffset: null,
  prevOffset: null,
  currentOffset: 0,
  search: "",
  type: "",
};

const mockPokemonDetailData = {
  pokemon: {
    id: 25,
    name: "pikachu",
    height: 4,
    weight: 60,
    types: [{ type: { name: "electric" } }],
    abilities: [
      { ability: { name: "static" }, is_hidden: false, slot: 1 },
      { ability: { name: "lightning-rod" }, is_hidden: true, slot: 3 },
    ],
    stats: [
      { base_stat: 35, stat: { name: "hp", url: "" } },
      { base_stat: 55, stat: { name: "attack", url: "" } },
      { base_stat: 40, stat: { name: "defense", url: "" } },
      { base_stat: 50, stat: { name: "special-attack", url: "" } },
      { base_stat: 50, stat: { name: "special-defense", url: "" } },
      { base_stat: 90, stat: { name: "speed", url: "" } },
    ],
    sprites: { other: { "official-artwork": { front_default: "" } } } as any,
    species: { name: "pikachu", url: "" },
  },
  species: {
    base_experience: 112,
    habitat: { name: "forest" },
    evolution_chain: { url: "https://pokeapi.co/api/v2/evolution-chain/10/" },
  },
  evolutionChain: {
    chain: {
      species: { name: "pichu", url: "https://pokeapi.co/api/v2/pokemon-species/172/" },
      evolves_to: [
        {
          species: { name: "pikachu", url: "https://pokeapi.co/api/v2/pokemon-species/25/" },
          evolves_to: [
            {
              species: { name: "raichu", url: "https://pokeapi.co/api/v2/pokemon-species/26/" },
              evolves_to: [],
            },
          ],
        },
      ],
    },
  },
};

export const mockRouter = {
  useLoaderData: vi.fn((key?: any) => {
    if (key === "routes/pokemon/:name") return mockPokemonDetailData;
    return mockHomeData;
  }),
  useNavigation: () => ({ state: "idle" as const, location: null, formMethod: null, formData: null, json: null, isRedirect: false, ErrorBoundary: null, loaderData: undefined, actionData: undefined, data: undefined }),
  useRouteError: () => null,
  Link: ({ to, children, ...props }: { to: string; children: ReactNode }) => `<a href="${to}">${children}</a>`,
  NavLink: ({ to, children, ...props }: { to: string; children: ReactNode }) => `<a href="${to}">${children}</a>`,
  Outlet: () => null,
  useParams: () => ({}),
  useLocation: () => ({ pathname: "/", search: "", hash: "", state: null, key: "default" }),
  useSearchParams: () => [new URLSearchParams(), () => {}] as any,
};

export { mockHomeData, mockPokemonDetailData };
