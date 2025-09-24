export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
// Minimal real-world chat example types (shared by frontend and worker)
export interface User {
  id: string;
  name: string;
}
export interface Chat {
  id: string;
  title: string;
}
export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  text: string;
  ts: number; // epoch millis
}
// F1 Fantasy Game Types
export interface F1Driver {
  id: string;
  name: string;
  price: number;
  team: string;
}
export interface F1Constructor {
  id: string;
  name: string;
  price: number;
}
export interface FantasyTeam {
  userId: string;
  driverIds: string[];
  constructorId: string | null;
  points: number;
}
export interface RaceResult {
  driverId: string;
  position: number;
  fastestLap: boolean;
  driverOfTheDay: boolean;
  positionsGained: number;
}
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  points: number;
}