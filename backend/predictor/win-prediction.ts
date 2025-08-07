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
    const auth = getAuthData()!;
    
    if (auth.role !== "lawyer") {
      throw new Error("Only lawyers can access win prediction");
    }

    // Simulate AI-based win prediction
    const baseScore = (req.evidenceStrength + req.precedentSupport) / 2;
    const judgeBonus = 0.1; // Based on judge analysis
    const winProbability = Math.min(0.95, baseScore + judgeBonus);

    const prediction: WinPrediction = {
      winProbability: Math.round(winProbability * 100) / 100,
      riskFactors: [
        "Weak witness testimony",
        "Procedural delays in filing",
        "Opposing counsel's strong track record",
        "Limited precedent support in jurisdiction",
      ],
      mitigationStrategies: [
        "Strengthen witness preparation",
        "File additional supporting documents",
        "Research alternative legal theories",
        "Consider settlement negotiations",
      ],
      keySuccessFactors: [
        "Strong documentary evidence",
        "Favorable judge history",
        "Clear legal precedents",
        "Well-prepared arguments",
      ],
      recommendedActions: [
        "Gather additional evidence",
        "Prepare comprehensive case brief",
        "Schedule witness coaching sessions",
        "Review recent similar judgments",
      ],
    };

    return prediction;
  }
);
