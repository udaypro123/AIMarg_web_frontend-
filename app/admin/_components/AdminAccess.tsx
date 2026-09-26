"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Alert, Box, CircularProgress } from "@mui/material";
import { getMe } from "@/services/auth.service";
import type { User } from "@/types/api";

export const hasAdminAccess = (user: User | null) =>
  Boolean(user?.roles?.some((role) => role === "ADMIN" || role === "SUPER_ADMIN"));

export default function AdminAccess({ children }: { children: (user: User) => ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    getMe()
      .then((profile) => {
        if (active) setUser(profile);
      })
      .catch(() => {
        if (active) setFailed(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <Box className="admin-loading"><CircularProgress size={26} /></Box>;
  }
  if (failed) {
    return <Alert severity="error">Admin data could not be loaded. Please refresh and try again.</Alert>;
  }
  if (!hasAdminAccess(user)) {
    return <Alert severity="error">You do not have permission to view this page.</Alert>;
  }
  return children(user!);
}
