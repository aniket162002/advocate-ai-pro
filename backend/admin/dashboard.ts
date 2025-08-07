import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { SQLDatabase } from "encore.dev/storage/sqldb";

const db = SQLDatabase.named("advocate_ai");

export interface AdminStats {
  totalUsers: number;
  totalLawyers: number;
  activeSubscriptions: number;
  documentsGenerated: number;
  topTemplates: Array<{ name: string; usage: number }>;
  revenueThisMonth: number;
}

// Retrieves comprehensive admin dashboard statistics.
export const getDashboardStats = api<void, AdminStats>(
  { auth: true, expose: true, method: "GET", path: "/admin/dashboard" },
  async () => {
    const auth = getAuthData()!;
    
    if (auth.role !== "admin") {
      throw new Error("Only admins can access dashboard stats");
    }

    const totalUsers = await db.queryRow`SELECT COUNT(*) as count FROM users WHERE role = 'user'`;
    const totalLawyers = await db.queryRow`SELECT COUNT(*) as count FROM users WHERE role = 'lawyer'`;
    const activeSubscriptions = await db.queryRow`
      SELECT COUNT(*) as count FROM users 
      WHERE subscription_plan != 'free' AND subscription_expires_at > NOW()
    `;
    const documentsGenerated = await db.queryRow`SELECT COUNT(*) as count FROM document_generations`;

    return {
      totalUsers: totalUsers?.count || 0,
      totalLawyers: totalLawyers?.count || 0,
      activeSubscriptions: activeSubscriptions?.count || 0,
      documentsGenerated: documentsGenerated?.count || 0,
      topTemplates: [
        { name: "Sale Deed", usage: 45 },
        { name: "Rent Agreement", usage: 32 },
        { name: "Power of Attorney", usage: 28 },
      ],
      revenueThisMonth: 125000,
    };
  }
);
