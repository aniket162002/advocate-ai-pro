import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { SQLDatabase } from "encore.dev/storage/sqldb";

const db = SQLDatabase.named("advocate_ai");

export interface MalkiyatCalculationRequest {
  landArea: number;
  state: string;
  district: string;
  circleRate?: number;
}

export interface MalkiyatCalculationResponse {
  landValue: number;
  stampDuty: number;
  registrationFee: number;
  totalCharges: number;
  circleRate: number;
}

// Calculates malkiyat (land value) and associated charges.
export const calculateMalkiyat = api<MalkiyatCalculationRequest, MalkiyatCalculationResponse>(
  { auth: true, expose: true, method: "POST", path: "/documents/malkiyat" },
  async (req) => {
    const auth = getAuthData()!;
    
    if (auth.role !== "lawyer" && auth.role !== "admin") {
      throw new Error("Only lawyers and admins can calculate malkiyat");
    }

    let circleRate = req.circleRate;
    
    if (!circleRate) {
      const rateData = await db.queryRow`
        SELECT circle_rate FROM circle_rates 
        WHERE state = ${req.state} AND district = ${req.district}
      `;
      circleRate = rateData?.circle_rate || 50000; // Default rate
    }

    const landValue = req.landArea * circleRate;
    const stampDuty = landValue * 0.05; // 5% stamp duty
    const registrationFee = landValue * 0.01; // 1% registration fee
    const totalCharges = landValue + stampDuty + registrationFee;

    return {
      landValue,
      stampDuty,
      registrationFee,
      totalCharges,
      circleRate,
    };
  }
);
