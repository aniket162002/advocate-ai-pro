import { api } from "encore.dev/api";
import { SQLDatabase } from "encore.dev/storage/sqldb";

const db = new SQLDatabase("advocate_ai", {
  migrations: "./migrations",
});

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
}

// Registers a new user in the system.
export const register = api<RegisterRequest, RegisterResponse>(
  { expose: true, method: "POST", path: "/auth/register" },
  async (req) => {
    if (req.role === "lawyer" && !req.crnNumber) {
      throw new Error("CRN number is required for lawyers");
    }

    const user = await db.queryRow`
      INSERT INTO users (email, role, crn_number, first_name, last_name, created_at)
      VALUES (${req.email}, ${req.role}, ${req.crnNumber || null}, ${req.firstName}, ${req.lastName}, NOW())
      RETURNING id
    `;

    return {
      success: true,
      userId: user!.id,
    };
  }
);
