/**
 * Admin Service - Abstraction layer for admin panel data.
 *
 * This service decouples the admin UI from any specific backend/database.
 * To connect to a real backend, implement the AdminService interface below
 * and swap the import in the admin pages.
 *
 * Currently uses mock data for development/demo purposes.
 */

import { systemStats, allUsers, auditLogs, promotions } from '@/data/admin';

// =============================================================================
// Types
// =============================================================================

export interface AdminUser {
  id: string;
  name: string;
  phoneNumber: string;
  serviceId: string;
  email: string;
  role: 'user' | 'admin';
  status: 'active' | 'suspended' | 'blacklisted';
  balance: number;
  walletBalance: number;
  dataBalance: string;
  isBanned: boolean;
  isBlacklisted: boolean;
  bannedReason: string | null;
  blacklistedReason: string | null;
  joinDate: string;
  lastActive: string;
}

export interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  monthlyRevenue: number;
  activeOffers: number;
  suspendedAccounts: number;
  pendingApprovals: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
  ipAddress: string;
}

export interface Promotion {
  id: string;
  name: string;
  description: string;
  type: string;
  value: number;
  active: boolean;
}

export interface DashboardMetrics {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  monthlyRevenue: number;
  activeOffers: number;
  suspendedAccounts: number;
  growthRate: number;
  avgBalance: number;
}

// =============================================================================
// Service Interface
// =============================================================================

export interface AdminService {
  getSystemStats(): Promise<SystemStats>;
  getUsers(): Promise<AdminUser[]>;
  getAuditLogs(): Promise<AuditLog[]>;
  getPromotions(): Promise<Promotion[]>;
  getDashboardMetrics(): Promise<DashboardMetrics>;
  searchUsers(query: string): Promise<AdminUser[]>;
}

// =============================================================================
// Mock Implementation (default)
// =============================================================================

class MockAdminService implements AdminService {
  async getSystemStats(): Promise<SystemStats> {
    return { ...systemStats };
  }

  async getUsers(): Promise<AdminUser[]> {
    return [...allUsers] as AdminUser[];
  }

  async getAuditLogs(): Promise<AuditLog[]> {
    return [...auditLogs];
  }

  async getPromotions(): Promise<Promotion[]> {
    return [...promotions];
  }

  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const users = await this.getUsers();
    const stats = await this.getSystemStats();

    return {
      totalUsers: stats.totalUsers,
      activeUsers: stats.activeUsers,
      totalRevenue: stats.totalRevenue,
      monthlyRevenue: stats.monthlyRevenue,
      activeOffers: stats.activeOffers,
      suspendedAccounts: stats.suspendedAccounts,
      growthRate: (stats.activeUsers / stats.totalUsers) * 100,
      avgBalance:
        users.length > 0
          ? users.reduce((sum, u) => sum + u.balance, 0) / users.length
          : 0,
    };
  }

  async searchUsers(query: string): Promise<AdminUser[]> {
    const users = await this.getUsers();
    const lowerQuery = query.toLowerCase();
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(lowerQuery) ||
        user.phoneNumber.includes(query),
    );
  }
}

// =============================================================================
// Singleton instance — swap this to switch backends
// =============================================================================

let adminServiceInstance: AdminService | null = null;

/**
 * Get the admin service instance.
 *
 * To use a different backend, create a class that implements AdminService
 * and set it here. For example:
 *
 *   import { ApiAdminService } from './api-admin-service';
 *   adminServiceInstance = new ApiAdminService('https://api.camtel.cm');
 */
export function getAdminService(): AdminService {
  if (!adminServiceInstance) {
    adminServiceInstance = new MockAdminService();
  }
  return adminServiceInstance;
}

/**
 * Override the admin service (useful for dependency injection / testing).
 */
export function setAdminService(service: AdminService): void {
  adminServiceInstance = service;
}
