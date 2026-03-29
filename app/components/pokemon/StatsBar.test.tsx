import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatsBar } from "./StatsBar";
import type { PokemonStat } from "~/lib/pokemon";

describe("StatsBar", () => {
  const mockStats: PokemonStat[] = [
    { base_stat: 80, stat: { name: "hp", url: "" } },
    { base_stat: 82, stat: { name: "attack", url: "" } },
    { base_stat: 83, stat: { name: "defense", url: "" } },
    { base_stat: 100, stat: { name: "special-attack", url: "" } },
    { base_stat: 100, stat: { name: "special-defense", url: "" } },
    { base_stat: 85, stat: { name: "speed", url: "" } },
  ];

  it("renders all stat names", () => {
    render(<StatsBar stats={mockStats} />);

    expect(screen.getByText("HP")).toBeInTheDocument();
    expect(screen.getByText("ATK")).toBeInTheDocument();
    expect(screen.getByText("DEF")).toBeInTheDocument();
    expect(screen.getByText("SP. ATK")).toBeInTheDocument();
    expect(screen.getByText("SP. DEF")).toBeInTheDocument();
    expect(screen.getByText("SPD")).toBeInTheDocument();
  });

  it("renders stat values", () => {
    render(<StatsBar stats={mockStats} />);

    expect(screen.getAllByText("80")).toHaveLength(1);
    expect(screen.getByText("82")).toBeInTheDocument();
    expect(screen.getAllByText("100")).toHaveLength(2);
    expect(screen.getByText("85")).toBeInTheDocument();
  });

  it("renders correct number of stat rows", () => {
    const { container } = render(<StatsBar stats={mockStats} />);
    const statRows = container.querySelectorAll("[class*='statRow']");
    expect(statRows).toHaveLength(6);
  });

  it("handles minimum stat values", () => {
    const minStats: PokemonStat[] = [
      { base_stat: 1, stat: { name: "hp", url: "" } },
    ];
    render(<StatsBar stats={minStats} />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("HP")).toBeInTheDocument();
  });

  it("handles maximum stat values", () => {
    const maxStats: PokemonStat[] = [
      { base_stat: 255, stat: { name: "hp", url: "" } },
    ];
    render(<StatsBar stats={maxStats} />);
    expect(screen.getByText("255")).toBeInTheDocument();
  });

  it("handles unknown stat names", () => {
    const unknownStats: PokemonStat[] = [
      { base_stat: 50, stat: { name: "unknown-stat", url: "" } },
    ];
    render(<StatsBar stats={unknownStats} />);
    expect(screen.getByText("unknown-stat")).toBeInTheDocument();
  });

  it("handles empty stats array", () => {
    const { container } = render(<StatsBar stats={[]} />);
    const statRows = container.querySelectorAll("[class*='statRow']");
    expect(statRows).toHaveLength(0);
  });
});
