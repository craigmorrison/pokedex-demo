import { vi, describe, it, expect } from "vitest";
import { getPokemonId, getPokemonImage } from "./pokemon";

describe("pokemon utils", () => {
  describe("getPokemonId", () => {
    it("extracts id from url", () => {
      expect(getPokemonId("https://pokeapi.co/api/v2/pokemon/25/")).toBe(25);
      expect(getPokemonId("https://pokeapi.co/api/v2/pokemon/1/")).toBe(1);
      expect(getPokemonId("https://pokeapi.co/api/v2/pokemon/150/")).toBe(150);
    });

    it("handles urls without trailing slash", () => {
      expect(getPokemonId("https://pokeapi.co/api/v2/pokemon/42")).toBe(42);
    });

    it("handles various id formats", () => {
      expect(getPokemonId("https://pokeapi.co/api/v2/pokemon/0/")).toBe(0);
      expect(getPokemonId("https://pokeapi.co/api/v2/pokemon/9999/")).toBe(9999);
      expect(getPokemonId("pokemon/1/")).toBe(1);
    });

    it("handles edge cases", () => {
      expect(getPokemonId("")).toBe(NaN);
      expect(getPokemonId("/")).toBe(NaN);
    });
  });

  describe("getPokemonImage", () => {
    it("returns correct image URL for number id", () => {
      expect(getPokemonImage(25)).toBe(
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
      );
    });

    it("returns correct image URL for string id", () => {
      expect(getPokemonImage("150")).toBe(
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png"
      );
    });

    it("handles edge cases", () => {
      expect(getPokemonImage(0)).toContain("/0.png");
      expect(getPokemonImage("9999")).toContain("/9999.png");
      expect(getPokemonImage(-1)).toContain("/-1.png");
    });
  });
});
