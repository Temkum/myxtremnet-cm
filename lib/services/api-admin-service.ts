/**
 * API Admin Service - Connects admin panel to any REST API backend.
 *
 * This implementation of AdminService fetches data from a configurable API
 * endpoint. The client can point this at any backend (PHP, Node.js, Python,
 * Java, etc.) as long as it exposes the expected REST endpoints.
 *
 * Usage:
 *   import { setAdminService } from './admin-service';
 *   import { ApiAdminService } from './api-admin-service';
 *   setAdminService(new ApiAdminService('https://api.camtel.cm'));
 *
 * Or set via environment variable:
 *   ADMIN_API_URL=https://api.camtel.cm/api/admin
 */

import type {
  AdminService,
  AdminUser,
  SystemStats,
  AuditLog,
  Promotion,
  DashboardMetrics,
} from './admin-service';

export class ApiAdminService implements AdminService {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseUrl?: string, headers?: Record<string, string>) {
    this.baseUrl =
      baseUrl || process.env.NEXT_PUBLIC_ADMIN_API_URL || '/api/admin';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...headers,
    };
  }

  private async fetchJson<T>(
    endpoint: string,
    options?: RequestInit,
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `API error (${response.status}): ${errorBody || response.statusText}`,
      );
    }

    return response.json() as Promise<T>;
  }

  async getSystemStats(): Promise<SystemStats> {
    return this.fetchJson<SystemStats>('/stats');
  }

  async getUsers(): Promise<AdminUser[]> {
    return this.fetchJson<AdminUser[]>('/users');
  }

  async getAuditLogs(): Promise<AuditLog[]> {
    return this.fetchJson<AuditLog[]>('/audit-logs');
  }

  async getPromotions(): Promise<Promotion[]> {
    return this.fetchJson<Promotion[]>('/promotions');
  }

  async getDashboardMetrics(): Promise<DashboardMetrics> {
    return this.fetchJson<DashboardMetrics>('/dashboard/metrics');
  }

  async searchUsers(query: string): Promise<AdminUser[]> {
    return this.fetchJson<AdminUser[]>(
      `/users?search=${encodeURIComponent(query)}`,
    );
  }
}
