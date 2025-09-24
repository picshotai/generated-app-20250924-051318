/**
 * Minimal real-world demo: One Durable Object instance per entity (User, ChatBoard), with Indexes for listing.
 */
import { IndexedEntity, Entity } from "./core-utils";
import type { User, Chat, ChatMessage, F1Driver, F1Constructor, FantasyTeam } from "@shared/types";
import { MOCK_CHAT_MESSAGES, MOCK_CHATS, MOCK_USERS, MOCK_DRIVERS, MOCK_CONSTRUCTORS } from "@shared/mock-data";
// USER ENTITY: one DO instance per user
export class UserEntity extends IndexedEntity<User> {
  static readonly entityName = "user";
  static readonly indexName = "users";
  static readonly initialState: User = { id: "", name: "" };
  static seedData = MOCK_USERS;
}
// CHAT BOARD ENTITY: one DO instance per chat board, stores its own messages
export type ChatBoardState = Chat & { messages: ChatMessage[] };
const SEED_CHAT_BOARDS: ChatBoardState[] = MOCK_CHATS.map(c => ({
  ...c,
  messages: MOCK_CHAT_MESSAGES.filter(m => m.chatId === c.id),
}));
export class ChatBoardEntity extends IndexedEntity<ChatBoardState> {
  static readonly entityName = "chat";
  static readonly indexName = "chats";
  static readonly initialState: ChatBoardState = { id: "", title: "", messages: [] };
  static seedData = SEED_CHAT_BOARDS;
  async listMessages(): Promise<ChatMessage[]> {
    const { messages } = await this.getState();
    return messages;
  }
  async sendMessage(userId: string, text: string): Promise<ChatMessage> {
    const msg: ChatMessage = { id: crypto.randomUUID(), chatId: this.id, userId, text, ts: Date.now() };
    await this.mutate(s => ({ ...s, messages: [...s.messages, msg] }));
    return msg;
  }
}
// F1 Driver Entity
export class F1DriverEntity extends IndexedEntity<F1Driver> {
  static readonly entityName = "f1driver";
  static readonly indexName = "f1drivers";
  static readonly initialState: F1Driver = { id: "", name: "", price: 0, team: "" };
  static seedData = MOCK_DRIVERS;
}
// F1 Constructor Entity
export class F1ConstructorEntity extends IndexedEntity<F1Constructor> {
  static readonly entityName = "f1constructor";
  static readonly indexName = "f1constructors";
  static readonly initialState: F1Constructor = { id: "", name: "", price: 0 };
  static seedData = MOCK_CONSTRUCTORS;
}
// Fantasy Team Entity (not indexed, one per user)
export class FantasyTeamEntity extends Entity<FantasyTeam> {
  static readonly entityName = "fantasyteam";
  static readonly initialState: FantasyTeam = { userId: "", driverIds: [], constructorId: null, points: 0 };
}