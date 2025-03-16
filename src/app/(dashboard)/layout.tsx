import NavBar from "@/components/layout/navbar/navbar";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <header>
        <NavBar />
      </header>
      <main>
        <aside>side bar</aside>
        <div>{children}</div>
      </main>
    </div>
  );
}
