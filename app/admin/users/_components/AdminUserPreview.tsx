"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import LaunchRoundedIcon from "@mui/icons-material/LaunchRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import {
  addAdminUserComment,
  getAdminUserComments,
  toggleAdminUserLike,
} from "@/services/admin.service";
import type { User, UserComment } from "@/types/api";

type PreviewUser = User & { likeCount: number; commentCount: number; likedByMe: boolean };
type InteractionCounts = Pick<PreviewUser, "likeCount" | "commentCount" | "likedByMe">;

function safeExternalUrl(value?: string) {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

function PreviewField({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <Box className="admin-preview-field">
      <Typography className="admin-detail-label">{label}</Typography>
      <Typography className="admin-detail-value">{value}</Typography>
    </Box>
  );
}

export default function AdminUserPreview({
  user,
  open,
  onClose,
  onInteractionChange,
}: {
  user: PreviewUser | null;
  open: boolean;
  onClose: () => void;
  onInteractionChange: (userId: string, interaction: InteractionCounts) => void;
}) {
  const [comments, setComments] = useState<UserComment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [loadingComments, setLoadingComments] = useState(true);
  const [sendingComment, setSendingComment] = useState(false);
  const [updatingLike, setUpdatingLike] = useState(false);
  const [likeCount, setLikeCount] = useState(user?.likeCount || 0);
  const [commentCount, setCommentCount] = useState(user?.commentCount || 0);
  const [likedByMe, setLikedByMe] = useState(user?.likedByMe || false);
  const [error, setError] = useState("");
  const userId = user?._id;

  useEffect(() => {
    if (!userId) return;
    let active = true;
    getAdminUserComments(userId)
      .then((result) => {
        if (active) setComments(result);
      })
      .catch(() => {
        if (active) setError("Comments could not be loaded.");
      })
      .finally(() => {
        if (active) setLoadingComments(false);
      });
    return () => {
      active = false;
    };
  }, [userId]);

  if (!user) return null;

  const linkedinUrl = safeExternalUrl(user.linkedinUrl);
  const githubUrl = safeExternalUrl(user.githubUrl);

  const handleLike = async () => {
    if (updatingLike) return;
    setUpdatingLike(true);
    setError("");
    try {
      const result = await toggleAdminUserLike(user._id || "");
      const nextLikeCount = Math.max(0, likeCount + (result.liked ? 1 : -1));
      setLikeCount(nextLikeCount);
      setLikedByMe(result.liked);
      onInteractionChange(user._id || "", { likeCount: nextLikeCount, commentCount, likedByMe: result.liked });
    } catch {
      setError("The like could not be updated. Please try again.");
    } finally {
      setUpdatingLike(false);
    }
  };

  const handleComment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const content = commentText.trim();
    if (!content || sendingComment) return;
    setSendingComment(true);
    setError("");
    try {
      const created = await addAdminUserComment(user._id || "", content);
      const nextCount = commentCount + 1;
      setComments((current) => [created, ...current]);
      setCommentText("");
      setCommentCount(nextCount);
      onInteractionChange(user._id || "", { likeCount, commentCount: nextCount, likedByMe });
    } catch {
      setError("Your comment could not be posted. Please try again.");
    } finally {
      setSendingComment(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" className="admin-preview-dialog">
      <DialogContent className="admin-preview-content">
        <Box className="admin-preview-topbar">
          <Typography className="page-eyebrow">ACCOUNT PREVIEW</Typography>
          <IconButton onClick={onClose} aria-label="Close user preview"><CloseRoundedIcon /></IconButton>
        </Box>

        <Box className="admin-preview-heading">
          <Avatar className="admin-profile-avatar">{user.name?.charAt(0).toUpperCase() || "U"}</Avatar>
          <Box className="admin-profile-identity">
            <Typography variant="h2">{user.name}</Typography>
            <Typography>{[user.currentRole, user.company].filter(Boolean).join(" at ") || user.roles?.[0] || "USER"}</Typography>
            <Box className="admin-profile-badges">
              <Chip size="small" label={user.isBlocked ? "Blocked" : "Active"} className={user.isBlocked ? "admin-status-chip is-blocked" : "admin-status-chip"} />
              <Typography className="admin-preview-email">{user.email}</Typography>
            </Box>
          </Box>
          <Button component={Link} href={`/admin/users/${user._id}`} variant="outlined">Full profile</Button>
        </Box>

        {error && <Alert severity="error" onClose={() => setError("")}>{error}</Alert>}

        <Box className="admin-preview-profile-grid">
          <Paper className="admin-detail-section" elevation={0}>
            <Typography className="admin-section-title">Contact & career</Typography>
            <Box className="admin-detail-fields-grid">
              <PreviewField label="Mobile" value={user.mobile} />
              <PreviewField label="Profession" value={user.profession} />
              <PreviewField label="Industry" value={user.industry} />
              <PreviewField label="Employment" value={user.employmentStatus} />
              <PreviewField label="Experience" value={user.experience} />
              <PreviewField label="Previous role" value={user.previousRole} />
            </Box>
            {user.jobDescription && <Typography className="admin-detail-paragraph admin-preview-description">{user.jobDescription}</Typography>}
            {user.skills?.length ? <Box className="admin-skill-list admin-preview-skills">{user.skills.slice(0, 8).map((skill) => <Chip key={skill} label={skill} size="small" />)}</Box> : null}
            {(linkedinUrl || githubUrl) && (
              <Box className="admin-profile-links admin-preview-links">
                {linkedinUrl && <Button component="a" href={linkedinUrl} target="_blank" rel="noopener noreferrer" variant="text" endIcon={<LaunchRoundedIcon />}>LinkedIn</Button>}
                {githubUrl && <Button component="a" href={githubUrl} target="_blank" rel="noopener noreferrer" variant="text" endIcon={<LaunchRoundedIcon />}>GitHub</Button>}
              </Box>
            )}
          </Paper>

          <Paper className="admin-detail-section admin-preview-social" elevation={0}>
            <Typography className="admin-section-title">Community interactions</Typography>
            <Button className={likedByMe ? "admin-preview-like is-liked" : "admin-preview-like"} onClick={() => void handleLike()} disabled={updatingLike} startIcon={updatingLike ? <CircularProgress size={16} /> : likedByMe ? <FavoriteRoundedIcon /> : <FavoriteBorderRoundedIcon />}>
              {likeCount} {likeCount === 1 ? "like" : "likes"}
            </Button>
            <Typography className="admin-comments-heading">Comments ({commentCount})</Typography>
            <Box className="admin-preview-comments">
              {loadingComments ? <CircularProgress size={20} /> : comments.length ? comments.map((comment) => (
                <Box className="admin-preview-comment" key={comment._id}>
                  <Typography variant="subtitle2">{comment.userName}</Typography>
                  <Typography variant="body2">{comment.content}</Typography>
                  <Typography variant="caption">{new Date(comment.createdAt).toLocaleDateString()}</Typography>
                </Box>
              )) : <Typography className="admin-no-data">No comments yet.</Typography>}
            </Box>
            <Box component="form" onSubmit={handleComment} className="admin-preview-comment-form">
              <TextField value={commentText} onChange={(event) => setCommentText(event.target.value)} placeholder="Add a comment" size="small" fullWidth multiline maxRows={3} />
              <Button type="submit" variant="contained" disabled={sendingComment || !commentText.trim()} startIcon={sendingComment ? <CircularProgress size={15} color="inherit" /> : <SendRoundedIcon />}>
                Post
              </Button>
            </Box>
          </Paper>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
