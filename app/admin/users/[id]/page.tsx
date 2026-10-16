"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Alert, Avatar, Box, Button, Chip, CircularProgress, Paper, Stack, TextField, Typography } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import LaunchRoundedIcon from "@mui/icons-material/LaunchRounded";
import ReplyRoundedIcon from "@mui/icons-material/ReplyRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import Loading from "@/components/common/Loading";
import AdminAccess from "../../_components/AdminAccess";
import {
  addAdminUserComment,
  getAdminUser,
  getAdminUserComments,
  getUserInteractionSummaries,
  toggleAdminUserLike,
} from "@/services/admin.service";
import { getRequestErrorMessage } from "@/services/api";
import type { User, UserComment } from "@/types/api";

function safeExternalUrl(value?: string) {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

function DetailField({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <Box className="admin-detail-field">
      <Typography className="admin-detail-label">{label}</Typography>
      <Typography className="admin-detail-value">{value}</Typography>
    </Box>
  );
}

function AdminUserDetail({ userId }: { userId: string }) {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadedUserId, setLoadedUserId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [comments, setComments] = useState<UserComment[]>([]);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [likedByMe, setLikedByMe] = useState(false);
  const [loadingInteractions, setLoadingInteractions] = useState(true);
  const [interactionError, setInteractionError] = useState("");
  const [commentText, setCommentText] = useState("");
  const [replyTarget, setReplyTarget] = useState<UserComment | null>(null);
  const [sendingComment, setSendingComment] = useState(false);
  const [updatingLike, setUpdatingLike] = useState(false);

  useEffect(() => {
    let active = true;
    getAdminUser(userId)
      .then(async (data) => {
        if (!active) return;
        setLoadingInteractions(true);
        setError("");
        setInteractionError("");
        setComments([]);
        setLikeCount(0);
        setCommentCount(0);
        setLikedByMe(false);
        setProfile(data);
        const targetId = data._id || userId;
        const [summaryResult, commentsResult] = await Promise.allSettled([
          getUserInteractionSummaries(),
          getAdminUserComments(targetId),
        ]);
        if (!active) return;
        const summary = summaryResult.status === "fulfilled"
          ? summaryResult.value.find((item) => item.targetUserId === targetId)
          : undefined;
        if (summary) {
          setLikeCount(summary.likeCount);
          setCommentCount(summary.commentCount);
          setLikedByMe(summary.likedByMe);
        }
        if (commentsResult.status === "fulfilled") {
          setComments(commentsResult.value);
          setCommentCount(commentsResult.value.length);
        }
        if (summaryResult.status === "rejected" || commentsResult.status === "rejected") {
          const requestError = summaryResult.status === "rejected"
            ? summaryResult.reason
            : commentsResult.status === "rejected" ? commentsResult.reason : undefined;
          setInteractionError(getRequestErrorMessage(requestError, "Some community activity could not be loaded. Please refresh the page to try again."));
        }
      })
      .catch((requestError: unknown) => {
        if (active) setError(getRequestErrorMessage(requestError, "This user profile could not be loaded."));
      })
      .finally(() => {
        if (active) {
          setLoading(false);
          setLoadingInteractions(false);
          setLoadedUserId(userId);
        }
      });
    return () => {
      active = false;
    };
  }, [userId]);

  const handleLike = async () => {
    if (!profile?._id || updatingLike) return;
    setUpdatingLike(true);
    setInteractionError("");
    try {
      const result = await toggleAdminUserLike(profile._id);
      setLikedByMe(result.liked);
      setLikeCount((current) => Math.max(0, current + (result.liked ? 1 : -1)));
    } catch (requestError: unknown) {
      setInteractionError(getRequestErrorMessage(requestError, "The like could not be updated. Please try again."));
    } finally {
      setUpdatingLike(false);
    }
  };

  const handleComment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const content = commentText.trim();
    if (!profile?._id || !content || sendingComment) return;
    setSendingComment(true);
    setInteractionError("");
    try {
      const created = await addAdminUserComment(profile._id, content, replyTarget?._id);
      setComments((current) => [...current, created]);
      setCommentCount((current) => current + 1);
      setCommentText("");
      setReplyTarget(null);
    } catch (requestError: unknown) {
      setInteractionError(getRequestErrorMessage(requestError, "Your comment or reply could not be posted. Please try again."));
    } finally {
      setSendingComment(false);
    }
  };

  if (loading || loadedUserId !== userId) return <Box className="admin-loading"><Loading message="Loading user profile..." /></Box>;
  if (error || !profile) return <Alert severity="error">{error || "User not found."}</Alert>;

  const linkedinUrl = safeExternalUrl(profile.linkedinUrl);
  const githubUrl = safeExternalUrl(profile.githubUrl);
  const renderCommentComposer = (isReply: boolean) => (
    <Box component="form" onSubmit={handleComment} className={isReply ? "admin-thread-form is-inline-reply" : "admin-thread-form"}>
      {isReply && replyTarget && (
        <Box className="admin-reply-context">
          <Typography>Replying to {replyTarget.userName}</Typography>
          <Button
            className="admin-reply-cancel"
            size="small"
            variant="outlined"
            color="error"
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
        placeholder={
          isReply && replyTarget
            ? `Reply to ${replyTarget.userName}`
            : "Write a comment"
        }
        fullWidth
        multiline
        minRows={2}
        maxRows={5}
        autoFocus={isReply}
        sx={{
          "& .MuiInputBase-input": {
            color: "#000000",
          },
        }}
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
        disabled={sendingComment || !commentText.trim() || loadingInteractions}
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
          style={{ marginLeft: depth ? `${Math.min(depth, 5) * 18}px` : 0 }}
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
    <Stack spacing={3}>
      <Box className="admin-page-heading">
        <Box>
          <Typography className="page-eyebrow">ADMINISTRATION / USER PROFILE</Typography>
          <Typography variant="h1" className="page-title">User details</Typography>
        </Box>
        <Button component={Link} href="/admin/users" variant="outlined" startIcon={<ArrowBackRoundedIcon />}>Back to users</Button>
      </Box>

      <Paper className="admin-user-profile-header" elevation={0}>
        <Avatar className="admin-profile-avatar">{profile.name?.charAt(0).toUpperCase() || "U"}</Avatar>
        <Box className="admin-profile-identity">
          <Typography variant="h2">{profile.name}</Typography>
          <Typography>{profile.email}</Typography>
          <Box className="admin-profile-badges">
            <Chip size="small" label={profile.roles?.[0] || "USER"} className="admin-role-pill" />
            <Chip size="small" label={profile.isBlocked ? "Blocked" : "Active"} className={profile.isBlocked ? "admin-status-chip is-blocked" : "admin-status-chip"} />
          </Box>
        </Box>
        <Typography className="admin-joined-date">Joined {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "-"}</Typography>
      </Paper>

      <Box className="admin-detail-grid">
        <Paper className="admin-detail-section" elevation={0}>
          <Typography className="admin-section-title">Contact information</Typography>
          <Stack spacing={2}>
            <DetailField label="Email" value={profile.email} />
            <DetailField label="Country" value={profile.country} />
          </Stack>
        </Paper>

        <Paper className="admin-detail-section" elevation={0}>
          <Typography className="admin-section-title">Professional details</Typography>
          <Box className="admin-detail-fields-grid">
            <DetailField label="Current role" value={profile.currentRole} />
            <DetailField label="Company" value={profile.company} />
            <DetailField label="Previous role" value={profile.previousRole} />
            <DetailField label="Previous company" value={profile.previousCompany} />
            <DetailField label="Experience" value={profile.experience} />
          </Box>
        </Paper>

        <Paper className="admin-detail-section" elevation={0}>
          <Typography className="admin-section-title">Job description</Typography>
          <Typography className={profile.jobDescription ? "admin-detail-paragraph" : "admin-no-data"}>
            {profile.jobDescription || "No job description provided."}
          </Typography>
        </Paper>

        <Paper className="admin-detail-section" elevation={0}>
          <Typography className="admin-section-title">Skills</Typography>
          {profile.skills?.length ? (
            <Box className="admin-skill-list">{profile.skills.map((skill) => <Chip key={skill} label={skill} size="small" />)}</Box>
          ) : <Typography className="admin-no-data">No skills listed.</Typography>}
        </Paper>

        <Paper className="admin-detail-section" elevation={0}>
          <Typography className="admin-section-title">Online profiles</Typography>
          <Box className="admin-profile-links">
            {linkedinUrl && <Button component="a" href={linkedinUrl} target="_blank" rel="noopener noreferrer" variant="outlined" endIcon={<LaunchRoundedIcon />}>LinkedIn</Button>}
            {githubUrl && <Button component="a" href={githubUrl} target="_blank" rel="noopener noreferrer" variant="outlined" endIcon={<LaunchRoundedIcon />}>GitHub</Button>}
            {!linkedinUrl && !githubUrl && <Typography className="admin-no-data">No public profiles listed.</Typography>}
          </Box>
        </Paper>

        {profile.resume && (
          <Paper className="admin-detail-section admin-resume-note" elevation={0}>
            <Typography className="admin-section-title">Resume</Typography>
            <Typography className="admin-detail-paragraph">A resume is on file. It is stored privately and is not available through a public link.</Typography>
          </Paper>
        )}
      </Box>

      <Paper className="admin-detail-section admin-user-community" elevation={0}>
        <Box className="admin-community-heading">
          <Box>
            <Typography className="admin-section-title">Community activity</Typography>
            <Typography className="admin-community-subtitle">Likes, comments, and replies on this profile.</Typography>
          </Box>
          <Button
            className={likedByMe ? "admin-detail-like is-liked" : "admin-detail-like"}
            onClick={() => void handleLike()}
            disabled={updatingLike || loadingInteractions}
            startIcon={updatingLike ? <CircularProgress size={17} /> : likedByMe ? <FavoriteRoundedIcon /> : <FavoriteBorderRoundedIcon />}
          >
            {likeCount} {likeCount === 1 ? "like" : "likes"}
          </Button>
        </Box>

        {interactionError && <Alert severity="error" onClose={() => setInteractionError("")}>{interactionError}</Alert>}

        <Typography className="admin-comments-heading">
          Comments and replies ({loadingInteractions ? "…" : commentCount})
        </Typography>


        {loadingInteractions ? (
          <Box className="admin-thread-loading"><CircularProgress size={22} /></Box>
        ) : comments.length ? (
          <Box className="admin-thread-list">
            {renderCommentBranch(null)}
            {comments.some((comment) => comment.parentCommentId && !comments.some((parent) => parent._id === comment.parentCommentId)) && (
              <Typography className="admin-thread-orphan-note">Replies whose original comment is unavailable are shown as top-level comments.</Typography>
            )}
          </Box>
        ) : (
          <Typography className="admin-no-data admin-thread-empty">No comments yet. Start the conversation below.</Typography>
        )}
        {!replyTarget && !loadingInteractions && renderCommentComposer(false)}
      </Paper>
    </Stack>
  );
}

export default function AdminUserDetailPage() {
  const params = useParams<{ id: string }>();
  const userId = Array.isArray(params.id) ? params.id[0] : params.id;
  return <AdminAccess>{() => <AdminUserDetail userId={userId} />}</AdminAccess>;
}
