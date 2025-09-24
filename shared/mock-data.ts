import type { User, Chat, ChatMessage, F1Driver, F1Constructor, RaceResult } from './types';
export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'User A' },
  { id: 'u2', name: 'User B' }
];
export const MOCK_CHATS: Chat[] = [
  { id: 'c1', title: 'General' },
];
export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  { id: 'm1', chatId: 'c1', userId: 'u1', text: 'Hello', ts: Date.now() },
];
// F1 Fantasy Mock Data
export const MOCK_DRIVERS: F1Driver[] = [
  { id: 'd1', name: 'Max Verstappen', price: 30.0, team: 'Red Bull Racing' },
  { id: 'd2', name: 'Lando Norris', price: 23.1, team: 'McLaren' },
  { id: 'd3', name: 'Charles Leclerc', price: 21.3, team: 'Ferrari' },
  { id: 'd4', name: 'Oscar Piastri', price: 19.5, team: 'McLaren' },
  { id: 'd5', name: 'Carlos Sainz', price: 19.3, team: 'Ferrari' },
  { id: 'd6', name: 'Lewis Hamilton', price: 18.5, team: 'Mercedes' },
  { id: 'd7', name: 'Sergio Pérez', price: 18.3, team: 'Red Bull Racing' },
  { id: 'd8', name: 'George Russell', price: 17.5, team: 'Mercedes' },
  { id: 'd9', name: 'Fernando Alonso', price: 15.2, team: 'Aston Martin' },
  { id: 'd10', name: 'Yuki Tsunoda', price: 9.8, team: 'RB' },
  { id: 'd11', name: 'Lance Stroll', price: 9.5, team: 'Aston Martin' },
  { id: 'd12', name: 'Daniel Ricciardo', price: 9.0, team: 'RB' },
  { id: 'd13', name: 'Nico Hülkenberg', price: 8.2, team: 'Haas F1 Team' },
  { id: 'd14', name: 'Pierre Gasly', price: 8.0, team: 'Alpine' },
  { id: 'd15', name: 'Alexander Albon', price: 7.5, team: 'Williams' },
  { id: 'd16', name: 'Esteban Ocon', price: 7.2, team: 'Alpine' },
  { id: 'd17', name: 'Kevin Magnussen', price: 6.8, team: 'Haas F1 Team' },
  { id: 'd18', name: 'Zhou Guanyu', price: 6.0, team: 'Sauber' },
  { id: 'd19', name: 'Valtteri Bottas', price: 5.8, team: 'Sauber' },
  { id: 'd20', name: 'Logan Sargeant', price: 5.5, team: 'Williams' },
];
export const MOCK_CONSTRUCTORS: F1Constructor[] = [
  { id: 'c1', name: 'Red Bull Racing', price: 27.9 },
  { id: 'c2', name: 'McLaren', price: 23.8 },
  { id: 'c3', name: 'Ferrari', price: 22.5 },
  { id: 'c4', name: 'Mercedes', price: 19.5 },
  { id: 'c5', name: 'Aston Martin', price: 14.0 },
  { id: 'c6', name: 'RB', price: 10.0 },
  { id: 'c7', name: 'Haas F1 Team', price: 8.5 },
  { id: 'c8', name: 'Alpine', price: 8.2 },
  { id: 'c9', name: 'Williams', price: 7.0 },
  { id: 'c10', name: 'Sauber', price: 6.2 },
];
export const MOCK_RACE_RESULTS: RaceResult[] = [
  // Top 10 finishers
  { driverId: 'd2', position: 1, fastestLap: false, driverOfTheDay: true, positionsGained: 2 }, // Norris
  { driverId: 'd1', position: 2, fastestLap: true, driverOfTheDay: false, positionsGained: 0 }, // Verstappen
  { driverId: 'd3', position: 3, fastestLap: false, driverOfTheDay: false, positionsGained: 1 }, // Leclerc
  { driverId: 'd4', position: 4, fastestLap: false, driverOfTheDay: false, positionsGained: 1 }, // Piastri
  { driverId: 'd5', position: 5, fastestLap: false, driverOfTheDay: false, positionsGained: 0 }, // Sainz
  { driverId: 'd7', position: 6, fastestLap: false, driverOfTheDay: false, positionsGained: -1 }, // Pérez
  { driverId: 'd6', position: 7, fastestLap: false, driverOfTheDay: false, positionsGained: 1 }, // Hamilton
  { driverId: 'd8', position: 8, fastestLap: false, driverOfTheDay: false, positionsGained: 0 }, // Russell
  { driverId: 'd10', position: 9, fastestLap: false, driverOfTheDay: false, positionsGained: 3 }, // Tsunoda
  { driverId: 'd9', position: 10, fastestLap: false, driverOfTheDay: false, positionsGained: -2 }, // Alonso
  // Rest of the grid
  { driverId: 'd13', position: 11, fastestLap: false, driverOfTheDay: false, positionsGained: 2 }, // Hülkenberg
  { driverId: 'd12', position: 12, fastestLap: false, driverOfTheDay: false, positionsGained: 0 }, // Ricciardo
  { driverId: 'd15', position: 13, fastestLap: false, driverOfTheDay: false, positionsGained: 2 }, // Albon
  { driverId: 'd17', position: 14, fastestLap: false, driverOfTheDay: false, positionsGained: 1 }, // Magnussen
  { driverId: 'd14', position: 15, fastestLap: false, driverOfTheDay: false, positionsGained: -3 }, // Gasly
  { driverId: 'd19', position: 16, fastestLap: false, driverOfTheDay: false, positionsGained: 1 }, // Bottas
  { driverId: 'd11', position: 17, fastestLap: false, driverOfTheDay: false, positionsGained: -5 }, // Stroll
  { driverId: 'd16', position: 18, fastestLap: false, driverOfTheDay: false, positionsGained: -2 }, // Ocon
  { driverId: 'd18', position: 19, fastestLap: false, driverOfTheDay: false, positionsGained: 0 }, // Zhou
  { driverId: 'd20', position: 20, fastestLap: false, driverOfTheDay: false, positionsGained: -1 }, // Sargeant
];