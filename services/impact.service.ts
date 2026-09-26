import apiClient from "./api";
import type { ImpactReport } from "@/types/api";

export type NewImpactReport = Omit<ImpactReport, "_id" | "createdAt"> & {
  professionId?: string;
};

export async function getMyImpactReports(): Promise<ImpactReport[]> {
  const { data } = await apiClient.get<{ data: ImpactReport[] }>("/impact/me");
  return data.data;
}

export async function createImpactReport(report: NewImpactReport): Promise<ImpactReport> {
  const { data } = await apiClient.post<{ data: ImpactReport }>("/impact", report);
  return data.data;
}
