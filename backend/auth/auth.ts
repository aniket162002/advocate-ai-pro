import { Header, Cookie, APIError, Gateway } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";
import { SQLDatabase } from "encore.dev/storage/sqldb";

const db = new SQLDatabase("advocate_ai", {
  migrations: "./migrations",
});

interface AuthParams {
  authorization?: Header<"Authorization">;
  session?: Cookie<"session">;
}

export interface AuthData {
  userID: string;
  email: string;
  role: "admin" | "lawyer" | "user";
  crnNumber?: string;
  firstName: string;
  lastName: string;
}

const auth = authHandler<AuthParams, AuthData>(
  async (data) => {
    const token = data.authorization?.replace("Bearer ", "") ?? data.session?.value;
    if (!token) {
      throw APIError.unauthenticated("missing token");
    }

    try {
      // Simple JWT-like token verification (in production, use proper JWT)
      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      const userData = JSON.parse(decoded);
      
      // Verify user exists in database
      const user = await db.queryRow`
        SELECT id, email, role, crn_number, first_name, last_name
        FROM users 
        WHERE id = ${userData.userID} AND is_active = TRUE
      `;
      
      if (!user) {
        throw APIError.unauthenticated("invalid token");
      }
      
      return {
        userID: user.id.toString(),
        email: user.email,
        role: user.role as "admin" | "lawyer" | "user",
        crnNumber: user.crn_number,
        firstName: user.first_name,
        lastName: user.last_name,
      };
    } catch (err) {
      throw APIError.unauthenticated("invalid token", err);
    }
  }
);

export const gw = new Gateway({ authHandler: auth });
