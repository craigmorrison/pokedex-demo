import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// We need to test the internal cache behavior through the public API
// by controlling fetch and Date.now
const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

describe("pokemon cache", () => {
  beforeEach(async () => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("caches responses and returns cached data on second call", async () => {
    const { getPokemon } = await import("./pokemon");

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ id: 1, name: "bulbasaur" }),
    });

    const first = await getPokemon("bulbasaur");
    const second = await getPokemon("bulbasaur");

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(first).toEqual(second);
  });

  it("evicts expired cache entries", async () => {
    const originalNow = Date.now;
    let now = 1000000;
    Date.now = () => now;

    const { getPokemon } = await import("./pokemon");

    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: 1, name: "bulbasaur" }),
    });

    await getPokemon("bulbasaur");
    expect(mockFetch).toHaveBeenCalledTimes(1);

    // Advance time past TTL (1 hour)
    now += 61 * 60 * 1000;

    await getPokemon("bulbasaur");
    expect(mockFetch).toHaveBeenCalledTimes(2);

    Date.now = originalNow;
  });

  it("throws on non-ok response", async () => {
    const { getPokemon } = await import("./pokemon");

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    await expect(getPokemon("notreal")).rejects.toThrow("Failed to fetch");
  });
});
