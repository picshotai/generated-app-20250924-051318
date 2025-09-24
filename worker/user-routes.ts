import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, ChatBoardEntity, F1DriverEntity, F1ConstructorEntity, FantasyTeamEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import { F1Constructor, FantasyTeam, LeaderboardEntry, RaceResult } from "@shared/types";
import { MOCK_RACE_RESULTS, MOCK_DRIVERS, MOCK_CONSTRUCTORS } from "@shared/mock-data";
const calculateDriverPoints = (result: RaceResult): number => {
  let points = 0;
  const positionPoints: Record<number, number> = { 1: 25, 2: 18, 3: 15, 4: 12, 5: 10, 6: 8, 7: 6, 8: 4, 9: 2, 10: 1 };
  points += positionPoints[result.position] || 0;
  if (result.fastestLap) points += 5;
  if (result.driverOfTheDay) points += 3;
  points += result.positionsGained * 2;
  return points;
};
const calculateTeamPoints = (team: FantasyTeam): number => {
  let totalPoints = 0;
  const driverResults = MOCK_RACE_RESULTS.filter(r => team.driverIds.includes(r.driverId));
  driverResults.forEach(result => {
    totalPoints += calculateDriverPoints(result);
  });
  // Constructor points (sum of points from both of the constructor's drivers)
  const selectedConstructor: F1Constructor | undefined = MOCK_CONSTRUCTORS.find(c => c.id === team.constructorId);
  if (selectedConstructor) {
    const constructorDrivers = MOCK_DRIVERS.filter(d => d.team === selectedConstructor.name);
    const constructorDriverIds = constructorDrivers.map(d => d.id);
    const constructorDriverResults = MOCK_RACE_RESULTS.filter(r => constructorDriverIds.includes(r.driverId));
    constructorDriverResults.forEach(result => {
      totalPoints += calculateDriverPoints(result); // Add points for each of the constructor's drivers
    });
  }
  return totalPoints;
};
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // F1 DATA ROUTES
  app.get('/api/drivers', async (c) => {
    await F1DriverEntity.ensureSeed(c.env);
    const page = await F1DriverEntity.list(c.env);
    return ok(c, page.items);
  });
  app.get('/api/constructors', async (c) => {
    await F1ConstructorEntity.ensureSeed(c.env);
    const page = await F1ConstructorEntity.list(c.env);
    return ok(c, page.items);
  });
  // FANTASY TEAM ROUTES (LIVE)
  app.get('/api/users/:userId/team', async (c) => {
    const { userId } = c.req.param();
    if (!isStr(userId)) return bad(c, 'User ID is required');
    const teamEntity = new FantasyTeamEntity(c.env, userId);
    const team = await teamEntity.getState();
    if (!team.userId) {
      team.userId = userId;
    }
    team.points = calculateTeamPoints(team);
    return ok(c, team);
  });
  app.post('/api/users/:userId/team', async (c) => {
    const { userId } = c.req.param();
    if (!isStr(userId)) return bad(c, 'User ID is required');
    try {
      const body = await c.req.json<{ driverIds: string[], constructorId: string | null }>();
      if (!Array.isArray(body.driverIds) || (body.constructorId !== null && typeof body.constructorId !== 'string')) {
        return bad(c, 'Invalid team data format');
      }
      const teamEntity = new FantasyTeamEntity(c.env, userId);
      const currentTeam = await teamEntity.getState();
      const newTeamData: FantasyTeam = {
        ...currentTeam,
        userId,
        driverIds: body.driverIds,
        constructorId: body.constructorId,
      };
      newTeamData.points = calculateTeamPoints(newTeamData);
      await teamEntity.save(newTeamData);
      return ok(c, newTeamData);
    } catch (error) {
      console.error('Failed to save team:', error);
      return bad(c, 'Failed to parse request body or save team');
    }
  });
  // LEADERBOARD ROUTE
  app.get('/api/leagues/leaderboard', async (c) => {
    // In a real app, you'd fetch all users' teams. Here we mock it.
    const mockUserIds = ['user_mock_id', 'user_2', 'user_3', 'user_4', 'user_5'];
    const userNames: Record<string, string> = {
      'user_mock_id': 'You',
      'user_2': 'PixelPundit',
      'user_3': 'SynthwaveRacer',
      'user_4': 'GridGlider',
      'user_5': 'NeonKnight'
    };
    const leaderboard: Omit<LeaderboardEntry, 'rank'>[] = [];
    for (const userId of mockUserIds) {
      const teamEntity = new FantasyTeamEntity(c.env, userId);
      let team = await teamEntity.getState();
      // Create a mock team if one doesn't exist for scoring purposes
      if (team.driverIds.length === 0) {
        team = {
          userId,
          driverIds: MOCK_DRIVERS.slice(userId.length % 15, (userId.length % 15) + 5).map(d => d.id),
          constructorId: 'c' + ((userId.length % 10) + 1),
          points: 0
        };
      }
      const points = calculateTeamPoints(team);
      leaderboard.push({ userId, userName: userNames[userId] || 'Anonymous', points });
    }
    const sortedLeaderboard = leaderboard
      .sort((a, b) => b.points - a.points)
      .map((entry, index) => ({ ...entry, rank: index + 1 }));
    return ok(c, sortedLeaderboard);
  });
  // DEMO ROUTES (from template)
  app.get('/api/test', (c) => c.json({ success: true, data: { name: 'CF Workers Demo' }}));
  app.get('/api/users', async (c) => {
    await UserEntity.ensureSeed(c.env);
    const cq = c.req.query('cursor');
    const lq = c.req.query('limit');
    const page = await UserEntity.list(c.env, cq ?? null, lq ? Math.max(1, (Number(lq) | 0)) : undefined);
    return ok(c, page);
  });
  app.post('/api/users', async (c) => {
    const { name } = (await c.req.json()) as { name?: string };
    if (!name?.trim()) return bad(c, 'name required');
    return ok(c, await UserEntity.create(c.env, { id: crypto.randomUUID(), name: name.trim() }));
  });
  app.get('/api/chats', async (c) => {
    await ChatBoardEntity.ensureSeed(c.env);
    const cq = c.req.query('cursor');
    const lq = c.req.query('limit');
    const page = await ChatBoardEntity.list(c.env, cq ?? null, lq ? Math.max(1, (Number(lq) | 0)) : undefined);
    return ok(c, page);
  });
  app.post('/api/chats', async (c) => {
    const { title } = (await c.req.json()) as { title?: string };
    if (!title?.trim()) return bad(c, 'title required');
    const created = await ChatBoardEntity.create(c.env, { id: crypto.randomUUID(), title: title.trim(), messages: [] });
    return ok(c, { id: created.id, title: created.title });
  });
  app.get('/api/chats/:chatId/messages', async (c) => {
    const chat = new ChatBoardEntity(c.env, c.req.param('chatId'));
    if (!await chat.exists()) return notFound(c, 'chat not found');
    return ok(c, await chat.listMessages());
  });
  app.post('/api/chats/:chatId/messages', async (c) => {
    const chatId = c.req.param('chatId');
    const { userId, text } = (await c.req.json()) as { userId?: string; text?: string };
    if (!isStr(userId) || !text?.trim()) return bad(c, 'userId and text required');
    const chat = new ChatBoardEntity(c.env, chatId);
    if (!await chat.exists()) return notFound(c, 'chat not found');
    return ok(c, await chat.sendMessage(userId, text.trim()));
  });
}