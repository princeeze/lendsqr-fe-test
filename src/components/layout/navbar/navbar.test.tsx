import { render, screen } from "@testing-library/react";
import NavBar from "./navbar";
import "@testing-library/jest-dom";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("NavBar", () => {
  test("renders logo and menu items", () => {
    render(<NavBar />);
    expect(screen.getByAltText("Lendsqr Logo")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
    expect(screen.getByText("Docs")).toBeInTheDocument();
    expect(screen.getByAltText("Notifications")).toBeInTheDocument();
    expect(screen.getByText("Adediji")).toBeInTheDocument();
  });
});
