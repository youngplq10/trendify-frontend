import type { Metadata } from "next";
import "./globals.scss";
import { ThemeProvider } from "@mui/material";
import { theme } from "./scripts/theme";

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
      <head>
        <meta name="apple-mobile-web-app-title" content="Trenfiy" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ThemeProvider theme={theme}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
