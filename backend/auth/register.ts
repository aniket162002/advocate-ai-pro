import { api } from "encore.dev/api";
import { SQLDatabase } from "encore.dev/storage/sqldb";

const db = SQLDatabase.named("advocate_ai");

export interface RegisterRequest {
  email: string;
  password: string;
  role: "admin" | "lawyer" | "user";
  crnNumber?: string;
  firstName: string;
  lastName: string;
}

export interface RegisterResponse {
  success: boolean;
  userId: string;
  message: string;
}

// Registers a new user in the system.
export const register = api<RegisterRequest, RegisterResponse>(
  { expose: true, method: "POST", path: "/auth/register" },
  async (req) => {
    try {
      if (req.role === "lawyer" && !req.crnNumber) {
        throw new Error("CRN number is required for lawyers");
      }

      // Check if user already exists
      const existingUser = await db.queryRow`
        SELECT id FROM users WHERE email = ${req.email}
      `;

      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      // Hash password (for demo, we'll store plain text - use bcrypt in production)
      const passwordHash = req.password; // await bcrypt.hash(req.password, 10);

      const user = await db.queryRow`
        INSERT INTO users (email, password_hash, role, crn_number, first_name, last_name, created_at)
        VALUES (${req.email}, ${passwordHash}, ${req.role}, ${req.crnNumber || null}, ${req.firstName}, ${req.lastName}, NOW())
        RETURNING id
      `;

      return {
        success: true,
        userId: user!.id.toString(),
        message: "User registered successfully",
      };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Registration failed");
    }
  }
);
