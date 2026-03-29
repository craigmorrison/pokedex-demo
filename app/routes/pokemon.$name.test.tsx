import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import * as reactRouter from "react-router";
import PokemonDetail from "./pokemon.$name";

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useLoaderData: vi.fn(),
  };
});

const mockDetailData = {
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

beforeEach(() => {
  vi.mocked(reactRouter.useLoaderData).mockReturnValue(mockDetailData);
});

const renderDetail = () =>
  render(
    <MemoryRouter>
      <PokemonDetail />
    </MemoryRouter>
  );

describe("PokemonDetail", () => {
  it("renders pokemon name and formatted ID", () => {
    renderDetail();
    expect(screen.getByRole("heading", { name: "pikachu" })).toBeInTheDocument();
    expect(screen.getByText("#025")).toBeInTheDocument();
  });

  it("renders type badges", () => {
    renderDetail();
    expect(screen.getByText("electric")).toBeInTheDocument();
  });

  it("renders stats section", () => {
    renderDetail();
    expect(screen.getByText("Base Stats")).toBeInTheDocument();
  });

  it("renders profile info with correct units", () => {
    renderDetail();
    expect(screen.getByText("0.4 m")).toBeInTheDocument(); // height: 4/10
    expect(screen.getByText("6 kg")).toBeInTheDocument(); // weight: 60/10
    expect(screen.getByText("112")).toBeInTheDocument(); // base experience
    expect(screen.getByText("forest")).toBeInTheDocument(); // habitat
  });

  it("renders abilities with hidden marker", () => {
    renderDetail();
    expect(screen.getByText(/^static$/)).toBeInTheDocument();
    expect(screen.getByText(/lightning rod \(hidden\)/i)).toBeInTheDocument();
  });

  it("renders evolution chain with 3 evolutions", () => {
    renderDetail();
    expect(screen.getByText("Evolution Chain")).toBeInTheDocument();
    expect(screen.getByText("pichu")).toBeInTheDocument();
    expect(screen.getByText("raichu")).toBeInTheDocument();
  });

  it("renders back link to home", () => {
    renderDetail();
    const backLink = screen.getByText(/Back to Pokédex/);
    expect(backLink.closest("a")).toHaveAttribute("href", "/");
  });

  it("does not render evolution section for single-stage pokemon", () => {
    vi.mocked(reactRouter.useLoaderData).mockReturnValue({
      ...mockDetailData,
      evolutionChain: {
        chain: {
          species: { name: "pikachu", url: "https://pokeapi.co/api/v2/pokemon-species/25/" },
          evolves_to: [],
        },
      },
    });
    renderDetail();
    expect(screen.queryByText("Evolution Chain")).not.toBeInTheDocument();
  });

  it("shows N/A when base experience is missing", () => {
    vi.mocked(reactRouter.useLoaderData).mockReturnValue({
      ...mockDetailData,
      species: { ...mockDetailData.species, base_experience: null },
    });
    renderDetail();
    expect(screen.getByText("N/A")).toBeInTheDocument();
  });

  it("shows Unknown when habitat is missing", () => {
    vi.mocked(reactRouter.useLoaderData).mockReturnValue({
      ...mockDetailData,
      species: { ...mockDetailData.species, habitat: null },
    });
    renderDetail();
    expect(screen.getByText("Unknown")).toBeInTheDocument();
  });
});
