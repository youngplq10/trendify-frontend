import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Trendify – Stay Ahead of the Trends!",
  description: "Join Trendify, the ultimate social platform where viral moments, trending topics, and real-time conversations come to life. Share, engage, and explore what’s buzzing in the world—your voice shapes the trends! 🚀 #StayTrendy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
