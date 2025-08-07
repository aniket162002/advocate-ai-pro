import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { SQLDatabase } from "encore.dev/storage/sqldb";

const db = SQLDatabase.named("advocate_ai");

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: "weekly" | "monthly" | "yearly";
  features: string[];
  documentLimit: number;
  userType: "lawyer" | "enterprise" | "user";
}

export interface UpdateSubscriptionRequest {
  userId: string;
  planId: string;
  discountPercent?: number;
}

export interface SubscriptionResponse {
  success: boolean;
  expiresAt: Date;
}

// Updates user subscription plan with optional discount.
export const updateSubscription = api<UpdateSubscriptionRequest, SubscriptionResponse>(
  { auth: true, expose: true, method: "POST", path: "/admin/subscriptions" },
  async (req) => {
    try {
      const auth = getAuthData()!;
      
      if (auth.role !== "admin") {
        throw new Error("Only admins can manage subscriptions");
      }

      if (!req.userId || !req.planId) {
        throw new Error("User ID and plan ID are required");
      }

      // Check if user exists
      const user = await db.queryRow`
        SELECT id FROM users WHERE id = ${req.userId}
      `;

      if (!user) {
        throw new Error("User not found");
      }

      const expiresAt = new Date();
      
      // Set expiration based on plan
      switch (req.planId) {
        case "free":
          expiresAt.setDate(expiresAt.getDate() + 7); // 7 days for free trial
          break;
        case "lawyer-basic":
        case "lawyer-pro":
        case "enterprise":
          expiresAt.setMonth(expiresAt.getMonth() + 1); // 1 month
          break;
        default:
          expiresAt.setMonth(expiresAt.getMonth() + 1); // Default 1 month
      }

      await db.exec`
        UPDATE users 
        SET subscription_plan = ${req.planId}, 
            subscription_expires_at = ${expiresAt},
            updated_at = NOW()
        WHERE id = ${req.userId}
      `;

      return {
        success: true,
        expiresAt,
      };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Failed to update subscription");
    }
  }
);
