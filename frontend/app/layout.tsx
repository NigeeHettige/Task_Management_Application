import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SideBar from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TaskFlow",
  description: "Task Management Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
        suppressHydrationWarning
        style={{ "--sidebar-width": "20%" } as React.CSSProperties}
      >
        <div className="flex h-screen">
          <SideBar />
          <main className="flex-1 ml-[var(--sidebar-width)] overflow-y-auto bg-custom_background">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}