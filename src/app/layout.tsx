import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "FitZone | Premium Gym & Fitness Club",
    template: "%s | FitZone",
  },
  description:
    "FitZone is a premium fitness center offering world-class equipment, expert trainers, personalized programs and flexible memberships. Train harder. Live stronger. Become better.",
  keywords: ["gym", "fitness", "personal training", "membership", "workout", "FitZone"],
  openGraph: {
    title: "FitZone | Premium Gym & Fitness Club",
    description:
      "Build your strongest self with FitZone - premium equipment, expert trainers and personalized programs.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
