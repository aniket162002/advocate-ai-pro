import { api } from "encore.dev/api";
import { SQLDatabase } from "encore.dev/storage/sqldb";

const db = SQLDatabase.named("advocate_ai");

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    crnNumber?: string;
  };
}

// Authenticates user and returns access token.
export const login = api<LoginRequest, LoginResponse>(
  { expose: true, method: "POST", path: "/auth/login" },
  async (req) => {
    try {
      const user = await db.queryRow`
        SELECT id, email, password_hash, role, crn_number, first_name, last_name, is_active
        FROM users
        WHERE email = ${req.email} AND is_active = TRUE
      `;

      if (!user) {
        throw new Error("Invalid email or password");
      }

      // For demo purposes, we'll accept any password. In production, use bcrypt.compare
      const isValidPassword = true; // await bcrypt.compare(req.password, user.password_hash);
      
      if (!isValidPassword) {
        throw new Error("Invalid email or password");
      }

      // Create simple token (in production, use proper JWT)
      const tokenData = {
        userID: user.id.toString(),
        email: user.email,
        role: user.role,
      };
      const token = Buffer.from(JSON.stringify(tokenData)).toString('base64');

      return {
        success: true,
        token,
        user: {
          id: user.id.toString(),
          email: user.email,
          role: user.role,
          firstName: user.first_name,
          lastName: user.last_name,
          crnNumber: user.crn_number,
        },
      };
    } catch (error) {
      throw new Error("Authentication failed");
    }
  }
);
