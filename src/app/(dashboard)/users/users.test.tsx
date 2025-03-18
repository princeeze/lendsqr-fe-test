import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import UsersPage from "./page";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

// Mock the @tanstack/react-query module
jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
}));

// Mock data
const mockUsers = [
  {
    id: 1,
    organization: "Lendsqr",
    username: "johndoe",
    email: "john.doe@example.com",
    phoneNumber: "+1234567890",
    dateJoined: "2022-01-01",
    status: "Active",
  },
  {
    id: 2,
    organization: "Irorun",
    username: "janedoe",
    email: "jane.doe@example.com",
    phoneNumber: "+0987654321",
    dateJoined: "2022-02-01",
    status: "Inactive",
  },
  {
    id: 3,
    organization: "Lendsqr",
    username: "bobsmith",
    email: "bob.smith@example.com",
    phoneNumber: "+1122334455",
    dateJoined: "2022-03-01",
    status: "Pending",
  },
  {
    id: 4,
    organization: "Irorun",
    username: "alicesmith",
    email: "alice.smith@example.com",
    phoneNumber: "+5566778899",
    dateJoined: "2022-04-01",
    status: "Blacklisted",
  },
  {
    id: 5,
    organization: "Lendsqr",
    username: "mikeross",
    email: "mike.ross@example.com",
    phoneNumber: "+1231231234",
    dateJoined: "2022-05-01",
    status: "Active",
  },
  {
    id: 6,
    organization: "Irorun",
    username: "rachelbrown",
    email: "rachel.brown@example.com",
    phoneNumber: "+4564564567",
    dateJoined: "2022-06-01",
    status: "Inactive",
  },
];

const mockStats = {
  all: 100,
  active: 80,
  loans: 50,
  savings: 60,
};

describe("UsersPage", () => {
  // POSITIVE SCENARIOS
  test("should render loading state when data is being fetched", () => {
    // Mock the useQuery hook to simulate loading state
    (useQuery as jest.Mock).mockImplementation(({ queryKey }) => {
      if (queryKey[0] === "users") {
        return {
          data: undefined,
          isLoading: true,
        };
      }
      if (queryKey[0] === "stats") {
        return {
          data: undefined,
          isLoading: true,
        };
      }
      return {};
    });

    render(<UsersPage />);

    // Check if loading skeleton is rendered
    const skeletons = screen.getAllByTestId("loading-skeleton");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  test("should render users table when data is fetched successfully", async () => {
    // Mock the useQuery hook to return successful data
    (useQuery as jest.Mock).mockImplementation(({ queryKey }) => {
      if (queryKey[0] === "users") {
        return {
          data: mockUsers,
          isLoading: false,
        };
      }
      if (queryKey[0] === "stats") {
        return {
          data: mockStats,
          isLoading: false,
        };
      }
      return {};
    });

    render(<UsersPage />);

    // Wait for the component to update
    await waitFor(() => {
      // Check if user data is rendered
      expect(screen.getByText("johndoe")).toBeInTheDocument();
      expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
      expect(screen.getByText("+1234567890")).toBeInTheDocument();
    });

    // Check if stats are rendered
    expect(screen.getByText("80")).toBeInTheDocument(); // active users
  });

  test("should open filter panel when filter button is clicked", async () => {
    // Mock the useQuery hook to return data
    (useQuery as jest.Mock).mockImplementation(({ queryKey }) => {
      if (queryKey[0] === "users") {
        return {
          data: mockUsers,
          isLoading: false,
        };
      }
      if (queryKey[0] === "stats") {
        return {
          data: mockStats,
          isLoading: false,
        };
      }
      return {};
    });

    render(<UsersPage />);

    // Initially, filter panel should not be visible
    expect(screen.queryByText("Reset")).not.toBeInTheDocument();

    // Click on a filter button
    const filterButtons = screen.getAllByRole("button", { name: "" });
    fireEvent.click(filterButtons[0]); // First filter button

    // Now filter panel should be visible
    await waitFor(() => {
      expect(screen.getByText("Reset")).toBeInTheDocument();
      expect(screen.getByText("Filter")).toBeInTheDocument();
    });
  });

  test("should open action menu when action button is clicked", async () => {
    // Mock the useQuery hook to return data
    (useQuery as jest.Mock).mockImplementation(({ queryKey }) => {
      if (queryKey[0] === "users") {
        return {
          data: mockUsers,
          isLoading: false,
        };
      }
      if (queryKey[0] === "stats") {
        return {
          data: mockStats,
          isLoading: false,
        };
      }
      return {};
    });

    render(<UsersPage />);

    // Initially, action menu should not be visible
    expect(screen.queryByText("View Details")).not.toBeInTheDocument();

    // Wait for table to render
    await waitFor(() => {
      expect(screen.getByText("johndoe")).toBeInTheDocument();
    });

    // Click on an action button
    const actionButtons = screen.getAllByRole("button");
    const moreButtons = actionButtons.filter((button) =>
      button.classList.contains("actionButton")
    );

    if (moreButtons.length > 0) {
      fireEvent.click(moreButtons[0]);
    }

    // Now action menu should be visible
    await waitFor(() => {
      expect(screen.getByText("View Details")).toBeInTheDocument();
      expect(screen.getByText("Blacklist User")).toBeInTheDocument();
      expect(screen.getByText("Activate User")).toBeInTheDocument();
    });
  });

  test("should navigate to user details page when row is clicked", async () => {
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    // Mock the useQuery hook to return data
    (useQuery as jest.Mock).mockImplementation(({ queryKey }) => {
      if (queryKey[0] === "users") {
        return {
          data: mockUsers,
          isLoading: false,
        };
      }
      if (queryKey[0] === "stats") {
        return {
          data: mockStats,
          isLoading: false,
        };
      }
      return {};
    });

    render(<UsersPage />);

    // Wait for table to render
    await waitFor(() => {
      expect(screen.getByText("johndoe")).toBeInTheDocument();
    });

    // Click on the first row
    const tableRows = screen.getAllByRole("row");
    if (tableRows.length > 0) {
      fireEvent.click(tableRows[0]);
    }

    // Check if the router.push was called with the correct URL
    expect(mockPush).toHaveBeenCalledWith("/users/1");
  });

  test("should change pagination when page buttons are clicked", async () => {
    // Mock the useQuery hook to return data with many users
    (useQuery as jest.Mock).mockImplementation(({ queryKey }) => {
      if (queryKey[0] === "users") {
        return {
          data: mockUsers,
          isLoading: false,
        };
      }
      if (queryKey[0] === "stats") {
        return {
          data: mockStats,
          isLoading: false,
        };
      }
      return {};
    });

    render(<UsersPage />);

    // Wait for pagination to render
    await waitFor(() => {
      expect(screen.getByText("Showing")).toBeInTheDocument();
    });

    // Get the next button
    const nextButton = screen.getByText(">");

    // Only 5 items per page by default, so page 2 would be available
    if (mockUsers.length > 5) {
      // Click next page
      fireEvent.click(nextButton);

      // Should now be on page 2
      const pageButtons = screen.getAllByRole("button");
      const page2Button = pageButtons.find(
        (button) => button.textContent === "2"
      );
      expect(page2Button).toHaveClass("active");
    }
  });

  // NEGATIVE SCENARIOS
  test("should handle error in fetching users data", async () => {
    // Mock the useQuery hook to simulate an error
    (useQuery as jest.Mock).mockImplementation(({ queryKey }) => {
      if (queryKey[0] === "users") {
        return {
          data: undefined,
          isLoading: false,
          error: new Error("Failed to fetch users"),
          isError: true,
        };
      }
      if (queryKey[0] === "stats") {
        return {
          data: mockStats,
          isLoading: false,
        };
      }
      return {};
    });

    render(<UsersPage />);

    // Wait for the component to update
    await waitFor(() => {
      // Should show no results message
      expect(
        screen.getByText("No users found matching your filters.")
      ).toBeInTheDocument();
    });
  });

  test("should handle error in fetching stats data", async () => {
    // Mock the useQuery hook to simulate an error in stats
    (useQuery as jest.Mock).mockImplementation(({ queryKey }) => {
      if (queryKey[0] === "users") {
        return {
          data: mockUsers,
          isLoading: false,
        };
      }
      if (queryKey[0] === "stats") {
        return {
          data: undefined,
          isLoading: false,
          error: new Error("Failed to fetch stats"),
          isError: true,
        };
      }
      return {};
    });

    render(<UsersPage />);

    // Wait for the component to update
    await waitFor(() => {
      // Should still render users table even if stats failed
      expect(screen.getByText("johndoe")).toBeInTheDocument();
    });

    // Stats should show zeros
    expect(screen.getAllByText("0").length).toBeGreaterThan(0);
  });

  test("should close action menu when clicking outside", async () => {
    // Mock the useQuery hook to return data
    (useQuery as jest.Mock).mockImplementation(({ queryKey }) => {
      if (queryKey[0] === "users") {
        return {
          data: mockUsers,
          isLoading: false,
        };
      }
      if (queryKey[0] === "stats") {
        return {
          data: mockStats,
          isLoading: false,
        };
      }
      return {};
    });

    render(<UsersPage />);

    // Wait for table to render
    await waitFor(() => {
      expect(screen.getByText("johndoe")).toBeInTheDocument();
    });

    // Open action menu
    const actionButtons = screen.getAllByRole("button");
    const moreButtons = actionButtons.filter((button) =>
      button.classList.contains("actionButton")
    );

    if (moreButtons.length > 0) {
      fireEvent.click(moreButtons[0]);
    }

    // Action menu should be visible
    await waitFor(() => {
      expect(screen.getByText("View Details")).toBeInTheDocument();
    });

    // Click outside (the document body)
    fireEvent.pointerDown(document.body);

    // Action menu should close
    await waitFor(() => {
      expect(screen.queryByText("View Details")).not.toBeInTheDocument();
    });
  });
});
