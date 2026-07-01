import { effect, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Socket } from 'socket.io-client';

import { environment } from '../../../environments/environment';
import { Notification, Status } from '../interfaces/order.interface';
import { TokenService } from './token.service';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class NotificationsSocketService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);
  private auth = inject(AuthService);

  readonly notifications: WritableSignal<Notification[]> = signal([]);
  readonly newOrders: WritableSignal<Notification[]> = signal([]);
  private socket: Socket | null = null;
  private connecting: Promise<void> | null = null;
  private lastUserId: string | null = null;

  constructor() {
    effect(() => {
      const user = this.auth.currentUser();
      const userId = user?.id ?? null;
      if (userId === this.lastUserId) return;
      this.lastUserId = userId;
      if (user) {
        this.connect();
      } else {
        this.disconnect();
        this.notifications.set([]);
        this.newOrders.set([]);
      }
    });
  }

  connect(): Promise<void> {
    if (this.socket || this.connecting) return this.connecting ?? Promise.resolve();
    const token = this.tokenService.get();
    if (!token) return Promise.resolve();

    this.connecting = this.openSocket(token).finally(() => (this.connecting = null));
    return this.connecting;
  }

  private async openSocket(token: string): Promise<void> {
    const { io } = await import('socket.io-client');
    this.socket = io(`${environment.wsUrl}/notifications`, {
      auth: { token },
      transports: ['websocket'],
    });

    this.socket.on('notification:new', (notification: Notification) => {
      this.notifications.update((list) => sortByCreatedAt([notification, ...list]));
      if (notification.status === Status.pending) {
        this.newOrders.update((list) => sortByCreatedAt([notification, ...list]));
      }
    });

    this.socket.on(
      'notification:status',
      (payload: { id: string; orderId: string; status: Status }) => {
        this.notifications.update((list) =>
          list.map((n) => (n.id === payload.id ? { ...n, status: payload.status } : n))
        );
        this.newOrders.update((list) =>
          list.filter((n) => n.id !== payload.id || payload.status === Status.pending)
        );
      }
    );

    this.loadInitial();
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
    this.connecting = null;
  }

  loadInitial(): void {
    this.http.get<Notification[]>(`${environment.apiUrl}/notifications/my`).subscribe({
      next: (list) => {
        const sorted = sortByCreatedAt(list);
        this.notifications.set(sorted);
        this.newOrders.set(sorted.filter((n) => n.status === Status.pending));
      },
    });
  }
}

function sortByCreatedAt(list: Notification[]): Notification[] {
  return [...list].sort((a, b) =>
    new Date(a.createdAt) > new Date(b.createdAt)
      ? -1
      : new Date(a.createdAt) < new Date(b.createdAt)
      ? 1
      : 0
  );
}
