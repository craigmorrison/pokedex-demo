import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import * as reactRouter from "react-router";
import Home from "./_index";

const mockSetSearchParams = vi.fn();

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useLoaderData: vi.fn(),
    useNavigation: vi.fn(),
    useSearchParams: () => [new URLSearchParams(), mockSetSearchParams],
  };
});

const mockData = {
  pokemon: [
    { id: 1, name: "bulbasaur", types: [{ type: { name: "grass" } }] },
    { id: 4, name: "charmander", types: [{ type: { name: "fire" } }] },
    { id: 7, name: "squirtle", types: [{ type: { name: "water" } }] },
  ],
  count: 100,
  nextOffset: 20,
  prevOffset: null,
  currentOffset: 0,
  search: "",
  type: "",
};

beforeEach(() => {
  vi.mocked(reactRouter.useLoaderData).mockReturnValue(mockData);
  vi.mocked(reactRouter.useNavigation).mockReturnValue({
    state: "idle",
    location: undefined,
    formMethod: undefined,
    formAction: undefined,
    formEncType: undefined,
    formData: undefined,
    json: undefined,
    text: undefined,
  } as any);
});

const renderHome = () =>
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );

describe("Home", () => {
  it("renders pokemon cards for each pokemon", () => {
    renderHome();
    expect(screen.getByText("bulbasaur")).toBeInTheDocument();
    expect(screen.getByText("charmander")).toBeInTheDocument();
    expect(screen.getByText("squirtle")).toBeInTheDocument();
  });

  it("renders search input", () => {
    renderHome();
    expect(screen.getByPlaceholderText("Search Pokemon...")).toBeInTheDocument();
  });

  it("renders all 18 type filter buttons plus All", () => {
    renderHome();
    expect(screen.getByText("All")).toBeInTheDocument();
    expect(screen.getByText("fire")).toBeInTheDocument();
    expect(screen.getByText("water")).toBeInTheDocument();
    expect(screen.getByText("grass")).toBeInTheDocument();
    expect(screen.getByText("fairy")).toBeInTheDocument();
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(19); // 18 types + All
  });

  it("shows Next button when nextOffset exists", () => {
    renderHome();
    expect(screen.getByText("Next")).toBeInTheDocument();
    expect(screen.queryByText("Previous")).not.toBeInTheDocument();
  });

  it("shows Previous button when prevOffset exists", () => {
    vi.mocked(reactRouter.useLoaderData).mockReturnValue({
      ...mockData,
      prevOffset: 0,
      currentOffset: 20,
      nextOffset: 40,
    });
    renderHome();
    expect(screen.getByText("Previous")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
  });

  it("shows page info text", () => {
    renderHome();
    expect(screen.getByText("Showing 1-3 of 100")).toBeInTheDocument();
  });

  it("shows empty state when no pokemon", () => {
    vi.mocked(reactRouter.useLoaderData).mockReturnValue({
      ...mockData,
      pokemon: [],
      count: 0,
      nextOffset: null,
    });
    renderHome();
    expect(screen.getByText("No Pokemon found")).toBeInTheDocument();
    expect(screen.getByText("Try adjusting your search or filters")).toBeInTheDocument();
  });

  it("shows loading skeletons when navigating", () => {
    vi.mocked(reactRouter.useNavigation).mockReturnValue({
      state: "loading",
      location: undefined,
      formMethod: undefined,
      formAction: undefined,
      formEncType: undefined,
      formData: undefined,
      json: undefined,
      text: undefined,
    } as any);
    renderHome();
    // When loading, the actual pokemon names should not appear
    expect(screen.queryByText("bulbasaur")).not.toBeInTheDocument();
  });

  it("hides pagination when no offsets", () => {
    vi.mocked(reactRouter.useLoaderData).mockReturnValue({
      ...mockData,
      nextOffset: null,
      prevOffset: null,
    });
    renderHome();
    expect(screen.queryByText("Next")).not.toBeInTheDocument();
    expect(screen.queryByText("Previous")).not.toBeInTheDocument();
  });

  it("updates search input on typing", async () => {
    const user = userEvent.setup();
    renderHome();
    const input = screen.getByPlaceholderText("Search Pokemon...");
    await user.clear(input);
    await user.type(input, "char");
    expect(input).toHaveValue("char");
  });

  it("initializes search input from loader data", () => {
    vi.mocked(reactRouter.useLoaderData).mockReturnValue({
      ...mockData,
      search: "bulba",
    });
    renderHome();
    expect(screen.getByPlaceholderText("Search Pokemon...")).toHaveValue("bulba");
  });

  it("highlights active type filter", () => {
    vi.mocked(reactRouter.useLoaderData).mockReturnValue({
      ...mockData,
      type: "fire",
    });
    renderHome();
    const fireButton = screen.getByText("fire");
    expect(fireButton).toHaveStyle({ opacity: "1" });
  });

  it("calls setSearchParams on type filter click", async () => {
    const user = userEvent.setup();
    renderHome();
    await user.click(screen.getByText("fire"));
    expect(mockSetSearchParams).toHaveBeenCalled();
  });

  it("calls setSearchParams on search submit", async () => {
    const user = userEvent.setup();
    renderHome();
    const input = screen.getByPlaceholderText("Search Pokemon...");
    await user.type(input, "pika{enter}");
    expect(mockSetSearchParams).toHaveBeenCalled();
  });

  it("type filter buttons have aria-pressed", () => {
    vi.mocked(reactRouter.useLoaderData).mockReturnValue({
      ...mockData,
      type: "water",
    });
    renderHome();
    expect(screen.getByText("water")).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("fire")).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByText("All")).toHaveAttribute("aria-pressed", "false");
  });

  it("loading grid has aria-busy", () => {
    vi.mocked(reactRouter.useNavigation).mockReturnValue({
      state: "loading",
      location: undefined,
      formMethod: undefined,
      formAction: undefined,
      formEncType: undefined,
      formData: undefined,
      json: undefined,
      text: undefined,
    } as any);
    renderHome();
    expect(screen.getByLabelText("Loading Pokemon")).toHaveAttribute("aria-busy", "true");
  });
});
