"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Providers } from "@/providers/ThemeProvider";
import GlobalApiLoader from "@/components/common/GlobalApiLoader";
import Loading from "@/components/common/Loading";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { getRequestErrorMessage } from "@/services/api";
import { getMe, logout } from "@/services/auth.service";
import { getNotifications, markNotificationRead } from "@/services/notification.service";
import { addAdminUserComment } from "@/services/admin.service";
import { createComment } from "@/services/community.service";
import type { AppNotification, User } from "@/types/api";

const primaryNav = [
  { label: "Overview", href: "/", icon: <DashboardRoundedIcon /> },
  { label: "Community", href: "/community", icon: <GroupsRoundedIcon /> },
  { label: "AI impact", href: "/impact", icon: <InsightsRoundedIcon /> },
  { label: "Skills", href: "/skills", icon: <AutoAwesomeRoundedIcon /> },
  { label: "Profile", href: "/profile", icon: <PersonRoundedIcon /> },
];

const adminNav = [
  { label: "Dashboard", href: "/admin", icon: <DashboardRoundedIcon /> },
  { label: "Manage users", href: "/admin/users", icon: <GroupsRoundedIcon /> },
  { label: "Profile", href: "/profile", icon: <PersonRoundedIcon /> },
];

const hrNav = [
  { label: "Dashboard", href: "/hr", icon: <DashboardRoundedIcon /> },
  { label: "Candidates", href: "/hr/candidates", icon: <GroupsRoundedIcon /> },
  { label: "Profile", href: "/profile", icon: <PersonRoundedIcon /> },
];

function Brand() {
  return (
    <Link href="/" className="workspace-brand" aria-label="AIMarg home">
      <span className="workspace-brand-mark">A</span>
      <span className="workspace-brand-name">AIMarg</span>
    </Link>
  );
}

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [notificationAnchor, setNotificationAnchor] = useState<HTMLElement | null>(null);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationError, setNotificationError] = useState("");
  const [replyingNotificationId, setReplyingNotificationId] = useState<string | null>(null);
  const [notificationReply, setNotificationReply] = useState("");
  const isAuthRoute = pathname.startsWith("/auth/") || pathname === "/onboarding" || pathname === "/how-it-works";
  const isAdmin = Boolean(user?.roles?.some((role) => role === "ADMIN" || role === "SUPER_ADMIN"));
  const isHR = Boolean(user?.roles?.includes("HR"));
  const navigationItems = isAdmin ? adminNav : isHR ? hrNav : primaryNav;
  const mobileNavigationItems = navigationItems;
  const activeNavigationHref = [...navigationItems]
    .filter((item) => item.href === "/"
      ? pathname === "/"
      : pathname === item.href || pathname.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  useEffect(() => {
    if (isAuthRoute) return;
    let active = true;
    getMe()
      .then((profile) => {
        if (active) {
          setUser(profile);
          setAuthChecked(true);
        }
      })
      .catch(() => {
        if (active) {
          setUser(null);
          router.replace("/auth/login");
        }
      });
    return () => {
      active = false;
    };
  }, [isAuthRoute, router]);

  const refreshNotifications = useCallback(async () => {
    setNotificationsLoading(true);
    setNotificationError("");
    try {
      setNotifications(await getNotifications());
    } catch (requestError: unknown) {
      setNotificationError(getRequestErrorMessage(requestError, "Could not load notifications."));
    } finally {
      setNotificationsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authChecked || isAuthRoute) return;
    const initialLoad = window.setTimeout(() => void refreshNotifications(), 0);
    const interval = window.setInterval(() => void refreshNotifications(), 30_000);
    return () => {
      window.clearTimeout(initialLoad);
      window.clearInterval(interval);
    };
  }, [authChecked, isAuthRoute, refreshNotifications]);

  useEffect(() => {
    if (!authChecked || pathname !== "/") return;
    if (isAdmin) router.replace("/admin");
    else if (isHR) router.replace("/hr");
  }, [authChecked, isAdmin, isHR, pathname, router]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (requestError: unknown) {
      setNotificationError(getRequestErrorMessage(requestError, "Could not log out cleanly."));
    } finally {
      setUser(null);
      router.push("/auth/login");
    }
  };

  const openNotifications = async (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
    await refreshNotifications();
  };

  const handleNotificationClick = async (notification: AppNotification) => {
    if (!notification.read) {
      try {
        const updated = await markNotificationRead(notification._id);
        setNotifications((current) => current.map((item) => item._id === updated._id ? updated : item));
      } catch (requestError: unknown) {
        setNotificationError(getRequestErrorMessage(requestError, "Could not update this notification."));
      }
    }
    if (!notification.commentId) {
      router.push("/community");
      setNotificationAnchor(null);
    }
  };

  const handleNotificationReply = async (
    event: FormEvent<HTMLFormElement>,
    notification: AppNotification
  ) => {
    event.preventDefault();
    const content = notificationReply.trim();
    if (!content || !notification.targetId || !notification.commentId) return;
    try {
      if (notification.targetType === "profile") {
        await addAdminUserComment(notification.targetId, content, notification.commentId);
      } else if (notification.targetType === "post") {
        await createComment(notification.targetId, content, notification.commentId);
      } else {
        return;
      }
      setNotificationReply("");
      setReplyingNotificationId(null);
      await refreshNotifications();
    } catch (requestError: unknown) {
      setNotificationError(getRequestErrorMessage(requestError, "Your reply could not be posted."));
    }
  };

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  return (
    <Providers>
      <GlobalApiLoader />
      {isAuthRoute ? (
        <Box className="auth-surface">{children}</Box>
      ) : !authChecked ? (
        <Loading fullScreen message="Loading ..." />
      ) : (
        <Box className="workspace-frame">
          <Box component="aside" className="workspace-sidebar">
            <Brand />
            <Typography className="workspace-nav-label">{isAdmin ? "ADMINISTRATION" : isHR ? "HR WORKSPACE" : "WORKSPACE"}</Typography>
            <Stack component="nav" aria-label="Workspace navigation" spacing={0.5} className="workspace-nav">
              {navigationItems.map((item) => {
                const active = item.href === activeNavigationHref;
                return (
                  <Button
                    key={item.href}
                    component={Link}
                    href={item.href}
                    className={`workspace-nav-item${active ? " is-active" : ""}`}
                    startIcon={item.icon}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Stack>
            <Box className="workspace-sidebar-spacer" />
            <Box className="workspace-side-note">
              <span className="workspace-side-note-icon"><AutoAwesomeRoundedIcon fontSize="small" /></span>
              <Typography variant="subtitle2">{isAdmin ? "Account access" : isHR ? "Candidate insights" : "Your next move"}</Typography>
              <Typography variant="caption">{isAdmin ? "Review account activity and access." : isHR ? "Explore candidate profiles and activity." : "Small steps make a resilient career."}</Typography>
              <Button component={Link} href={isAdmin ? "/admin/users" : isHR ? "/hr/candidates" : "/career"} className="workspace-note-link">
                {isAdmin ? "Manage users" : isHR ? "View candidates" : "View your path"}
              </Button>
            </Box>
            <Divider className="workspace-sidebar-divider" />
            <Button
              component={Link}
              href="/profile"
              className={`workspace-profile-link${pathname.startsWith("/profile") ? " is-active" : ""}`}
              startIcon={<Avatar className="workspace-avatar">{user?.name?.charAt(0) || "U"}</Avatar>}
              aria-label={`Open profile for ${user?.name || "your account"}`}
            >
              <span className="workspace-profile-copy">
                <Typography variant="subtitle2">{user?.name || "Your profile"}</Typography>
                <Typography variant="caption">Manage account</Typography>
              </span>
              <PersonRoundedIcon className="workspace-profile-arrow" />
            </Button>
          </Box>

          <Box className="workspace-main">
            <Box component="header" className="workspace-topbar">
              <Box className="workspace-mobile-brand"><Brand /></Box>
              <Box className="workspace-breadcrumb">
                <Typography variant="body2">Workspace</Typography>
                <span>/</span>
                <Typography variant="body2" className="workspace-current-page">
                  {[...navigationItems].sort((a, b) => b.href.length - a.href.length).find((item) =>
                    pathname === item.href || pathname.startsWith(`${item.href}/`)
                  )?.label || (pathname.startsWith("/profile") ? "Profile" : "AIMarg")}
                </Typography>
              </Box>
              <Box className="workspace-topbar-actions">
                <Tooltip title="Notifications">
                  <IconButton className="workspace-icon-button" aria-label="Notifications" onClick={(event) => void openNotifications(event)}>
                    <Badge badgeContent={unreadCount} color="secondary" max={9}>
                      <NotificationsNoneRoundedIcon />
                    </Badge>
                  </IconButton>
                </Tooltip>
                <Tooltip title="Sign out">
                  <IconButton className="workspace-icon-button workspace-logout" onClick={handleLogout} aria-label="Sign out">
                    <LogoutRoundedIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            <Menu
              anchorEl={notificationAnchor}
              open={Boolean(notificationAnchor)}
              onClose={() => setNotificationAnchor(null)}
              slotProps={{ paper: { className: "notification-menu" } }}
            >
              <Box className="notification-menu-heading">
                <Typography variant="subtitle1">Notifications</Typography>
                <Typography variant="caption">{unreadCount ? `${unreadCount} unread` : "You are all caught up"}</Typography>
              </Box>
              {notificationsLoading ? (
                <MenuItem disabled>Loading notifications...</MenuItem>
              ) : notificationError ? (
                <MenuItem disabled>{notificationError}</MenuItem>
              ) : notifications.length === 0 ? (
                <MenuItem disabled>No notifications yet</MenuItem>
              ) : notifications.slice(0, 8).map((notification) => (
                <Box key={notification._id} className={`notification-menu-entry${notification.read ? " is-read" : ""}`}>
                  <MenuItem onClick={() => void handleNotificationClick(notification)} className={`notification-menu-item${notification.read ? " is-read" : ""}`}>
                    <span className="notification-status" />
                    <span className="notification-copy">
                      <strong>{notification.title}</strong>
                      <span>{notification.body}</span>
                      <small>{new Date(notification.createdAt).toLocaleDateString()}</small>
                    </span>
                  </MenuItem>
                  {notification.commentId && notification.targetType && notification.targetId && (
                    <Box className="notification-reply-area">
                      {replyingNotificationId === notification._id ? (
                        <Box component="form" onSubmit={(event) => void handleNotificationReply(event, notification)} className="notification-reply-form">
                          <TextField
                            size="small"
                            fullWidth
                            value={notificationReply}
                            onChange={(event) => setNotificationReply(event.target.value)}
                            placeholder="Write a reply..."
                            slotProps={{ htmlInput: { maxLength: 500, "aria-label": "Write a notification reply" } }}
                          />
                          <Button size="small" type="submit" disabled={!notificationReply.trim()}>
                            Send
                          </Button>
                        </Box>
                      ) : (
                        <Button
                          size="small"
                          onClick={() => {
                            setReplyingNotificationId(notification._id);
                            setNotificationReply("");
                          }}
                        >
                          Reply
                        </Button>
                      )}
                    </Box>
                  )}
                </Box>
              ))}
            </Menu>
            <Box component="main" className="workspace-content">
              {children}
            </Box>
          </Box>

          <Box component="nav" aria-label="Mobile workspace navigation" className={`workspace-mobile-nav${isAdmin ? " is-admin-nav" : isHR ? " is-hr-nav" : " is-user-nav"}`}>
            {mobileNavigationItems.map((item) => {
              const active = item.href === activeNavigationHref;
              return (
                <Link key={item.href} href={item.href} className={`workspace-mobile-item${active ? " is-active" : ""}`} aria-current={active ? "page" : undefined}>
                  {item.icon}
                  <span>{item.label === "Overview" ? "Home" : item.label === "Career path" ? "Career" : item.label}</span>
                </Link>
              );
            })}
          </Box>
        </Box>
      )}
    </Providers>
  );
}