"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import clsx from "clsx";
import styles from "./page.module.scss";
import {
  ListFilter,
  MoreVertical,
  Eye,
  UserX,
  UserCheck,
  Calendar,
} from "lucide-react";
import Image from "next/image";

type UserID = number;

type UserData = {
  id: UserID;
  organization: string;
  username: string;
  email: string;
  phoneNumber: string;
  dateJoined: string;
  status: string;
};

type UserStats = {
  all: number;
  active: number;
  loans: number;
  savings: number;
};

// Mock API functions
const fetchUsers = async (): Promise<UserData[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Check if data exists in localStorage
  const cachedData = localStorage.getItem("usersData");
  if (cachedData) {
    return JSON.parse(cachedData);
  }

  // Mock data for users
  const usersData = [
    {
      id: 1,
      organization: "Lendsqr",
      username: "Adedeji",
      email: "adedeji@lendsqr.com",
      phoneNumber: "08078903721",
      dateJoined: "May 15, 2020 10:00 AM",
      status: "Inactive",
    },
    {
      id: 2,
      organization: "Irorun",
      username: "Debby Ogana",
      email: "debby2@irorun.com",
      phoneNumber: "08160780928",
      dateJoined: "Apr 30, 2020 10:00 AM",
      status: "Pending",
    },
    {
      id: 3,
      organization: "Lendstar",
      username: "Grace Effiom",
      email: "grace@lendstar.com",
      phoneNumber: "07060780922",
      dateJoined: "Apr 30, 2020 10:00 AM",
      status: "Blacklisted",
    },
    {
      id: 4,
      organization: "Lendsqr",
      username: "Tosin Dokunmu",
      email: "tosin@lendsqr.com",
      phoneNumber: "07003309226",
      dateJoined: "Apr 10, 2020 10:00 AM",
      status: "Pending",
    },
    {
      id: 5,
      organization: "Lendstar",
      username: "Grace Effiom",
      email: "grace@lendstar.com",
      phoneNumber: "07060780922",
      dateJoined: "Apr 30, 2020 10:00 AM",
      status: "Active",
    },
    {
      id: 6,
      organization: "Lendsqr",
      username: "Tosin Dokunmu",
      email: "tosin@lendsqr.com",
      phoneNumber: "08060780900",
      dateJoined: "Apr 10, 2020 10:00 AM",
      status: "Active",
    },
    {
      id: 7,
      organization: "Lendstar",
      username: "Grace Effiom",
      email: "grace@lendstar.com",
      phoneNumber: "07060780922",
      dateJoined: "Apr 30, 2020 10:00 AM",
      status: "Blacklisted",
    },
    {
      id: 8,
      organization: "Lendsqr",
      username: "Tosin Dokunmu",
      email: "tosin@lendsqr.com",
      phoneNumber: "08060780900",
      dateJoined: "Apr 10, 2020 10:00 AM",
      status: "Inactive",
    },
    {
      id: 9,
      organization: "Lendstar",
      username: "Grace Effiom",
      email: "grace@lendstar.com",
      phoneNumber: "07060780922",
      dateJoined: "Apr 30, 2020 10:00 AM",
      status: "Inactive",
    },
    {
      id: 10,
      organization: "Lendsqr",
      username: "John Smith",
      email: "john@lendsqr.com",
      phoneNumber: "08060780901",
      dateJoined: "Jun 10, 2020 10:00 AM",
      status: "Active",
    },
    {
      id: 11,
      organization: "Irorun",
      username: "Sarah Johnson",
      email: "sarah@irorun.com",
      phoneNumber: "08160780929",
      dateJoined: "Jun 15, 2020 10:00 AM",
      status: "Pending",
    },
    {
      id: 12,
      organization: "Lendstar",
      username: "Michael Brown",
      email: "michael@lendstar.com",
      phoneNumber: "07060780923",
      dateJoined: "Jun 20, 2020 10:00 AM",
      status: "Active",
    },
  ];

  // Store in localStorage
  localStorage.setItem("usersData", JSON.stringify(usersData));

  return usersData;
};

const fetchStats = async (): Promise<UserStats> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Check if data exists in localStorage
  const cachedStats = localStorage.getItem("statsData");
  if (cachedStats) {
    return JSON.parse(cachedStats);
  }

  // Mock stats data
  const userStatsData = {
    all: 2453,
    active: 2453,
    loans: 12453,
    savings: 102453,
  };

  // Store in localStorage
  localStorage.setItem("statsData", JSON.stringify(userStatsData));

  return userStatsData;
};

// Filter form type
type FilterFormValues = {
  organization: string;
  username: string;
  email: string;
  date: string;
  phoneNumber: string;
  status: string;
};

export default function UsersPage() {
  const router = useRouter();
  const [showFilter, setShowFilter] = useState(false);
  const [actionMenuId, setActionMenuId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);

  const filterRef = useRef<HTMLDivElement>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);

  // React Hook Form setup
  const { register, handleSubmit, reset } = useForm<FilterFormValues>({
    defaultValues: {
      organization: "",
      username: "",
      email: "",
      date: "",
      phoneNumber: "",
      status: "",
    },
  });

  // Fetch users with React Query
  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  // Fetch stats with React Query
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["stats"],
    queryFn: fetchStats,
  });

  // Set filtered users when users data changes
  useEffect(() => {
    if (users) {
      setFilteredUsers(users);
    }
  }, [users]);

  // Handle click outside to close popups - This function will be called when clicking outside the filter panel or action menu

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      filterRef?.current &&
      !filterRef.current.contains(event.target as Node)
    ) {
      event.stopPropagation();
      setShowFilter(false);
    }

    if (
      actionMenuRef?.current &&
      !actionMenuRef.current.contains(event.target as Node)
    ) {
      event.stopPropagation();
      setActionMenuId(null);
    }
  }, []);

  useEffect(() => {
    if (!showFilter && !actionMenuId) {
      return;
    }
    document.addEventListener("pointerdown", handleClickOutside);
    return () =>
      document.removeEventListener("pointerdown", handleClickOutside);
  }, [actionMenuId, handleClickOutside, showFilter]);

  // Filter logic
  const onSubmitFilter = (filterValues: FilterFormValues) => {
    if (!users) return;

    const filtered = users.filter((user) => {
      //If no filter is provided (!filterValues.organization), then the condition is automatically true
      return (
        (!filterValues.organization ||
          user.organization
            .toLowerCase()
            .includes(filterValues.organization.toLowerCase())) &&
        (!filterValues.username ||
          user.username
            .toLowerCase()
            .includes(filterValues.username.toLowerCase())) &&
        (!filterValues.email ||
          user.email
            .toLowerCase()
            .includes(filterValues.email.toLowerCase())) &&
        (!filterValues.date || user.dateJoined.includes(filterValues.date)) &&
        (!filterValues.phoneNumber ||
          user.phoneNumber.includes(filterValues.phoneNumber)) &&
        (!filterValues.status ||
          user.status.toLowerCase() === filterValues.status.toLowerCase())
      );
    });

    setFilteredUsers(filtered);
    setShowFilter(false);
    setCurrentPage(1); // Reset to first page after filtering
  };

  const resetFilters = () => {
    reset();
    if (users) {
      setFilteredUsers(users);
    }
    setCurrentPage(1);
  };

  const handleViewDetails = (userId: number) => {
    router.push(`/users/${userId}`);
  };

  const toggleActionMenu = (id: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click when clicking action button
    setActionMenuId(actionMenuId === id ? null : id);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const renderStatusBadge = (status: string) => {
    const badgeClass = clsx(styles.statusBadge, {
      [styles.statusActive]: status.toLowerCase() === "active",
      [styles.statusInactive]: status.toLowerCase() === "inactive",
      [styles.statusPending]: status.toLowerCase() === "pending",
      [styles.statusBlacklisted]: status.toLowerCase() === "blacklisted",
    });

    return <span className={badgeClass}>{status}</span>;
  };

  // Stats Card Component
  const StatsCard = ({
    title,
    count,
    icon,
    color,
  }: {
    title: string;
    count: number;
    icon: string;
    color: string;
  }) => (
    <div className={styles.statsCard}>
      <div className={styles.statsIcon} style={{ backgroundColor: color }}>
        <Image
          src={`/sidebar-icons/${icon}`}
          alt={title}
          width={20}
          height={20}
        />
      </div>
      <div className={styles.statsTitle}>{title}</div>
      <div className={styles.statsCount}>{count}</div>
    </div>
  );

  // Stats Card Skeleton
  const StatsCardSkeleton = () => (
    <div className={clsx(styles.statsCard, styles.skeleton)}>
      <div className={clsx(styles.statsIcon, styles.skeletonPulse)}></div>
      <div
        className={clsx(
          styles.statsTitle,
          styles.skeletonPulse,
          styles.skeletonText
        )}
      ></div>
      <div
        className={clsx(
          styles.statsCount,
          styles.skeletonPulse,
          styles.skeletonText
        )}
      ></div>
    </div>
  );

  // Table Row Skeleton
  const TableRowSkeleton = () => (
    <div className={clsx(styles.tableRow, styles.skeleton)}>
      <div
        className={clsx(
          styles.tableCell,
          styles.skeletonPulse,
          styles.skeletonText
        )}
      ></div>
      <div
        className={clsx(
          styles.tableCell,
          styles.skeletonPulse,
          styles.skeletonText
        )}
      ></div>
      <div
        className={clsx(
          styles.tableCell,
          styles.skeletonPulse,
          styles.skeletonText
        )}
      ></div>
      <div
        className={clsx(
          styles.tableCell,
          styles.skeletonPulse,
          styles.skeletonText
        )}
      ></div>
      <div
        className={clsx(
          styles.tableCell,
          styles.skeletonPulse,
          styles.skeletonText
        )}
      ></div>
      <div
        className={clsx(
          styles.tableCell,
          styles.skeletonPulse,
          styles.skeletonText
        )}
      ></div>
      <div className={styles.tableCell}></div>
    </div>
  );

  // Filter Panel Component
  const FilterPanel = () => {
    // dynamic list of organizations based on data

    const organizations = () => {
      const allOrganizations = users?.map((user) => user.organization);

      const uniqueOrganizations = new Set(allOrganizations);

      return [...uniqueOrganizations];
    };

    return (
      <div ref={filterRef} className={styles.filterPanel}>
        <form onSubmit={handleSubmit(onSubmitFilter)}>
          <div className={styles.filterGroup}>
            <label>Organization</label>
            <select {...register("organization")}>
              <option value="">Select</option>
              {organizations().map((org) => (
                <option key={org} value={org}>
                  {org}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Username</label>

            <input type="text" placeholder="User" {...register("username")} />
          </div>

          <div className={styles.filterGroup}>
            <label>Email</label>

            <input type="email" placeholder="Email" {...register("email")} />
          </div>

          <div className={styles.filterGroup}>
            <label>Date</label>
            <div className={styles.dateInput}>
              <input type="text" placeholder="Date" {...register("date")} />
              <Calendar size={16} className={styles.calendarIcon} />
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label>Phone Number</label>
            <input
              type="text"
              placeholder="Phone Number"
              {...register("phoneNumber")}
            />
          </div>

          <div className={styles.filterGroup}>
            <label>Status</label>

            <select {...register("status")}>
              <option value="">Select</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending">Pending</option>
              <option value="Blacklisted">Blacklisted</option>
            </select>
          </div>

          <div className={styles.filterActions}>
            <button
              type="button"
              className={styles.resetBtn}
              onClick={resetFilters}
            >
              Reset
            </button>
            <button type="submit" className={styles.filterBtn}>
              Filter
            </button>
          </div>
        </form>
      </div>
    );
  };

  // Action Menu Component
  const ActionMenu = ({ userId }: { userId: UserID }) => (
    <div ref={actionMenuRef} className={styles.actionMenu}>
      <div
        className={styles.actionItem}
        onClick={() => handleViewDetails(userId)}
      >
        <Eye size={16} />
        <span>View Details</span>
      </div>
      <div className={styles.actionItem}>
        <UserX size={16} />
        <span>Blacklist User</span>
      </div>
      <div className={styles.actionItem}>
        <UserCheck size={16} />
        <span>Activate User</span>
      </div>
    </div>
  );

  // Generate pagination buttons
  const renderPaginationButtons = () => {
    const buttons = [];

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // Previous button
    buttons.push(
      <button
        key="prev"
        className={styles.paginationButton}
        onClick={() => currentPage > 1 && paginate(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &lt;
      </button>
    );

    // First page
    buttons.push(
      <button
        key={1}
        className={clsx(styles.paginationButton, {
          [styles.active]: currentPage === 1,
        })}
        onClick={() => paginate(1)}
      >
        1
      </button>
    );

    // Ellipsis and middle pages
    if (totalPages > 5) {
      if (currentPage > 3) {
        buttons.push(<span key="ellipsis1">...</span>);
      }

      // Pages around current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        buttons.push(
          <button
            key={i}
            className={clsx(styles.paginationButton, {
              [styles.active]: currentPage === i,
            })}
            onClick={() => paginate(i)}
          >
            {i}
          </button>
        );
      }

      if (currentPage < totalPages - 2) {
        buttons.push(<span key="ellipsis2">...</span>);
      }
    } else {
      // Show all pages if total pages <= 5
      for (let i = 2; i < totalPages; i++) {
        buttons.push(
          <button
            key={i}
            className={clsx(styles.paginationButton, {
              [styles.active]: currentPage === i,
            })}
            onClick={() => paginate(i)}
          >
            {i}
          </button>
        );
      }
    }

    // Last page (if more than 1 page)
    if (totalPages > 1) {
      buttons.push(
        <button
          key={totalPages}
          className={clsx(styles.paginationButton, {
            [styles.active]: currentPage === totalPages,
          })}
          onClick={() => paginate(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    // Next button
    buttons.push(
      <button
        key="next"
        className={styles.paginationButton}
        onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        &gt;
      </button>
    );

    return buttons;
  };

  return (
    <div className={styles.container}>
      <h1>Users</h1>

      <div className={styles.statsContainer}>
        {isLoadingStats ? (
          <>
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
          </>
        ) : (
          <>
            <StatsCard
              title="Users"
              count={stats?.all ?? 0}
              icon="users.svg"
              color="#FCE8FF"
            />
            <StatsCard
              title="Active Users"
              count={stats?.active ?? 0}
              icon="users.svg"
              color="#EEE8FF"
            />
            <StatsCard
              title="Users with loans"
              count={stats?.loans ?? 0}
              icon="users.svg"
              color="#FEEFEC"
            />
            <StatsCard
              title="Users with savings"
              count={stats?.savings ?? 0}
              icon="users.svg"
              color="#FFEBF0"
            />
          </>
        )}
      </div>

      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <div className={styles.tableHeaderCell}>
            <span>ORGANIZATION</span>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={styles.filterButton}
            >
              <ListFilter size={16} />
            </button>
          </div>
          <div className={styles.tableHeaderCell}>
            <span>USERNAME</span>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={styles.filterButton}
            >
              <ListFilter size={16} />
            </button>
          </div>
          <div className={styles.tableHeaderCell}>
            <span>EMAIL</span>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={styles.filterButton}
            >
              <ListFilter size={16} />
            </button>
          </div>
          <div className={styles.tableHeaderCell}>
            <span>PHONE NUMBER</span>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={styles.filterButton}
            >
              <ListFilter size={16} />
            </button>
          </div>
          <div className={styles.tableHeaderCell}>
            <span>DATE JOINED</span>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={styles.filterButton}
            >
              <ListFilter size={16} />
            </button>
          </div>
          <div className={styles.tableHeaderCell}>
            <span>STATUS</span>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={styles.filterButton}
            >
              <ListFilter size={16} />
            </button>
          </div>
          <div className={styles.tableHeaderCell}></div>
        </div>

        {showFilter && <FilterPanel />}

        <div className={styles.tableBody}>
          {isLoadingUsers ? (
            <>
              <TableRowSkeleton />
              <TableRowSkeleton />
              <TableRowSkeleton />
              <TableRowSkeleton />
              <TableRowSkeleton />
            </>
          ) : (
            currentItems.map((user) => (
              <div
                key={user.id}
                className={styles.tableRow}
                onClick={() => handleViewDetails(user.id)}
              >
                <div className={styles.tableCell}>{user.organization}</div>
                <div className={styles.tableCell}>{user.username}</div>
                <div className={styles.tableCell}>{user.email}</div>
                <div className={styles.tableCell}>{user.phoneNumber}</div>
                <div className={styles.tableCell}>{user.dateJoined}</div>
                <div className={styles.tableCell}>
                  {renderStatusBadge(user.status)}
                </div>
                <div className={styles.tableCell}>
                  <button
                    className={styles.actionButton}
                    onClick={(e) => toggleActionMenu(user.id, e)}
                  >
                    <MoreVertical size={16} />
                  </button>
                  {actionMenuId === user.id && <ActionMenu userId={user.id} />}
                </div>
              </div>
            ))
          )}

          {!isLoadingUsers && currentItems.length === 0 && (
            <div className={styles.noResults}>
              No users found matching your filters.
            </div>
          )}
        </div>
      </div>

      {!isLoadingUsers && filteredUsers.length > 0 && (
        <div className={styles.pagination}>
          <div className={styles.paginationInfo}>
            <span>Showing</span>
            <select
              className={styles.pageSize}
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>out of {filteredUsers.length}</span>
          </div>
          <div className={styles.paginationControls}>
            {renderPaginationButtons()}
          </div>
        </div>
      )}
    </div>
  );
}
