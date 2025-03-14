import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import localFont from "next/font/local";

import "@/styles/globals.scss";

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
});

const avenirNext = localFont({
  src: [
    {
      path: "../fonts/AvenirNextLTPro-Regular.otf",
      weight: "400",
    },
  ],
  variable: "--font-avenirNext",
});

export const metadata: Metadata = {
  title:
    "Loan Management Software for the Smartest Lenders, Banks, and Fintechs in Nigeria",
  description:
    "Explore Lendsqr's loan management software for easy and efficient lending in Nigeria. Streamline your lending operations with our end-to-end solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${workSans.variable} ${avenirNext.variable}`}>
        {children}
      </body>
    </html>
  );
}
