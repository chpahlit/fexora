import * as signalR from "@microsoft/signalr";
import type { ChatMessage, ConnectionState } from "./types";

type EventCallback<T> = (data: T) => void;

export class ChatClient {
  private connection: signalR.HubConnection;
  private listeners: Map<string, Set<EventCallback<unknown>>> = new Map();
  private _state: ConnectionState = "disconnected";

  constructor(hubUrl: string, accessToken: string) {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => accessToken,
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    this.connection.onreconnecting(() => {
      this._state = "reconnecting";
      this.emit("stateChanged", this._state);
    });

    this.connection.onreconnected(() => {
      this._state = "connected";
      this.emit("stateChanged", this._state);
    });

    this.connection.onclose(() => {
      this._state = "disconnected";
      this.emit("stateChanged", this._state);
    });

    // Register hub event handlers
    this.connection.on("ReceiveMessage", (message: ChatMessage) => {
      this.emit("messageReceived", message);
    });

    this.connection.on("MessageSent", (message: ChatMessage) => {
      this.emit("messageSent", message);
    });

    this.connection.on("UserOnline", (userId: string) => {
      this.emit("userOnline", userId);
    });

    this.connection.on("UserOffline", (userId: string) => {
      this.emit("userOffline", userId);
    });

    this.connection.on("UserTyping", (userId: string) => {
      this.emit("userTyping", userId);
    });

    this.connection.on("MessagesRead", (threadId: string, userId: string) => {
      this.emit("messagesRead", { threadId, userId });
    });
  }

  get state(): ConnectionState {
    return this._state;
  }

  async connect(): Promise<void> {
    this._state = "connecting";
    this.emit("stateChanged", this._state);
    await this.connection.start();
    this._state = "connected";
    this.emit("stateChanged", this._state);
  }

  async disconnect(): Promise<void> {
    await this.connection.stop();
  }

  async sendMessage(receiverId: string, body: string): Promise<void> {
    await this.connection.invoke("SendMessage", { receiverId, body });
  }

  async markAsRead(threadId: string): Promise<void> {
    await this.connection.invoke("MarkAsRead", threadId);
  }

  async sendTyping(receiverId: string): Promise<void> {
    await this.connection.invoke("Typing", receiverId);
  }

  async getOnlineUsers(): Promise<string[]> {
    return await this.connection.invoke("GetOnlineUsers");
  }

  on<T>(event: string, callback: EventCallback<T>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback as EventCallback<unknown>);

    return () => {
      this.listeners.get(event)?.delete(callback as EventCallback<unknown>);
    };
  }

  private emit(event: string, data: unknown): void {
    this.listeners.get(event)?.forEach((cb) => cb(data));
  }
}
