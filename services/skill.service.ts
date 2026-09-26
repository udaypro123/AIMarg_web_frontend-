import apiClient from "./api";
import type { Skill } from "@/types/api";

export async function getSkills(): Promise<Skill[]> {
  const { data } = await apiClient.get<{ data: Skill[] }>("/skills");
  return data.data;
}
