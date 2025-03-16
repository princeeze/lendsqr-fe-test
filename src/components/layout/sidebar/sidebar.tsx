"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu } from "lucide-react";
import styles from "./sidebar.module.scss";
import clsx from "clsx";

// Types
interface NavItem {
  icon: string;
  label: string;
  href: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

// Data
const sidebarData: {
  sections: NavSection[];
} = {
  sections: [
    {
      title: "CUSTOMERS",
      items: [
        { icon: "users", label: "Users", href: "/users" },
        { icon: "guarantors", label: "Guarantors", href: "/guarantors" },
        { icon: "loans", label: "Loans", href: "/loans" },
        {
          icon: "models",
          label: "Decision Models",
          href: "/decision-models",
        },
        { icon: "savings", label: "Savings", href: "/savings" },
        { icon: "l-requests", label: "Loan Requests", href: "/loan-requests" },
        { icon: "whitelist", label: "Whitelist", href: "/whitelist" },
        { icon: "karma", label: "Karma", href: "/karma" },
      ],
    },
    {
      title: "BUSINESSES",
      items: [
        { icon: "organization", label: "Organization", href: "/organization" },
        { icon: "l-products", label: "Loan Products", href: "/loan-products" },
        {
          icon: "s-products",
          label: "Savings Products",
          href: "/savings-products",
        },
        {
          icon: "fees",
          label: "Fees and Charges",
          href: "/fees-charges",
        },
        { icon: "transactions", label: "Transactions", href: "/transactions" },
        { icon: "services", label: "Services", href: "/services" },
        {
          icon: "s-account",
          label: "Service Account",
          href: "/service-account",
        },
        {
          icon: "settlements",
          label: "Settlements",
          href: "/settlements",
        },
        { icon: "reports", label: "Reports", href: "/reports" },
      ],
    },
    {
      title: "SETTINGS",
      items: [
        { icon: "preferences", label: "Preferences", href: "/preferences" },
        {
          icon: "f-pricing",
          label: "Fees and Pricing",
          href: "/fees-pricing",
        },
        { icon: "audit", label: "Audit Logs", href: "/audit-logs" },
      ],
    },
  ],
};

// SidebarItem Component
interface SidebarItemProps {
  icon: string;
  label: string;
  href: string;
  isActive?: boolean;
}

function SidebarItem({ icon, label, href, isActive }: SidebarItemProps) {
  return (
    <Link href={href} className={styles.navLink}>
      <div className={clsx(styles.navItem, isActive && styles.active)}>
        <Image
          src={`/sidebar-icons/${icon}.svg`}
          alt={label}
          width={18}
          height={18}
          className={styles.icon}
        />
        <span className={styles.label}>{label}</span>
      </div>
    </Link>
  );
}

// SidebarSection Component
interface SidebarSectionProps {
  title: string;
  items: NavItem[];
  activePath: string;
}

function SidebarSection({ title, items, activePath }: SidebarSectionProps) {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      <div className={styles.sectionItems}>
        {items.map((item, index) => (
          <SidebarItem
            key={`${title}-${index}`}
            icon={item.icon}
            label={item.label}
            href={item.href}
            isActive={activePath === item.href}
          />
        ))}
      </div>
    </div>
  );
}

// SidebarToggle Component
interface SidebarToggleProps {
  onToggle: () => void;
}

function SidebarToggle({ onToggle }: SidebarToggleProps) {
  return (
    <button className={styles.toggleButton} onClick={onToggle}>
      <Menu size={24} />
    </button>
  );
}

// Main Sidebar Component
export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={styles.container}>
      <SidebarToggle onToggle={toggleSidebar} />
      <div className={clsx(styles.sidebar, isOpen && styles.open)}>
        <button className={styles.switchOrg}>
          <Image
            src="/sidebar-icons/s-organization.svg"
            alt="Organization"
            width={18}
            height={18}
            className={styles.orgIcon}
          />
          <span>Switch Organization</span>
          <ChevronDown className={styles.chevron} size={18} />
        </button>
        <div className={styles.navItems}>
          <Link href="/dashboard" className={styles.navLink}>
            <div
              className={clsx(
                styles.navItem,
                pathname === "/dashboard" && styles.active
              )}
            >
              <Image
                src="/sidebar-icons/dashboard.svg"
                alt="Dashboard"
                width={18}
                height={18}
              />
              <span>Dashboard</span>
            </div>
          </Link>
          {sidebarData.sections.map((section, index) => (
            <SidebarSection
              key={`section-${index}`}
              title={section.title}
              items={section.items}
              activePath={pathname}
            />
          ))}
        </div>
      </div>
    </nav>
  );
}
