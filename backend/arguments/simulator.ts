import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";

export interface SimulatorRequest {
  argument: string;
  caseType: string;
  judgeProfile: string;
}

export interface SimulatorResponse {
  judgeResponse: string;
  feedback: string[];
  improvementSuggestions: string[];
  score: number;
}

// Simulates court arguments with AI judge feedback.
export const simulateArgument = api<SimulatorRequest, SimulatorResponse>(
  { auth: true, expose: true, method: "POST", path: "/arguments/simulate" },
  async (req) => {
    try {
      const auth = getAuthData()!;
      
      if (auth.role !== "lawyer") {
        throw new Error("Only lawyers can use argument simulator");
      }

      // Simulate AI judge response based on profile
      let judgeResponse = "";
      let score = 7.5;

      switch (req.judgeProfile) {
        case "strict":
          judgeResponse = "Counsel, your argument lacks specific statutory provisions. Please cite relevant sections and provide precedent support.";
          score = 6.0;
          break;
        case "liberal":
          judgeResponse = "Your argument has merit. However, consider the broader constitutional implications and human rights aspects.";
          score = 8.0;
          break;
        case "conservative":
          judgeResponse = "Counsel, while your argument is noted, ensure it aligns with established legal principles and traditional interpretations.";
          score = 7.0;
          break;
        default:
          judgeResponse = "Counsel, your argument regarding constitutional violation is noted. However, can you provide specific case law to support your contention?";
      }

      const response: SimulatorResponse = {
        judgeResponse,
        feedback: [
          "Strong opening statement",
          "Good use of constitutional principles",
          "Need more specific case citations",
          "Address counter-arguments proactively",
        ],
        improvementSuggestions: [
          "Cite specific Supreme Court judgments",
          "Prepare for procedural challenges",
          "Structure arguments more logically",
          "Practice timing and delivery",
        ],
        score,
      };

      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Failed to simulate argument");
    }
  }
);
