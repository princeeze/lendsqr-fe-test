"use client";
import NavBar from "@/components/layout/navbar/navbar";
import Sidebar from "@/components/layout/sidebar/sidebar";
import React from "react";
import styles from "./layout.module.scss";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();
  return (
    <div className={styles.layout}>
      <QueryClientProvider client={queryClient}>
        <header>
          <NavBar />
        </header>
        <main className={styles.main}>
          <aside>
            <Sidebar />
          </aside>
          <div style={{ minHeight: "300vh", padding: "40px" }}>{children}</div>
        </main>
      </QueryClientProvider>
    </div>
  );
}
