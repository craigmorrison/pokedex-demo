const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour — Pokemon data is immutable
const CACHE_MAX_SIZE = 500;

function getCached<T>(key: string): T | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T;
  }
  cache.delete(key);
  return null;
}

function setCached<T>(key: string, data: T): void {
  if (cache.size >= CACHE_MAX_SIZE) {
    const oldestKey = cache.keys().next().value!;
    cache.delete(oldestKey);
  }
  cache.set(key, { data, timestamp: Date.now() });
}

async function fetchWithCache<T>(url: string): Promise<T> {
  const cached = getCached<T>(url);
  if (cached) return cached;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${url}`);
  }
  const data = await response.json();
  setCached(url, data);
  return data;
}

export const POKEAPI_BASE = "https://pokeapi.co/api/v2";

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonAbility {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

export interface PokemonStat {
  base_stat: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface PokemonSprites {
  front_default: string;
  back_default: string;
  front_shiny: string;
  back_shiny: string;
  other: {
    "official-artwork": {
      front_default: string;
      front_shiny?: string;
    };
    "home": {
      front_default: string;
      front_shiny: string;
    };
    dream_world: {
      front_default: string;
    };
  };
}

export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: PokemonType[];
  abilities: PokemonAbility[];
  stats: PokemonStat[];
  sprites: PokemonSprites;
  species: {
    name: string;
    url: string;
  };
}

export interface EvolutionChain {
  chain: {
    species: {
      name: string;
      url: string;
    };
    evolves_to: EvolutionChain[];
  };
}

export async function getPokemonList(offset = 0, limit = 20): Promise<PokemonListResponse> {
  return fetchWithCache<PokemonListResponse>(`${POKEAPI_BASE}/pokemon?offset=${offset}&limit=${limit}`);
}

export async function getPokemonByType(type: string): Promise<PokemonListItem[]> {
  const data = await fetchWithCache<{ pokemon: { pokemon: PokemonListItem }[] }>(`${POKEAPI_BASE}/type/${type.toLowerCase()}`);
  return data.pokemon.map((p) => p.pokemon);
}

export async function getPokemon(name: string): Promise<Pokemon> {
  return fetchWithCache<Pokemon>(`${POKEAPI_BASE}/pokemon/${name.toLowerCase()}`);
}

export async function getEvolutionChain(url: string): Promise<EvolutionChain> {
  return fetchWithCache<EvolutionChain>(url);
}

export async function getPokemonSpecies(name: string) {
  return fetchWithCache(`${POKEAPI_BASE}/pokemon-species/${name.toLowerCase()}`);
}

export function getPokemonId(url: string): number {
  const parts = url.split("/").filter(Boolean);
  return parseInt(parts[parts.length - 1], 10);
}

export function getPokemonImage(id: number | string): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}
