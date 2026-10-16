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
import ReplyRoundedIcon from "@mui/icons-material/ReplyRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import {
  addAdminUserComment,
  getAdminUserComments,
  toggleAdminUserLike,
} from "@/services/admin.service";
import { getRequestErrorMessage } from "@/services/api";
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
  showFullProfile = true,
}: {
  user: PreviewUser | null;
  open: boolean;
  onClose: () => void;
  onInteractionChange: (userId: string, interaction: InteractionCounts) => void;
  showFullProfile?: boolean;
}) {
  const [comments, setComments] = useState<UserComment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [replyTarget, setReplyTarget] = useState<UserComment | null>(null);
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
      .catch((requestError: unknown) => {
        if (active) setError(getRequestErrorMessage(requestError, "Comments could not be loaded."));
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
    } catch (requestError: unknown) {
      setError(getRequestErrorMessage(requestError, "The like could not be updated. Please try again."));
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
      const created = await addAdminUserComment(user._id || "", content, replyTarget?._id);
      const nextCount = commentCount + 1;
      setComments((current) => [...current, created]);
      setCommentText("");
      setReplyTarget(null);
      setCommentCount(nextCount);
      onInteractionChange(user._id || "", { likeCount, commentCount: nextCount, likedByMe });
    } catch (requestError: unknown) {
      setError(getRequestErrorMessage(requestError, "Your comment or reply could not be posted. Please try again."));
    } finally {
      setSendingComment(false);
    }
  };

  const renderCommentComposer = (isReply: boolean) => (
    <Box component="form" onSubmit={handleComment} className={isReply ? "admin-thread-form is-inline-reply admin-preview-thread-form" : "admin-thread-form admin-preview-thread-form"}>
      {isReply && replyTarget && (
        <Box className="admin-reply-context">
          <Typography>Replying to {replyTarget.userName}</Typography>
          <Button
            className="admin-reply-cancel"
            size="small"
            variant="outlined"
            onClick={() => {
              setReplyTarget(null);
              setCommentText("");
            }}
          >
            Cancel reply
          </Button>
        </Box>
      )}
      <TextField
        value={commentText}
        onChange={(event) => setCommentText(event.target.value)}
        placeholder={isReply && replyTarget ? `Reply to ${replyTarget.userName}` : "Write a comment"}
        fullWidth
        multiline
        minRows={2}
        maxRows={5}
        autoFocus={isReply}
        slotProps={{
          htmlInput: {
            maxLength: 500,
            "aria-label": isReply ? "Write a reply" : "Write a comment",
          },
        }}
      />
      <Button
        type="submit"
        variant="contained"
        disabled={sendingComment || !commentText.trim() || loadingComments}
        startIcon={sendingComment ? <CircularProgress size={17} color="inherit" /> : <SendRoundedIcon />}
      >
        {isReply ? "Post reply" : "Post comment"}
      </Button>
    </Box>
  );
  const renderCommentBranch = (parentCommentId: string | null, depth = 0): React.ReactNode =>
    comments
      .filter((comment) => {
        const actualParentId = comments.some((item) => item._id === comment.parentCommentId)
          ? comment.parentCommentId || null
          : null;
        return actualParentId === parentCommentId;
      })
      .map((comment) => (
        <Box
          className={depth ? "admin-thread-branch is-reply" : "admin-thread-branch"}
          key={comment._id}
          style={{ marginLeft: depth ? `${Math.min(depth, 5) * 12}px` : 0 }}
        >
          <Paper className="admin-thread-comment" elevation={0}>
            <Box className="admin-thread-comment-heading">
              <Typography className="admin-thread-author">{comment.userName}</Typography>
              <Typography className="admin-thread-date">{new Date(comment.createdAt).toLocaleString()}</Typography>
            </Box>
            <Typography className="admin-thread-content">{comment.content}</Typography>
            <Button
              className="admin-thread-reply"
              size="small"
              startIcon={<ReplyRoundedIcon />}
              onClick={() => {
                setCommentText("");
                setReplyTarget(comment);
              }}
            >
              Reply
            </Button>
            {replyTarget?._id === comment._id && renderCommentComposer(true)}
          </Paper>
          {renderCommentBranch(comment._id, depth + 1)}
        </Box>
      ));

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
          {showFullProfile && <Button component={Link} href={`/admin/users/${user._id}`} variant="outlined" sx={{ color: "black !important" }}>Full profile</Button>}
        </Box>

        {error && <Alert severity="error" onClose={() => setError("")}>{error}</Alert>}

        <Paper className="admin-detail-section" elevation={0}>
          <Typography className="admin-section-title">Contact & career</Typography>
          <Box className="admin-detail-fields-grid">
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

        <Box className="admin-preview-profile-grid">
          <Paper className="admin-detail-section admin-preview-social" elevation={0}>
            <Typography className="admin-section-title">Community interactions
              <Button style={{float: "right", fontSize:"1.3rem"}} className={likedByMe ? "admin-preview-like is-liked" : "admin-preview-like"} onClick={() => void handleLike()} disabled={updatingLike} startIcon={updatingLike ? <CircularProgress size={16} /> : likedByMe ? <FavoriteRoundedIcon style={{fontSize: "1.3rem"}} /> : <FavoriteBorderRoundedIcon />}>
                {likeCount} {likeCount === 1 ? "like" : "likes"}
              </Button>
            </Typography>

            <Typography className="admin-comments-heading">Comments ({commentCount})</Typography>
            <Box className="admin-preview-comments">
              {loadingComments ? <CircularProgress size={20} /> : comments.length ? renderCommentBranch(null) : <Typography className="admin-no-data">No comments yet.</Typography>}
            </Box>
            {!replyTarget && !loadingComments && renderCommentComposer(false)}
          </Paper>


        </Box>
      </DialogContent>
    </Dialog>
  );
}
