import { describe, it, expect, vi, beforeEach } from "vitest";
import { clientLoader } from "./pokemon.$name";

vi.mock("~/lib/pokemon", () => ({
  getPokemon: vi.fn(),
  getPokemonSpecies: vi.fn(),
  getEvolutionChain: vi.fn(),
  getPokemonImage: vi.fn((id: number) => `https://img/${id}.png`),
}));

import { getPokemon, getPokemonSpecies, getEvolutionChain } from "~/lib/pokemon";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("pokemon detail clientLoader", () => {
  it("returns pokemon, species, and evolution data", async () => {
    const mockPokemon = { id: 25, name: "pikachu" };
    const mockSpecies = {
      base_experience: 112,
      habitat: { name: "forest" },
      evolution_chain: { url: "https://pokeapi.co/api/v2/evolution-chain/10/" },
    };
    const mockChain = { chain: { species: { name: "pichu", url: "" }, evolves_to: [] } };

    vi.mocked(getPokemon).mockResolvedValue(mockPokemon as any);
    vi.mocked(getPokemonSpecies).mockResolvedValue(mockSpecies);
    vi.mocked(getEvolutionChain).mockResolvedValue(mockChain as any);

    const result = await clientLoader({ params: { name: "pikachu" } });
    expect(result.pokemon).toEqual(mockPokemon);
    expect(result.species).toEqual(mockSpecies);
    expect(result.evolutionChain).toEqual(mockChain);
    expect(getPokemon).toHaveBeenCalledWith("pikachu");
  });

  it("throws 404 when name param is missing", async () => {
    await expect(clientLoader({ params: {} })).rejects.toBeInstanceOf(Response);
    try {
      await clientLoader({ params: {} });
    } catch (e) {
      expect((e as Response).status).toBe(404);
    }
  });

  it("throws 500 when API call fails", async () => {
    vi.mocked(getPokemon).mockRejectedValue(new Error("API down"));

    await expect(clientLoader({ params: { name: "pikachu" } })).rejects.toBeInstanceOf(Response);
    try {
      await clientLoader({ params: { name: "pikachu" } });
    } catch (e) {
      expect((e as Response).status).toBe(500);
    }
  });
});
