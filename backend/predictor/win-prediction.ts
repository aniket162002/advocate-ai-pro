import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";

export interface WinPredictionRequest {
  caseDetails: string;
  caseType: string;
  judgeId: string;
  evidenceStrength: number;
  precedentSupport: number;
  uploadedFiles?: string[];
}

export interface WinPrediction {
  winProbability: number;
  riskFactors: string[];
  mitigationStrategies: string[];
  keySuccessFactors: string[];
  recommendedActions: string[];
}

// Predicts case outcome probability using AI analysis.
export const predictWinChance = api<WinPredictionRequest, WinPrediction>(
  { auth: true, expose: true, method: "POST", path: "/predictor/win-chance" },
  async (req) => {
    try {
      const auth = getAuthData()!;
      
      if (auth.role !== "lawyer") {
        throw new Error("Only lawyers can access win prediction");
      }

      if (!req.caseDetails || !req.caseType) {
        throw new Error("Case details and type are required");
      }

      if (req.evidenceStrength < 0 || req.evidenceStrength > 1) {
        throw new Error("Evidence strength must be between 0 and 1");
      }

      if (req.precedentSupport < 0 || req.precedentSupport > 1) {
        throw new Error("Precedent support must be between 0 and 1");
      }

      // Simulate AI-based win prediction
      const baseScore = (req.evidenceStrength + req.precedentSupport) / 2;
      let judgeBonus = 0.1; // Based on judge analysis
      let caseTypeModifier = 0;

      // Adjust based on case type
      switch (req.caseType) {
        case "criminal":
          caseTypeModifier = -0.05; // Generally harder to win
          break;
        case "civil":
          caseTypeModifier = 0.05; // Moderate success rate
          break;
        case "family":
          caseTypeModifier = 0.02; // Depends on circumstances
          break;
        case "commercial":
          caseTypeModifier = 0.08; // Often settled
          break;
        case "constitutional":
          caseTypeModifier = -0.03; // Complex cases
          break;
      }

      const winProbability = Math.min(0.95, Math.max(0.05, baseScore + judgeBonus + caseTypeModifier));

      const prediction: WinPrediction = {
        winProbability: Math.round(winProbability * 100) / 100,
        riskFactors: [
          "Weak witness testimony",
          "Procedural delays in filing",
          "Opposing counsel's strong track record",
          "Limited precedent support in jurisdiction",
          "Complex legal issues involved",
        ],
        mitigationStrategies: [
          "Strengthen witness preparation",
          "File additional supporting documents",
          "Research alternative legal theories",
          "Consider settlement negotiations",
          "Engage expert witnesses",
        ],
        keySuccessFactors: [
          "Strong documentary evidence",
          "Favorable judge history",
          "Clear legal precedents",
          "Well-prepared arguments",
          "Credible witness testimony",
        ],
        recommendedActions: [
          "Gather additional evidence",
          "Prepare comprehensive case brief",
          "Schedule witness coaching sessions",
          "Review recent similar judgments",
          "Consider alternative dispute resolution",
        ],
      };

      return prediction;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Failed to predict win chance");
    }
  }
);
