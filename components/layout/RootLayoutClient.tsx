"use client";

import { Providers } from "@/providers/ThemeProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Box } from "@mui/material";

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <Box
        sx={{
          flex: 1,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 2,
          paddingBottom: 2,
        }}
      >
        <Box
          sx={{
            maxWidth: 1200,
            width: { xs: "100%", sm: "95%", md: "90%" },
            flex: 1,
          }}
        >
          {children}
        </Box>
      </Box>
      <Footer />
    </>
  );
}