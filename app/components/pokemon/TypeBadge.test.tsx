import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { TypeBadge, TypeList } from "./TypeBadge";

describe("TypeBadge", () => {
  it("renders type name", () => {
    render(<TypeBadge type="fire" />);
    expect(screen.getByText("fire")).toBeInTheDocument();
  });

  it("renders different types correctly", () => {
    render(<TypeBadge type="water" />);
    expect(screen.getByText("water")).toBeInTheDocument();
  });

  it("renders TypeList with multiple types", () => {
    render(<TypeList types={["water", "flying"]} />);
    expect(screen.getByText("water")).toBeInTheDocument();
    expect(screen.getByText("flying")).toBeInTheDocument();
  });

  it("renders single type in TypeList", () => {
    render(<TypeList types={["grass"]} />);
    expect(screen.getByText("grass")).toBeInTheDocument();
  });

  it("handles all pokemon types", () => {
    const allTypes = [
      "normal", "fire", "water", "electric", "grass", "ice",
      "fighting", "poison", "ground", "flying", "psychic", "bug",
      "rock", "ghost", "dragon", "dark", "steel", "fairy"
    ];

    allTypes.forEach((type) => {
      const { container } = render(<TypeBadge type={type} />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  it("handles empty types array", () => {
    const { container } = render(<TypeList types={[]} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
