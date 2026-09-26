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
  TextField,
  Typography,
} from "@mui/material";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import LockOpenRoundedIcon from "@mui/icons-material/LockOpenRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import AdminAccess from "../_components/AdminAccess";
import AdminUserPreview from "./_components/AdminUserPreview";
import {
  getAdminDashboardStats,
  getAdminUsers,
  getUserInteractionSummaries,
  setAdminUserBlocked,
} from "@/services/admin.service";
import type { User, UserInteractionSummary } from "@/types/api";

type UserStatus = "all" | "active" | "blocked";
type ManagedUser = User & { likeCount: number; commentCount: number; likedByMe: boolean };

function AdminUsers({ admin }: { admin: User }) {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [targetUser, setTargetUser] = useState<ManagedUser | null>(null);
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<UserStatus>("all");
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);
  const mayBlockUsers = Boolean(admin.roles?.some((role) => role === "ADMIN" || role === "SUPER_ADMIN"));

  useEffect(() => {
    let active = true;
    Promise.all([
      getAdminDashboardStats(),
      getAdminUsers(),
      getUserInteractionSummaries().catch((): UserInteractionSummary[] => []),
    ])
      .then(([stats, accountList, summary]) => {
        if (!active) return;
        const byUser = new Map(summary.map((item) => [item.targetUserId, item]));
        setTotalCount(stats.totalUsers);
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
      .catch(() => {
        if (active) setError("User accounts could not be loaded. Please try again.");
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
      if (status === "active" && account.isBlocked) return false;
      if (status === "blocked" && !account.isBlocked) return false;
      if (!normalizedQuery) return true;
      return [account.name, account.email, account.currentRole, account.company, account.profession, ...(account.skills || [])]
        .some((value) => value?.toLowerCase().includes(normalizedQuery));
    });
  }, [query, status, users]);

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
    } catch {
      setError("Account access could not be updated. Please try again.");
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

      <Box className="admin-users-toolbar">
        <Typography className="admin-users-count"><strong>{totalCount}</strong> accounts</Typography>
        <Box className="admin-users-filters">
          <TextField
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search users"
            size="small"
            className="admin-search"
            slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchRoundedIcon fontSize="small" /></InputAdornment> } }}
          />
          <TextField select size="small" label="Status" value={status} onChange={(event) => setStatus(event.target.value as UserStatus)} className="admin-status-filter">
            <MenuItem value="all">All accounts</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="blocked">Blocked</MenuItem>
          </TextField>
        </Box>
      </Box>

      {loading ? <Box className="admin-loading"><CircularProgress size={26} /></Box> : visibleUsers.length === 0 ? (
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
                    {[account.currentRole, account.company].filter(Boolean).join(" at ") || account.profession || account.roles?.[0] || "USER"}
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
