import { vi } from "vitest";
import type { ReactNode } from "react";

export const createMockRouter = (overrides = {}) => {
  return {
    basename: "/",
    navigator: {
      get basename() {
        return "/";
      },
      get href() {
        return "/";
      },
      get pathname() {
        return "/";
      },
      get search() {
        return "";
      },
      get hash() {
        return "";
      },
      get state() {
        return null;
      },
      get key() {
        return "default";
      },
      toJSON: () => ({}),
      ...overrides.navigator,
    },
    staticNavigator: true,
    ...overrides,
  };
};

export const mockUseLoaderData = <T>(data: T) => {
  vi.mock("react-router", async () => {
    const actual = await vi.importActual("react-router");
    return {
      ...actual,
      useLoaderData: () => data,
      useNavigation: () => ({ state: "idle", location: null, formMethod: null, formData: null }),
      useRouteError: () => null,
      Link: ({ to, children, prefetch, ...props }: { to: string; children: ReactNode; prefetch?: string }) => 
        `<a href="${to}" ${props.className ? `class="${props.className}"` : ""}>${children}</a>`,
      NavLink: ({ to, children, ...props }: { to: string; children: ReactNode }) => 
        `<a href="${to}">${children}</a>`,
    };
  });
};

export const mockLoaderData = {
  home: {
    pokemon: [
      { id: 1, name: "bulbasaur", types: [{ type: { name: "grass" } }, { type: { name: "poison" } }] },
      { id: 2, name: "ivysaur", types: [{ type: { name: "grass" } }, { type: { name: "poison" } }] },
    ],
    count: 2,
    nextOffset: null,
    prevOffset: null,
    currentOffset: 0,
    search: "",
    type: "",
  },
  pokemonDetail: {
    pokemon: {
      id: 1,
      name: "bulbasaur",
      height: 7,
      weight: 69,
      types: [{ type: { name: "grass" } }, { type: { name: "poison" } }],
      abilities: [{ ability: { name: "overgrow" }, is_hidden: false, slot: 1 }],
      stats: [
        { base_stat: 45, stat: { name: "hp", url: "" } },
        { base_stat: 49, stat: { name: "attack", url: "" } },
      ],
      sprites: { other: { "official-artwork": { front_default: "" } } } as any,
      species: { name: "bulbasaur", url: "" },
    },
    species: {
      base_experience: 64,
      habitat: { name: "grassland" },
      evolution_chain: { url: "https://pokeapi.co/api/v2/evolution-chain/1/" },
    },
    evolutionChain: {
      chain: {
        species: { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon-species/1/" },
        evolves_to: [],
      },
    },
  },
};
