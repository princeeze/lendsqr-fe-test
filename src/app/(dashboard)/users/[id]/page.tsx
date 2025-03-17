"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import styles from "./page.module.scss";
import { Star, MoveLeft, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button/button";

interface UserDetails {
  id: number;
  fullName: string;
  userId: string;
  tier: number;
  balance: string;
  bankName: string;
  phoneNumber: string;
  email: string;
  bvn: string;
  gender: string;
  maritalStatus: string;
  children: string;
  typeOfResidence: string;
  education: Education;
  socials: Socials;
  guarantor: Guarantor[];
}

interface Education {
  level: string;
  employmentStatus: string;
  sector: string;
  duration: string;
  officeEmail: string;
  monthlyIncome: string;
  loanRepayment: string;
}

interface Socials {
  twitter: string;
  facebook: string;
  instagram: string;
}

interface Guarantor {
  fullName: string;
  phoneNumber: string;
  email: string;
  relationship: string;
}

// Mock API function to fetch user details
const fetchUserDetails = async (userId: string): Promise<UserDetails> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Check if data exists in localStorage
  const cachedData = localStorage.getItem(`userDetails-${userId}`);
  if (cachedData) {
    return JSON.parse(cachedData);
  }

  // Mock user details data
  const userDetails = {
    id: Number.parseInt(userId),
    fullName: "Grace Effiom",
    userId: "LSQFf587g90",
    tier: 1,
    balance: "N200,000.00",
    bankName: "9912345678/Providus Bank",
    phoneNumber: "07060780922",
    email: "grace@gmail.com",
    bvn: "07060780922",
    gender: "Female",
    maritalStatus: "Single",
    children: "None",
    typeOfResidence: "Parent's Apartment",
    education: {
      level: "B.Sc",
      employmentStatus: "Employed",
      sector: "FinTech",
      duration: "2 years",
      officeEmail: "grace@lendsqr.com",
      monthlyIncome: "N200,000.00- N400,000.00",
      loanRepayment: "40,000",
    },
    socials: {
      twitter: "@grace_effiom",
      facebook: "Grace Effiom",
      instagram: "@grace_effiom",
    },
    guarantor: [
      {
        fullName: "Debby Ogana",
        phoneNumber: "07060780922",
        email: "debby@gmail.com",
        relationship: "Sister",
      },
      {
        fullName: "Debby Ogana",
        phoneNumber: "07060780922",
        email: "debby@gmail.com",
        relationship: "Sister",
      },
    ],
  };

  // Store in localStorage
  localStorage.setItem(`userDetails-${userId}`, JSON.stringify(userDetails));

  return userDetails;
};

export default function UserDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [id, setId] = useState<string>("");

  useEffect(() => {
    const fetchId = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    };

    fetchId();
  }, [params]);

  const router = useRouter();
  const [activeTab, setActiveTab] = useState("General Details");

  // Fetch user details with React Query
  const { data: user, isLoading } = useQuery({
    queryKey: ["userDetails", id],
    queryFn: () => fetchUserDetails(id),
  });

  const handleBackToList = () => {
    router.push("/users");
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // Skeleton components
  const UserInfoSkeleton = () => (
    <div className={clsx(styles.userBasicInfo, styles.skeleton)}>
      <div className={styles.userAvatar}>
        <div
          className={clsx(styles.avatarPlaceholder, styles.skeletonPulse)}
        ></div>
      </div>
      <div className={styles.userNameSection}>
        <h3 className={clsx(styles.skeletonPulse, styles.skeletonText)}></h3>
        <p className={clsx(styles.skeletonPulse, styles.skeletonText)}></p>
      </div>
      <div className={styles.userTier}>
        <p className={clsx(styles.skeletonPulse, styles.skeletonText)}></p>
        <div className={styles.stars}>
          <div
            className={clsx(styles.skeletonPulse, styles.skeletonStar)}
          ></div>
          <div
            className={clsx(styles.skeletonPulse, styles.skeletonStar)}
          ></div>
          <div
            className={clsx(styles.skeletonPulse, styles.skeletonStar)}
          ></div>
        </div>
      </div>
      <div className={clsx(styles.userBalance, styles.skeletonBalance)}>
        <h3 className={clsx(styles.skeletonPulse, styles.skeletonText)}> </h3>
        <p className={clsx(styles.skeletonPulse, styles.skeletonText)}></p>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <button className={styles.backLink} onClick={handleBackToList}>
        <MoveLeft size={16} />
        <span>Back to Users</span>
      </button>

      <div className={styles.userDetailsHeader}>
        <h2>User Details</h2>
        <div className={styles.userActions}>
          <Button variant="destructive">BLACKLIST USER</Button>
          <Button variant="secondary">ACTIVATE USER</Button>
        </div>
      </div>

      <div className={styles.userDetailsCard}>
        {isLoading ? (
          <>
            <UserInfoSkeleton />
            <div className={styles.userDetailsTabs}>
              {[
                "General Details",
                "Documents",
                "Bank Details",
                "Loans",
                "Savings",
                "App and System",
              ].map((tab) => (
                <div
                  key={tab}
                  className={clsx(styles.tab, {
                    [styles.activeTab]: activeTab === tab,
                  })}
                >
                  {tab}
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className={styles.userBasicInfo}>
              <div className={styles.userAvatar}>
                <div className={styles.avatarPlaceholder}>
                  <UserRound size={48} strokeWidth={1.4} />
                </div>
              </div>
              <div className={styles.userNameSection}>
                <h3>{user?.fullName}</h3>
                <p>{user?.userId}</p>
              </div>
              <div className={styles.userTier}>
                <p>User&apos;s Tier</p>
                <div className={styles.stars}>
                  {[1, 2, 3].map((starNumber) => (
                    <Star
                      key={starNumber}
                      size={16}
                      fill={
                        starNumber <= (user?.tier ?? 0) ? "#E9B200" : "none"
                      }
                      stroke="#E9B200"
                    />
                  ))}
                </div>
              </div>
              <div className={styles.userBalance}>
                <h3>{user?.balance}</h3>
                <p>{user?.bankName}</p>
              </div>
            </div>

            <div className={styles.userDetailsTabs}>
              {[
                "General Details",
                "Documents",
                "Bank Details",
                "Loans",
                "Savings",
                "App and System",
              ].map((tab) => (
                <div
                  key={tab}
                  className={clsx(styles.tab, {
                    [styles.activeTab]: activeTab === tab,
                  })}
                  onClick={() => handleTabChange(tab)}
                >
                  {tab}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {activeTab === "General Details" && (
        <div className={styles.detailsContent}>
          {!isLoading && (
            <>
              <section className={styles.detailsSection}>
                <h4>Personal Information</h4>
                <div className={styles.detailsGrid}>
                  <div className={styles.detailItem}>
                    <label>FULL NAME</label>
                    <p>{user?.fullName}</p>
                  </div>
                  <div className={styles.detailItem}>
                    <label>PHONE NUMBER</label>
                    <p>{user?.phoneNumber}</p>
                  </div>
                  <div className={styles.detailItem}>
                    <label>EMAIL ADDRESS</label>
                    <p>{user?.email}</p>
                  </div>
                  <div className={styles.detailItem}>
                    <label>BVN</label>
                    <p>{user?.bvn}</p>
                  </div>
                  <div className={styles.detailItem}>
                    <label>GENDER</label>
                    <p>{user?.gender}</p>
                  </div>
                  <div className={styles.detailItem}>
                    <label>MARITAL STATUS</label>
                    <p>{user?.maritalStatus}</p>
                  </div>
                  <div className={styles.detailItem}>
                    <label>CHILDREN</label>
                    <p>{user?.children}</p>
                  </div>
                  <div className={styles.detailItem}>
                    <label>TYPE OF RESIDENCE</label>
                    <p>{user?.typeOfResidence}</p>
                  </div>
                </div>
              </section>

              <section className={styles.detailsSection}>
                <h4>Education and Employment</h4>
                <div className={styles.detailsGrid}>
                  <div className={styles.detailItem}>
                    <label>LEVEL OF EDUCATION</label>
                    <p>{user?.education.level}</p>
                  </div>
                  <div className={styles.detailItem}>
                    <label>EMPLOYMENT STATUS</label>
                    <p>{user?.education.employmentStatus}</p>
                  </div>
                  <div className={styles.detailItem}>
                    <label>SECTOR OF EMPLOYMENT</label>
                    <p>{user?.education.sector}</p>
                  </div>
                  <div className={styles.detailItem}>
                    <label>DURATION OF EMPLOYMENT</label>
                    <p>{user?.education.duration}</p>
                  </div>
                  <div className={styles.detailItem}>
                    <label>OFFICE EMAIL</label>
                    <p>{user?.education.officeEmail}</p>
                  </div>
                  <div className={styles.detailItem}>
                    <label>MONTHLY INCOME</label>
                    <p>{user?.education.monthlyIncome}</p>
                  </div>
                  <div className={styles.detailItem}>
                    <label>LOAN REPAYMENT</label>
                    <p>{user?.education.loanRepayment}</p>
                  </div>
                </div>
              </section>

              <section className={styles.detailsSection}>
                <h4>Socials</h4>
                <div className={styles.detailsGrid}>
                  <div className={styles.detailItem}>
                    <label>TWITTER</label>
                    <p>{user?.socials.twitter}</p>
                  </div>
                  <div className={styles.detailItem}>
                    <label>FACEBOOK</label>
                    <p>{user?.socials.facebook}</p>
                  </div>
                  <div className={styles.detailItem}>
                    <label>INSTAGRAM</label>
                    <p>{user?.socials.instagram}</p>
                  </div>
                </div>
              </section>

              <section className={styles.detailsSection}>
                <h4>Guarantor</h4>
                {user?.guarantor.map((g, index) => (
                  <div key={index} className={styles.detailsGrid}>
                    <div className={styles.detailItem}>
                      <label>FULL NAME</label>
                      <p>{g.fullName}</p>
                    </div>
                    <div className={styles.detailItem}>
                      <label>PHONE NUMBER</label>
                      <p>{g.phoneNumber}</p>
                    </div>
                    <div className={styles.detailItem}>
                      <label>EMAIL ADDRESS</label>
                      <p>{g.email}</p>
                    </div>
                    <div className={styles.detailItem}>
                      <label>RELATIONSHIP</label>
                      <p>{g.relationship}</p>
                    </div>
                  </div>
                ))}
              </section>
            </>
          )}
        </div>
      )}
    </div>
  );
}
