import { Providers } from "../providers/ThemeProvider";

export const metadata = {
  title: "AIMarg - Track the Changing World of Work",
  description: "Track the Changing World of Work with AI-powered career insights.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mui-color-scheme="light" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
