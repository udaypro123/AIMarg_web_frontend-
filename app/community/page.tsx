"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { createComment, createPost, deletePost, getComments, getPosts, togglePostLike, updatePost } from "@/services/community.service";
import { getProfile } from "@/services/user.service";
import type { Comment, Post, User } from "@/types/api";

const categories = ["AI impact", "Career change", "Learning", "Workplace", "General"];

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingPost, setSavingPost] = useState(false);
  const [savingComment, setSavingComment] = useState(false);
  const [likingPost, setLikingPost] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.allSettled([getPosts(), getProfile()]).then((results) => {
      if (!active) return;
      if (results[0].status === "fulfilled") setPosts(results[0].value);
      else setError("Community posts could not be loaded.");
      if (results[1].status === "fulfilled") setProfile(results[1].value);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const visiblePosts = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return posts;
    return posts.filter((post) => [post.title, post.content, post.user.name, post.category || ""].some((value) => value.toLowerCase().includes(search)));
  }, [posts, query]);

  const openCreateDialog = () => {
    setEditingPost(null);
    setTitle("");
    setContent("");
    setCategory(categories[0]);
    setError("");
    setDialogOpen(true);
  };

  const openEditDialog = (post: Post) => {
    setEditingPost(post);
    setTitle(post.title);
    setContent(post.content);
    setCategory(post.category || categories[0]);
    setError("");
    setDialogOpen(true);
  };

  const submitPost = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSavingPost(true);
    setError("");
    try {
      if (editingPost) {
        const updated = await updatePost(editingPost._id, { title, content, category });
        setPosts((current) => current.map((post) => post._id === updated._id ? updated : post));
      } else {
        const created = await createPost({ title, content, category });
        setPosts((current) => [created, ...current]);
      }
      setDialogOpen(false);
    } catch {
      setError("Your post could not be saved. Please try again.");
    } finally {
      setSavingPost(false);
    }
  };

  const handleLike = async (post: Post) => {
    if (!profile?._id || likingPost) return;
    setLikingPost(post._id);
    try {
      const result = await togglePostLike(post._id);
      setPosts((current) => current.map((item) => {
        if (item._id !== post._id) return item;
        const likes = result.liked
          ? [...item.likes.filter((id) => id !== profile._id), profile._id!]
          : item.likes.filter((id) => id !== profile._id);
        return { ...item, likes };
      }));
    } catch {
      setError("Your reaction could not be saved.");
    } finally {
      setLikingPost(null);
    }
  };

  const openComments = async (post: Post) => {
    setSelectedPost(post);
    setCommentText("");
    setLoadingComments(true);
    try {
      setComments(await getComments(post._id));
    } catch {
      setError("Comments could not be loaded.");
    } finally {
      setLoadingComments(false);
    }
  };

  const submitComment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedPost || !commentText.trim()) return;
    setSavingComment(true);
    try {
      const created = await createComment(selectedPost._id, commentText.trim());
      setComments((current) => [...current, created]);
      setCommentText("");
      setPosts((current) => current.map((post) => post._id === selectedPost._id ? { ...post, commentCount: post.commentCount + 1 } : post));
      setSelectedPost((current) => current ? { ...current, commentCount: current.commentCount + 1 } : current);
    } catch {
      setError("Your comment could not be posted.");
    } finally {
      setSavingComment(false);
    }
  };

  const removePost = async (post: Post) => {
    if (!window.confirm("Delete this post and its comments?")) return;
    try {
      await deletePost(post._id);
      setPosts((current) => current.filter((item) => item._id !== post._id));
    } catch {
      setError("This post could not be deleted.");
    }
  };

  return (
    <Stack spacing={3}>
      <Box className="page-heading-row">
        <Box>
          <Typography className="page-eyebrow">PEOPLE IN TRANSITION</Typography>
          <Typography variant="h1" className="page-title">Community</Typography>
          <Typography className="page-subtitle">A place to share what is changing, and what you are learning along the way.</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={openCreateDialog}>Share an update</Button>
      </Box>

      {error && !dialogOpen && !selectedPost && <Alert severity="error" onClose={() => setError("")}>{error}</Alert>}

      <Box className="community-layout">
        <Box className="community-feed-column">
          <Paper className="community-composer" elevation={0}>
            <Avatar className="post-avatar">{profile?.name?.charAt(0).toUpperCase() || "U"}</Avatar>
            <Button className="composer-prompt" onClick={openCreateDialog}>What have you learned about work changing?</Button>
            <IconButton aria-label="Create post" onClick={openCreateDialog}><AddRoundedIcon /></IconButton>
          </Paper>

          {loading ? <Box className="loading-state"><CircularProgress size={25} /></Box> : visiblePosts.length === 0 ? (
            <Paper className="empty-state" elevation={0}>
              <Typography variant="h3">{query ? "No matching updates" : "Be the first to share"}</Typography>
              <Typography variant="body2" color="text.secondary">{query ? "Try a different search." : "Share a lesson, a question, or a small win from your career journey."}</Typography>
              {!query && <Button variant="outlined" onClick={openCreateDialog}>Write the first update</Button>}
            </Paper>
          ) : (
            <Stack spacing={1.5}>
              {visiblePosts.map((post) => {
                const isLiked = Boolean(profile?._id && post.likes.includes(profile._id));
                const isOwner = Boolean(profile?._id && post.user._id === profile._id);
                return (
                  <Paper key={post._id} className="community-post" elevation={0}>
                    <Box className="post-header">
                      <Avatar className="post-avatar">{post.user.name?.charAt(0).toUpperCase() || "U"}</Avatar>
                      <Box className="post-author">
                        <Typography variant="subtitle1">{post.user.name}</Typography>
                        <Typography variant="caption">{[post.user.currentRole, post.user.company].filter(Boolean).join(" at ") || "AIMarg member"} | {new Date(post.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</Typography>
                      </Box>
                      {isOwner && <Box className="post-owner-actions">
                        <IconButton aria-label="Edit post" onClick={() => openEditDialog(post)} size="small"><EditRoundedIcon fontSize="small" /></IconButton>
                        <IconButton aria-label="Delete post" onClick={() => void removePost(post)} size="small"><DeleteOutlineRoundedIcon fontSize="small" /></IconButton>
                      </Box>}
                    </Box>
                    <Typography className="post-category">{post.category || "General"}</Typography>
                    <Typography variant="h3" className="post-title">{post.title}</Typography>
                    <Typography className="post-content">{post.content}</Typography>
                    {post.user.skills && post.user.skills.length > 0 && <Box className="post-skills">{post.user.skills.slice(0, 4).map((skill) => <span key={skill}>{skill}</span>)}</Box>}
                    <Box className="post-footer">
                      <Button className={isLiked ? "post-action is-liked" : "post-action"} onClick={() => void handleLike(post)} disabled={!profile?._id || likingPost === post._id} startIcon={isLiked ? <FavoriteRoundedIcon /> : <FavoriteBorderRoundedIcon />}>
                        {post.likes.length} {post.likes.length === 1 ? "like" : "likes"}
                      </Button>
                      <Button className="post-action" onClick={() => void openComments(post)} startIcon={<ChatBubbleOutlineRoundedIcon />}>
                        {post.commentCount} {post.commentCount === 1 ? "comment" : "comments"}
                      </Button>
                    </Box>
                  </Paper>
                );
              })}
            </Stack>
          )}
        </Box>

        <Box className="community-aside">
          <Paper className="community-search-panel" elevation={0}>
            <Typography className="impact-overview-label">FIND A CONVERSATION</Typography>
            <TextField value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search updates" size="small" fullWidth sx={{ mt: 1.5 }} />
            <Typography className="section-caption">Search by topic, person, or skill.</Typography>
          </Paper>
          <Paper className="community-guidelines" elevation={0}>
            <span className="community-aside-mark"><MoreHorizRoundedIcon /></span>
            <Typography variant="subtitle1">Keep it human</Typography>
            <Typography variant="body2">Share what you choose. Personal impact reports stay private to your account.</Typography>
          </Paper>
        </Box>
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <Box component="form" onSubmit={submitPost}>
          <DialogTitle className="dialog-heading">
            <Typography className="page-eyebrow">COMMUNITY NOTE</Typography>
            <Typography variant="h2" className="section-title">{editingPost ? "Edit your update" : "Share an update"}</Typography>
          </DialogTitle>
          <DialogContent className="assessment-form">
            {error && <Alert severity="error">{error}</Alert>}
            <TextField label="Title" value={title} onChange={(event) => setTitle(event.target.value)} required fullWidth />
            <TextField select label="Topic" value={category} onChange={(event) => setCategory(event.target.value)} fullWidth>
              {categories.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}
            </TextField>
            <TextField label="Your update" value={content} onChange={(event) => setContent(event.target.value)} required multiline minRows={5} fullWidth />
          </DialogContent>
          <DialogActions className="dialog-actions">
            <Button onClick={() => setDialogOpen(false)} color="inherit">Cancel</Button>
            <Button type="submit" variant="contained" startIcon={savingPost ? <CircularProgress size={16} color="inherit" /> : <SendRoundedIcon />} disabled={savingPost || !title.trim() || !content.trim()}>
              {savingPost ? "Posting" : editingPost ? "Save update" : "Share update"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog open={Boolean(selectedPost)} onClose={() => setSelectedPost(null)} fullWidth maxWidth="sm">
        <DialogTitle className="dialog-heading">
          <Typography className="page-eyebrow">DISCUSSION</Typography>
          <Typography variant="h2" className="section-title">{selectedPost?.title || "Comments"}</Typography>
        </DialogTitle>
        <DialogContent className="comment-dialog-content">
          {error && <Alert severity="error" onClose={() => setError("")}>{error}</Alert>}
          {loadingComments ? <Box className="loading-state"><CircularProgress size={24} /></Box> : comments.length === 0 ? (
            <Typography className="comments-empty">No comments yet. Start the conversation.</Typography>
          ) : comments.map((comment) => (
            <Box className="comment-row" key={comment._id}>
              <Avatar className="comment-avatar">{comment.userName?.charAt(0).toUpperCase() || "U"}</Avatar>
              <Box><Typography variant="subtitle2">{comment.userName}</Typography><Typography variant="body2">{comment.content}</Typography></Box>
            </Box>
          ))}
        </DialogContent>
        <DialogActions className="comment-composer-wrap">
          <Box component="form" onSubmit={submitComment} className="comment-composer">
            <TextField value={commentText} onChange={(event) => setCommentText(event.target.value)} placeholder="Write a comment" size="small" fullWidth />
            <IconButton type="submit" color="primary" aria-label="Send comment" disabled={savingComment || !commentText.trim()}>
              {savingComment ? <CircularProgress size={18} /> : <SendRoundedIcon />}
            </IconButton>
          </Box>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
