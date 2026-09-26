import apiClient from "./api";
import type { CareerJourney, CareerMilestone } from "@/types/api";

export async function getCareerJourney(): Promise<CareerJourney> {
  const { data } = await apiClient.get<{ data: CareerJourney }>("/career/journey");
  return data.data;
}

export async function updateCareerJourney(milestones: CareerMilestone[]): Promise<CareerJourney> {
  const { data } = await apiClient.patch<{ data: CareerJourney }>("/career/journey", { milestones });
  return data.data;
}

export async function getCareerRecommendations(): Promise<string[]> {
  const { data } = await apiClient.get<{ data: string[] }>("/career/recommendations");
  return data.data;
}
