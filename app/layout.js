"use client";

import { GeistProvider, CssBaseline } from '@geist-ui/react';
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <GeistProvider>
          <CssBaseline />
          <ThemeProvider>{children}</ThemeProvider>
        </GeistProvider>
      </body>
    </html>
  );
}