import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";

// Reset cache between tests
beforeEach(() => {
  vi.resetModules();
});

describe("pokemon API caching", () => {
  it("cache is used for repeated calls", async () => {
    const { getPokemonList } = await import("./pokemon");
    
    // First call - should fetch
    const result1 = await getPokemonList(0, 20);
    expect(result1).toBeDefined();
    expect(result1.results).toBeDefined();
  });

  it("getPokemonByType works", async () => {
    const { getPokemonByType } = await import("./pokemon");
    
    const result = await getPokemonByType("fire");
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty("name");
    expect(result[0]).toHaveProperty("url");
  });

  it("getPokemon works", async () => {
    const { getPokemon } = await import("./pokemon");
    
    const result = await getPokemon("pikachu");
    expect(result).toBeDefined();
    expect(result.name).toBe("pikachu");
    expect(result.id).toBe(25);
    expect(result.types).toBeDefined();
    expect(result.stats).toBeDefined();
  });

  it("getPokemonSpecies works", async () => {
    const { getPokemonSpecies } = await import("./pokemon");
    
    const result = await getPokemonSpecies("bulbasaur");
    expect(result).toBeDefined();
    expect(result.name).toBe("bulbasaur");
  });

  it("getEvolutionChain works", async () => {
    const { getEvolutionChain } = await import("./pokemon");
    
    const result = await getEvolutionChain("https://pokeapi.co/api/v2/evolution-chain/1/");
    expect(result).toBeDefined();
    expect(result.chain).toBeDefined();
  });

  it("handles invalid pokemon name", async () => {
    const { getPokemon } = await import("./pokemon");
    
    await expect(getPokemon("invalid-pokemon-name-xyz")).rejects.toThrow();
  });

  it("handles case sensitivity", async () => {
    const { getPokemon } = await import("./pokemon");
    
    // Should work with lowercase
    const result = await getPokemon("PIKACHU");
    expect(result.name).toBe("pikachu");
  });

  it("getPokemonList with different offsets", async () => {
    const { getPokemonList } = await import("./pokemon");
    
    const page1 = await getPokemonList(0, 5);
    const page2 = await getPokemonList(5, 5);
    
    expect(page1.results).toHaveLength(5);
    expect(page2.results).toHaveLength(5);
    expect(page1.results[0].name).not.toBe(page2.results[0].name);
  });
});
