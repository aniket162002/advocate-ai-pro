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
  { auth: true, expose: true, method: "POST", path: "/argument-analysis/simulate" },
  async (req) => {
    const auth = getAuthData()!;
    
    if (auth.role !== "lawyer") {
      throw new Error("Only lawyers can use argument simulator");
    }

    // Simulate AI judge response
    const response: SimulatorResponse = {
      judgeResponse: "Counsel, your argument regarding constitutional violation is noted. However, can you provide specific case law to support your contention? Also, please address the procedural aspects that the prosecution has raised.",
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
      score: 7.5,
    };

    return response;
  }
);
