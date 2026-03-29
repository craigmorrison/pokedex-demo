import { describe, it, expect, vi, beforeEach } from "vitest";
import { clientLoader } from "./_index";

vi.mock("~/lib/pokemon", () => ({
  getPokemonList: vi.fn(),
  getPokemonByType: vi.fn(),
  getPokemon: vi.fn(),
}));

import { getPokemonList, getPokemonByType, getPokemon } from "~/lib/pokemon";

const makeRequest = (params = "") =>
  new Request(`http://localhost/?${params}`);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("clientLoader", () => {
  it("returns paginated list when no search or type", async () => {
    vi.mocked(getPokemonList).mockResolvedValue({
      count: 100,
      next: "http://next",
      previous: null,
      results: [
        { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
      ],
    });
    vi.mocked(getPokemon).mockResolvedValue({
      id: 1, name: "bulbasaur", height: 7, weight: 69,
      types: [], abilities: [], stats: [],
      sprites: {} as any, species: { name: "bulbasaur", url: "" },
    });

    const result = await clientLoader({ request: makeRequest() });
    expect(result.pokemon).toHaveLength(1);
    expect(result.count).toBe(100);
    expect(result.nextOffset).toBe(20);
    expect(result.prevOffset).toBeNull();
    expect(result.search).toBe("");
    expect(result.type).toBe("");
  });

  it("filters by type when type param is set", async () => {
    vi.mocked(getPokemonByType).mockResolvedValue([
      { name: "charmander", url: "https://pokeapi.co/api/v2/pokemon/4/" },
    ]);
    vi.mocked(getPokemon).mockResolvedValue({
      id: 4, name: "charmander", height: 6, weight: 85,
      types: [{ slot: 1, type: { name: "fire", url: "" } }],
      abilities: [], stats: [], sprites: {} as any,
      species: { name: "charmander", url: "" },
    });

    const result = await clientLoader({ request: makeRequest("type=fire") });
    expect(getPokemonByType).toHaveBeenCalledWith("fire");
    expect(result.pokemon).toHaveLength(1);
    expect(result.type).toBe("fire");
  });

  it("filters by search when q param is set", async () => {
    vi.mocked(getPokemonList).mockResolvedValue({
      count: 2000, next: null, previous: null,
      results: [
        { name: "bulbasaur", url: "" },
        { name: "charmander", url: "" },
        { name: "charmeleon", url: "" },
      ],
    });
    vi.mocked(getPokemon).mockResolvedValue({
      id: 4, name: "charmander", height: 6, weight: 85,
      types: [], abilities: [], stats: [],
      sprites: {} as any, species: { name: "charmander", url: "" },
    });

    const result = await clientLoader({ request: makeRequest("q=char") });
    expect(result.pokemon).toHaveLength(2);
    expect(result.search).toBe("char");
    expect(result.count).toBe(2);
  });

  it("handles invalid offset gracefully", async () => {
    vi.mocked(getPokemonList).mockResolvedValue({
      count: 10, next: null, previous: null,
      results: [{ name: "bulbasaur", url: "" }],
    });
    vi.mocked(getPokemon).mockResolvedValue({
      id: 1, name: "bulbasaur", height: 7, weight: 69,
      types: [], abilities: [], stats: [],
      sprites: {} as any, species: { name: "bulbasaur", url: "" },
    });

    const result = await clientLoader({ request: makeRequest("offset=abc") });
    expect(result.currentOffset).toBe(0);
  });

  it("handles negative offset gracefully", async () => {
    vi.mocked(getPokemonList).mockResolvedValue({
      count: 10, next: null, previous: null,
      results: [{ name: "bulbasaur", url: "" }],
    });
    vi.mocked(getPokemon).mockResolvedValue({
      id: 1, name: "bulbasaur", height: 7, weight: 69,
      types: [], abilities: [], stats: [],
      sprites: {} as any, species: { name: "bulbasaur", url: "" },
    });

    const result = await clientLoader({ request: makeRequest("offset=-10") });
    expect(result.currentOffset).toBe(0);
  });

  it("returns fallback data when individual getPokemon fails", async () => {
    vi.mocked(getPokemonList).mockResolvedValue({
      count: 10, next: null, previous: null,
      results: [{ name: "missingno", url: "https://pokeapi.co/api/v2/pokemon/0/" }],
    });
    vi.mocked(getPokemon).mockRejectedValue(new Error("Not found"));

    const result = await clientLoader({ request: makeRequest() });
    expect(result.pokemon).toHaveLength(1);
    expect(result.pokemon[0].name).toBe("missingno");
    expect(result.pokemon[0].id).toBe(0);
  });

  it("throws 500 when list fetch fails completely", async () => {
    vi.mocked(getPokemonList).mockRejectedValue(new Error("Network error"));

    await expect(clientLoader({ request: makeRequest() })).rejects.toBeInstanceOf(Response);
  });

  it("calculates prevOffset correctly", async () => {
    vi.mocked(getPokemonList).mockResolvedValue({
      count: 100, next: "http://next", previous: "http://prev",
      results: [{ name: "bulbasaur", url: "" }],
    });
    vi.mocked(getPokemon).mockResolvedValue({
      id: 1, name: "bulbasaur", height: 7, weight: 69,
      types: [], abilities: [], stats: [],
      sprites: {} as any, species: { name: "bulbasaur", url: "" },
    });

    const result = await clientLoader({ request: makeRequest("offset=40") });
    expect(result.prevOffset).toBe(20);
    expect(result.currentOffset).toBe(40);
  });
});
