"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import LockOpenRoundedIcon from "@mui/icons-material/LockOpenRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import Loading from "@/components/common/Loading";
import AdminAccess from "../_components/AdminAccess";
import AdminUserPreview from "./_components/AdminUserPreview";
import { getRequestErrorMessage } from "@/services/api";
import {
  getAdminUsers,
  getUserInteractionSummaries,
  setAdminUserBlocked,
} from "@/services/admin.service";
import type { User } from "@/types/api";

type UserStatus = "all" | "active" | "blocked";
type AccountType = "user" | "hr";
type ManagedUser = User & { likeCount: number; commentCount: number; likedByMe: boolean };

function AdminUsers({ admin }: { admin: User }) {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [targetUser, setTargetUser] = useState<ManagedUser | null>(null);
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<UserStatus>("all");
  const [accountType, setAccountType] = useState<AccountType>("user");
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);
  const mayBlockUsers = Boolean(admin.roles?.some((role) => role === "ADMIN" || role === "SUPER_ADMIN"));

  useEffect(() => {
    let active = true;
    Promise.all([getAdminUsers(), getUserInteractionSummaries()])
      .then(([accountList, summary]) => {
        if (!active) return;
        const byUser = new Map(summary.map((item) => [item.targetUserId, item]));
        setUsers(accountList.map((account) => {
          const interaction = byUser.get(account._id || "");
          return {
            ...account,
            likeCount: interaction?.likeCount ?? 0,
            commentCount: interaction?.commentCount ?? 0,
            likedByMe: interaction?.likedByMe ?? false,
          };
        }));
        setError("");
      })
      .catch((requestError: unknown) => {
        if (active) setError(getRequestErrorMessage(requestError, "User accounts could not be loaded. Please try again."));
      })
      .finally(() => {
        if (active) {
          setLoading(false);
          setRefreshing(false);
        }
      });
    return () => {
      active = false;
    };
  }, [reload]);

  const visibleUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return users.filter((account) => {
      const isHr = account.roles?.includes("HR") ?? false;
      if (accountType === "hr" ? !isHr : isHr) return false;
      if (status === "active" && account.isBlocked) return false;
      if (status === "blocked" && !account.isBlocked) return false;
      if (!normalizedQuery) return true;
      return [account.name, account.email, account.currentRole, account.company, ...(account.skills || [])]
        .some((value) => value?.toLowerCase().includes(normalizedQuery));
    });
  }, [accountType, query, status, users]);

  const accountTypeCounts = useMemo(() => ({
    user: users.filter((account) => !account.roles?.includes("HR")).length,
    hr: users.filter((account) => account.roles?.includes("HR")).length,
  }), [users]);

  const refresh = () => {
    setRefreshing(true);
    setReload((value) => value + 1);
  };

  const confirmBlockChange = async () => {
    if (!targetUser?._id) return;
    const nextBlockedState = !targetUser.isBlocked;
    setUpdatingId(targetUser._id);
    setError("");
    try {
      const updated = await setAdminUserBlocked(targetUser._id, nextBlockedState);
      setUsers((current) => current.map((account) => account._id === updated._id
        ? { ...account, isBlocked: updated.isBlocked }
        : account));
      setTargetUser(null);
    } catch (requestError: unknown) {
      setError(getRequestErrorMessage(requestError, "Account access could not be updated. Please try again."));
    } finally {
      setUpdatingId(null);
    }
  };

  const updateInteractionCounts = (
    userId: string,
    interaction: Pick<ManagedUser, "likeCount" | "commentCount" | "likedByMe">
  ) => {
    setUsers((current) => current.map((account) => account._id === userId ? { ...account, ...interaction } : account));
    setSelectedUser((current) => current?._id === userId ? { ...current, ...interaction } : current);
  };

  return (
    <Stack spacing={3}>
      <Box className="admin-page-heading">
        <Box>
          <Typography className="page-eyebrow">ADMINISTRATION</Typography>
          <Typography variant="h1" className="page-title">Manage users</Typography>
          <Typography className="page-subtitle">Review profiles and account access across AIMarg.</Typography>
        </Box>
        <Button variant="outlined" startIcon={refreshing ? <CircularProgress size={16} /> : <RefreshRoundedIcon />} onClick={refresh} disabled={refreshing}>
          Refresh
        </Button>
      </Box>

      {error && <Alert severity="error" onClose={() => setError("")}>{error}</Alert>}

      <Paper className="admin-user-type-tabs" elevation={0}>
        <Tabs
          value={accountType}
          onChange={(_, value: AccountType) => setAccountType(value)}
          aria-label="Filter accounts by role"
          variant="fullWidth"
        >
          <Tab value="user" label={`Users (${accountTypeCounts.user})`} />
          <Tab value="hr" label={`HR (${accountTypeCounts.hr})`} />
        </Tabs>
      </Paper>

      <Box className="admin-users-toolbar">
        <Typography className="admin-users-count"><strong>{visibleUsers.length}</strong> {accountType === "hr" ? "HR accounts" : "user accounts"}</Typography>
        <Box className="admin-users-filters">
          <TextField
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={accountType === "hr" ? "Search HR accounts" : "Search users"}
            size="small"
            className="admin-search"
            slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchRoundedIcon fontSize="small" /></InputAdornment> } }}
          />
          <TextField
            select
            size="small"
            label="Status"
            value={status}
            onChange={(event) => setStatus(event.target.value as UserStatus)}
            className="admin-status-filter"
            slotProps={{
              select: {
                MenuProps: {
                  slotProps: { paper: { className: "admin-status-menu" } },
                },
              },
            }}
          >
            <MenuItem value="all" sx={{ color: "#111118" }}>All accounts</MenuItem>
            <MenuItem value="active" sx={{ color: "#111118" }}>Active</MenuItem>
            <MenuItem value="blocked" sx={{ color: "#111118" }}>Blocked</MenuItem>
          </TextField>
        </Box>
      </Box>

      {loading ? <Box className="admin-loading"><Loading message="Loading user accounts..." /></Box> : visibleUsers.length === 0 ? (
        <Paper className="admin-empty-panel" elevation={0}>
          <Typography variant="h3">{users.length ? "No matching accounts" : "No users yet"}</Typography>
          <Typography variant="body2">{users.length ? "Try another name, role, or status filter." : "New registrations will appear here."}</Typography>
        </Paper>
      ) : (
        <Stack className="admin-user-list" spacing={1}>
          {visibleUsers.map((account) => (
            <Paper className="admin-managed-user" elevation={0} key={account._id}>
              <Button className="admin-managed-user-main" onClick={() => setSelectedUser(account)}>
                <Avatar className="admin-avatar">{account.name?.charAt(0).toUpperCase() || "U"}</Avatar>
                <span className="admin-user-copy">
                  <strong>{account.name}</strong>
                  <small>{account.email}</small>
                  <small className="admin-user-role-line">
                    {[account.currentRole, account.company].filter(Boolean).join(" at ") || account.roles?.[0] || "USER"}
                  </small>
                </span>
              </Button>
              <Box className="admin-managed-user-details">
                <Chip size="small" label={account.isBlocked ? "Blocked" : "Active"} className={account.isBlocked ? "admin-status-chip is-blocked" : "admin-status-chip"} />
                <Typography variant="caption">{account.likeCount} likes · {account.commentCount} comments</Typography>
                <Typography variant="caption">Joined {account.createdAt ? new Date(account.createdAt).toLocaleDateString() : "-"}</Typography>
                <Button component={Link} href={`/admin/users/${account._id}`} className="admin-open-profile">Full profile</Button>
              </Box>
              {mayBlockUsers && (
                <Button
                  variant="outlined"
                  color={account.isBlocked ? "primary" : "error"}
                  className="admin-block-button"
                  startIcon={account.isBlocked ? <LockOpenRoundedIcon /> : <BlockRoundedIcon />}
                  onClick={() => setTargetUser(account)}
                  disabled={updatingId === account._id}
                >
                  {updatingId === account._id ? <CircularProgress size={16} /> : account.isBlocked ? "Unblock" : "Block"}
                </Button>
              )}
            </Paper>
          ))}
        </Stack>
      )}

      <Dialog open={Boolean(targetUser)} onClose={() => setTargetUser(null)} maxWidth="xs" fullWidth>
        <DialogTitle>{targetUser?.isBlocked ? "Restore account access?" : "Block this account?"}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            {targetUser?.name} will {targetUser?.isBlocked ? "be able to sign in again" : "lose access to AIMarg"}.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTargetUser(null)} color="inherit">Cancel</Button>
          <Button onClick={() => void confirmBlockChange()} variant="contained" color={targetUser?.isBlocked ? "primary" : "error"} disabled={Boolean(updatingId)}>
            {targetUser?.isBlocked ? "Unblock account" : "Block account"}
          </Button>
        </DialogActions>
      </Dialog>
      {selectedUser && (
        <AdminUserPreview
          user={selectedUser}
          open
          onClose={() => setSelectedUser(null)}
          onInteractionChange={updateInteractionCounts}
        />
      )}
    </Stack>
  );
}

export default function AdminUsersPage() {
  return <AdminAccess>{(admin) => <AdminUsers admin={admin} />}</AdminAccess>;
}
