import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { Layout, ErrorBoundary } from "./root";

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    Meta: () => null,
    Links: () => null,
    Scripts: () => null,
    ScrollRestoration: () => null,
  };
});

describe("Layout", () => {
  it("renders children", () => {
    render(
      <MemoryRouter>
        <Layout>
          <div>Test Content</div>
        </Layout>
      </MemoryRouter>
    );
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("renders header with Pokedex link", () => {
    render(
      <MemoryRouter>
        <Layout>
          <div />
        </Layout>
      </MemoryRouter>
    );
    const link = screen.getByText("Pokédex");
    expect(link.closest("a")).toHaveAttribute("href", "/");
  });

  it("renders Home nav link", () => {
    render(
      <MemoryRouter>
        <Layout>
          <div />
        </Layout>
      </MemoryRouter>
    );
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("renders footer with PokeAPI attribution", () => {
    render(
      <MemoryRouter>
        <Layout>
          <div />
        </Layout>
      </MemoryRouter>
    );
    expect(screen.getByText("PokéAPI")).toBeInTheDocument();
  });
});

describe("ErrorBoundary", () => {
  it("displays error message from Error instance", () => {
    render(
      <MemoryRouter>
        <ErrorBoundary error={new Error("Something broke")} />
      </MemoryRouter>
    );
    expect(screen.getByText("Something broke")).toBeInTheDocument();
    expect(screen.getByText("Oops! Something went wrong")).toBeInTheDocument();
  });

  it("displays fallback message for non-Error values", () => {
    render(
      <MemoryRouter>
        <ErrorBoundary error="string error" />
      </MemoryRouter>
    );
    expect(screen.getByText("An unexpected error occurred")).toBeInTheDocument();
  });

  it("has Back to Home link", () => {
    render(
      <MemoryRouter>
        <ErrorBoundary error={new Error("test")} />
      </MemoryRouter>
    );
    const link = screen.getByText("Back to Home");
    expect(link.closest("a")).toHaveAttribute("href", "/");
  });
});
