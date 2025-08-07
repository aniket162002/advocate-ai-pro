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
    const auth = getAuthData()!;
    
    if (auth.role !== "admin") {
      throw new Error("Only admins can manage subscriptions");
    }

    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1); // Default 1 month

    await db.exec`
      UPDATE users 
      SET subscription_plan = ${req.planId}, 
          subscription_expires_at = ${expiresAt}
      WHERE id = ${req.userId}
    `;

    return {
      success: true,
      expiresAt,
    };
  }
);
