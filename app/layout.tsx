import { Metadata } from "next";
import RootLayoutClient from "@/components/layout/RootLayoutClient";
import "./globals.css";

export const metadata: Metadata = {
  title: "AIMarg - Track the Changing World of Work",
  description: "Track the Changing World of Work with AI-powered career insights.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mui-color-scheme="light" suppressHydrationWarning>
      <body>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}