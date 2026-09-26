import apiClient from "./api";
import type { Comment, Post } from "@/types/api";

export async function getPosts(): Promise<Post[]> {
  const { data } = await apiClient.get<{ data: Post[] }>("/posts");
  return data.data;
}

export async function getMyPosts(): Promise<Post[]> {
  const { data } = await apiClient.get<{ data: Post[] }>("/posts/me");
  return data.data;
}

export async function createPost(post: Pick<Post, "title" | "content"> & { category?: string }): Promise<Post> {
  const { data } = await apiClient.post<{ data: Post }>("/posts", post);
  return data.data;
}

export async function updatePost(id: string, post: Partial<Pick<Post, "title" | "content" | "category">>): Promise<Post> {
  const { data } = await apiClient.patch<{ data: Post }>(`/posts/${id}`, post);
  return data.data;
}

export async function deletePost(id: string): Promise<void> {
  await apiClient.delete(`/posts/${id}`);
}

export async function togglePostLike(postId: string): Promise<{ liked: boolean }> {
  const { data } = await apiClient.post<{ data: { liked: boolean } }>("/likes", { postId });
  return data.data;
}

export async function getComments(postId: string): Promise<Comment[]> {
  const { data } = await apiClient.get<{ data: Comment[] }>(`/comments/${postId}`);
  return data.data;
}

export async function createComment(postId: string, content: string): Promise<Comment> {
  const { data } = await apiClient.post<{ data: Comment }>("/comments", { postId, content });
  return data.data;
}
