import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";

export interface AnalyzeJudgeRequest {
  judgeId: string;
  caseType: string;
  uploadedPdf?: string;
}

export interface JudgeAnalysis {
  judgeName: string;
  tendencies: string[];
  successfulArguments: string[];
  avoidancePoints: string[];
  recentOrders: string[];
  suggestedStrategy: string;
}

// Analyzes judge's historical patterns and suggests arguments.
export const analyzeJudge = api<AnalyzeJudgeRequest, JudgeAnalysis>(
  { auth: true, expose: true, method: "POST", path: "/arguments/analyze-judge" },
  async (req) => {
    try {
      const auth = getAuthData()!;
      
      if (auth.role !== "lawyer") {
        throw new Error("Only lawyers can access judge analysis");
      }

      // Simulate AI analysis of judge patterns
      const analysis: JudgeAnalysis = {
        judgeName: `Hon'ble Justice ${req.judgeId}`,
        tendencies: [
          "Prefers detailed case law citations",
          "Values procedural compliance",
          "Shows leniency in first-time offenses",
          "Strict on documentation requirements",
        ],
        successfulArguments: [
          "Constitutional rights violations",
          "Procedural lapses by prosecution",
          "Mitigating circumstances",
          "Precedent-based arguments",
        ],
        avoidancePoints: [
          "Avoid emotional appeals without legal basis",
          "Don't challenge court procedures directly",
          "Avoid repetitive arguments",
          "Don't cite overruled judgments",
        ],
        recentOrders: [
          "Granted bail in similar case last month",
          "Emphasized importance of witness credibility",
          "Rejected applications with insufficient grounds",
        ],
        suggestedStrategy: "Focus on constitutional grounds with strong precedent support. Emphasize procedural compliance and present clear, concise arguments with relevant case law.",
      };

      return analysis;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Failed to analyze judge patterns");
    }
  }
);
