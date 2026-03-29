import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { PokemonCard, PokemonCardSkeleton } from "./PokemonCard";

describe("PokemonCard", () => {
  const renderWithRouter = (ui: React.ReactElement) => {
    return render(<MemoryRouter>{ui}</MemoryRouter>);
  };

  it("renders pokemon name and id", () => {
    renderWithRouter(
      <PokemonCard
        pokemon={{
          name: "bulbasaur",
          url: "https://pokeapi.co/api/v2/pokemon/1/",
        }}
      />
    );

    expect(screen.getByText("bulbasaur")).toBeInTheDocument();
    expect(screen.getByText("#001")).toBeInTheDocument();
  });

  it("renders different pokemon correctly", () => {
    renderWithRouter(
      <PokemonCard
        pokemon={{
          name: "charmander",
          url: "https://pokeapi.co/api/v2/pokemon/4/",
        }}
      />
    );

    expect(screen.getByText("charmander")).toBeInTheDocument();
    expect(screen.getByText("#004")).toBeInTheDocument();
  });

  it("renders mega evolution", () => {
    renderWithRouter(
      <PokemonCard
        pokemon={{
          name: "charizard-mega-x",
          url: "https://pokeapi.co/api/v2/pokemon/10034/",
        }}
      />
    );

    expect(screen.getByText("charizard-mega-x")).toBeInTheDocument();
    expect(screen.getByText("#10034")).toBeInTheDocument();
  });

  it("has correct link to pokemon detail page", () => {
    renderWithRouter(
      <PokemonCard
        pokemon={{
          name: "pikachu",
          url: "https://pokeapi.co/api/v2/pokemon/25/",
        }}
      />
    );

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/pokemon/pikachu");
  });

  it("has accessible image", () => {
    renderWithRouter(
      <PokemonCard
        pokemon={{
          name: "charizard",
          url: "https://pokeapi.co/api/v2/pokemon/6/",
        }}
      />
    );

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("alt", "charizard");
    expect(img).toHaveAttribute("loading", "lazy");
  });

  it("has accessible link label", () => {
    renderWithRouter(
      <PokemonCard
        pokemon={{
          name: "mewtwo",
          url: "https://pokeapi.co/api/v2/pokemon/150/",
        }}
      />
    );

    expect(screen.getByLabelText(/View mewtwo details/)).toBeInTheDocument();
  });

  it("renders with different id formats", () => {
    renderWithRouter(
      <PokemonCard
        pokemon={{
          name: "test",
          url: "https://pokeapi.co/api/v2/pokemon/999/",
        }}
      />
    );

    expect(screen.getByText("#999")).toBeInTheDocument();
  });

  it("handles various pokemon names", () => {
    renderWithRouter(
      <PokemonCard
        pokemon={{
          name: "greninja",
          url: "https://pokeapi.co/api/v2/pokemon/658/",
        }}
      />
    );

    expect(screen.getByText("greninja")).toBeInTheDocument();
    expect(screen.getByText("#658")).toBeInTheDocument();
  });

  it("PokemonCardSkeleton renders loading state", () => {
    const { container } = render(<PokemonCardSkeleton />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
