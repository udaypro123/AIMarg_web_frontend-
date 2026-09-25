import { Metadata } from "next";
import RootLayoutClient from "@/components/layout/RootLayoutClient";

export const metadata: Metadata = {
  title: "AIMarg - Track the Changing World of Work",
  description: "Track the Changing World of Work with AI-powered career insights.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mui-color-scheme="light" suppressHydrationWarning style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
      <body style={{ margin: 0, minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#ffffff" }}>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}