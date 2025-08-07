import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { SQLDatabase } from "encore.dev/storage/sqldb";

const db = SQLDatabase.named("advocate_ai");

export interface CircleRate {
  id: number;
  state: string;
  district: string;
  circleRate: number;
  createdBy: string;
  createdAt: Date;
}

export interface CreateCircleRateRequest {
  state: string;
  district: string;
  circleRate: number;
}

export interface ListCircleRatesResponse {
  rates: CircleRate[];
}

// Creates or updates circle rates for states and districts.
export const createCircleRate = api<CreateCircleRateRequest, CircleRate>(
  { auth: true, expose: true, method: "POST", path: "/admin/circle-rates" },
  async (req) => {
    const auth = getAuthData()!;
    
    if (auth.role !== "admin") {
      throw new Error("Only admins can manage circle rates");
    }

    const rate = await db.queryRow<any>`
      INSERT INTO circle_rates (state, district, circle_rate, created_by, created_at)
      VALUES (${req.state}, ${req.district}, ${req.circleRate}, ${auth.userID}, NOW())
      ON CONFLICT (state, district) 
      DO UPDATE SET circle_rate = ${req.circleRate}, updated_at = NOW()
      RETURNING id, state, district, circle_rate, created_by, created_at
    `;

    return {
      id: rate!.id,
      state: rate!.state,
      district: rate!.district,
      circleRate: rate!.circle_rate,
      createdBy: rate!.created_by,
      createdAt: rate!.created_at,
    };
  }
);

// Lists all circle rates by state and district.
export const listCircleRates = api<void, ListCircleRatesResponse>(
  { auth: true, expose: true, method: "GET", path: "/admin/circle-rates" },
  async () => {
    const rates = await db.queryAll<any>`
      SELECT id, state, district, circle_rate, created_by, created_at
      FROM circle_rates
      ORDER BY state, district
    `;

    return {
      rates: rates.map(r => ({
        id: r.id,
        state: r.state,
        district: r.district,
        circleRate: r.circle_rate,
        createdBy: r.created_by,
        createdAt: r.created_at,
      })),
    };
  }
);
