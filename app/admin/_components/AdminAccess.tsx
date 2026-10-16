"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Alert, Box } from "@mui/material";
import Loading from "@/components/common/Loading";
import { getRequestErrorMessage } from "@/services/api";
import { getMe } from "@/services/auth.service";
import type { User } from "@/types/api";

export const hasAdminAccess = (user: User | null) =>
  Boolean(user?.roles?.some((role) => role === "ADMIN" || role === "SUPER_ADMIN"));

export default function AdminAccess({ children }: { children: (user: User) => ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getMe()
      .then((profile) => {
        if (active) setUser(profile);
      })
      .catch((requestError: unknown) => {
        if (active) setError(getRequestErrorMessage(requestError, "Admin data could not be loaded. Please refresh and try again."));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <Box className="admin-loading"><Loading message="Checking admin access..." /></Box>;
  }
  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }
  if (!hasAdminAccess(user)) {
    return <Alert severity="error">You do not have permission to view this page.</Alert>;
  }
  return children(user!);
}
