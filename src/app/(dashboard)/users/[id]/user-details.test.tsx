import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserDetailsPage, { UserDetails } from "./page";
import { useQuery } from "@tanstack/react-query";

const params = Promise.resolve({ id: "1" });
// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock the @tanstack/react-query module
jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
}));

// Mock data with proper typing
const mockUserData: UserDetails = {
  id: 1,
  fullName: "John Doe",
  userId: "JD123",
  tier: 2,
  balance: "₦100,000.00",
  bankName: "Bank of Africa",
  phoneNumber: "+1234567890",
  email: "john.doe@example.com",
  bvn: "1234567890",
  gender: "Male",
  maritalStatus: "Single",
  children: "None",
  typeOfResidence: "Apartment",
  education: {
    level: "Bachelor's Degree",
    employmentStatus: "Employed",
    sector: "Technology",
    duration: "2 years",
    officeEmail: "john.doe@company.com",
    monthlyIncome: "₦500,000.00",
    loanRepayment: "₦50,000.00",
  },
  socials: {
    twitter: "@johndoe",
    facebook: "johndoe",
    instagram: "johndoe",
  },
  guarantor: [
    {
      fullName: "Jane Smith",
      phoneNumber: "+0987654321",
      email: "jane.smith@example.com",
      relationship: "Friend",
    },
  ],
};

describe("UserDetailsPage", () => {
  // POSITIVE SCENARIOS
  test("should render loading state when data is being fetched", () => {
    // Mock the useQuery hook to simulate loading state
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    render(<UserDetailsPage params={params} />);

    // Check if loading skeleton is rendered
    expect(screen.getByTestId("loading-skeleton")).toBeInTheDocument();
  });

  test("should render user details when data is fetched successfully", async () => {
    // Mock the useQuery hook to return successful data
    (useQuery as jest.Mock).mockReturnValue({
      data: mockUserData,
      isLoading: false,
    });

    render(<UserDetailsPage params={params} />);

    // Wait for the component to update
    await waitFor(() => {
      // Check if user details are rendered
      expect(screen.getByText("JD123")).toBeInTheDocument();
      expect(screen.getByText("₦100,000.00")).toBeInTheDocument();
      expect(screen.getByText("Bank of Africa")).toBeInTheDocument();
    });

    // Check if personal information section is rendered
    expect(screen.getByText("Personal Information")).toBeInTheDocument();
    expect(screen.getByText("+1234567890")).toBeInTheDocument();
  });

  test("should change active tab when tab is clicked", async () => {
    // Mock the useQuery hook to return data
    (useQuery as jest.Mock).mockReturnValue({
      data: mockUserData,
      isLoading: false,
    });

    render(<UserDetailsPage params={params} />);

    // Initially, General Details should be the active tab
    const generalDetailsTab = screen.getByText("General Details");
    expect(generalDetailsTab).toHaveClass("activeTab");

    // Click on the Documents tab
    fireEvent.click(screen.getByText("Documents"));

    // Now Documents should be the active tab
    await waitFor(() => {
      expect(screen.getByText("Documents")).toHaveClass("activeTab");
      expect(generalDetailsTab.parentElement).not.toHaveClass("activeTab");
    });
  });

  test("should render user stars based on tier", () => {
    // Mock the useQuery hook to return data with tier 2
    (useQuery as jest.Mock).mockReturnValue({
      data: mockUserData, // tier: 2
      isLoading: false,
    });

    render(<UserDetailsPage params={params} />);

    // Get all star icons (assuming they have a test id or can be selected somehow)
    const stars = screen.getAllByTestId
      ? screen.getAllByTestId(/star/)
      : screen.getAllByText("star");
    expect(stars).toHaveLength(3);
  });

  // NEGATIVE SCENARIOS
  test("should handle empty user data gracefully", async () => {
    // Mock the useQuery hook to return null/undefined data
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
    });

    render(<UserDetailsPage params={params} />);

    // Wait for the component to update
    await waitFor(() => {
      // Basic UI elements should still be rendered
      expect(screen.getByText("User Details")).toBeInTheDocument();
      expect(screen.getByText("Back to Users")).toBeInTheDocument();
    });
  });

  test("should handle missing user properties gracefully", async () => {
    // Mock the useQuery hook to return incomplete data
    const incompleteUserData = {
      fullName: "John Doe",
      userId: "JD123",
      // Missing tier, balance, etc.
      education: {}, // Empty education object
      socials: {}, // Empty socials object
      guarantor: [], // Empty guarantor array
    };

    (useQuery as jest.Mock).mockReturnValue({
      data: incompleteUserData,
      isLoading: false,
    });

    render(<UserDetailsPage params={params} />);

    // Wait for the component to update
    await waitFor(() => {
      // Check if basic user details are rendered
      expect(screen.getByText("JD123")).toBeInTheDocument();
    });

    // Check if the component handles missing data gracefully
    expect(screen.getByText("Personal Information")).toBeInTheDocument();
  });

  test("should handle error in fetching user data", async () => {
    // Mock the useQuery hook to simulate an error
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("Failed to fetch user data"),
      isError: true,
    });

    render(<UserDetailsPage params={params} />);

    // Wait for the component to update
    await waitFor(() => {
      // Basic UI elements should still be rendered
      expect(screen.getByText("User Details")).toBeInTheDocument();
    });
  });

  test("should handle invalid params", async () => {
    // Mock the useQuery hook
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    // Render with invalid params
    render(<UserDetailsPage params={Promise.resolve({ id: "invalid-id" })} />);

    // Component should render without crashing
    expect(screen.getByText("User Details")).toBeInTheDocument();
  });
});
