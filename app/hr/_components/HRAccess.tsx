"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Alert, Box } from "@mui/material";
import Loading from "@/components/common/Loading";
import { getRequestErrorMessage } from "@/services/api";
import { getMe } from "@/services/auth.service";
import type { User } from "@/types/api";

export default function HRAccess({ children }: { children: (user: User) => ReactNode }) {
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
        if (active) setError(getRequestErrorMessage(requestError, "Your account could not be verified. Please refresh and try again."));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (loading) return <Box className="admin-loading"><Loading message="Checking your HR workspace..." /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!user?.roles?.includes("HR")) return <Alert severity="error">You do not have permission to view this page.</Alert>;
  return children(user);
}
