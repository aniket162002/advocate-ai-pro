import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { Query } from "encore.dev/api";

export interface Case {
  id: string;
  caseNumber: string;
  title: string;
  stage: string;
  nextHearingDate: Date;
  judgeName: string;
  partyDetails: string;
  status: "pending" | "disposed" | "adjourned";
}

export interface ListCasesRequest {
  crnNumber: Query<string>;
}

export interface ListCasesResponse {
  cases: Case[];
}

// Fetches real-time case data from eCourt system.
export const listCases = api<ListCasesRequest, ListCasesResponse>(
  { auth: true, expose: true, method: "GET", path: "/ecourt/cases" },
  async (req) => {
    const auth = getAuthData()!;
    
    if (auth.role !== "lawyer") {
      throw new Error("Only lawyers can access case data");
    }

    // Simulate eCourt API response
    const cases: Case[] = [
      {
        id: "1",
        caseNumber: "CRL.A. 123/2024",
        title: "State vs. John Doe",
        stage: "Arguments",
        nextHearingDate: new Date("2024-02-15"),
        judgeName: "Hon'ble Justice Smith",
        partyDetails: "State of XYZ vs John Doe",
        status: "pending",
      },
      {
        id: "2",
        caseNumber: "CIV.A. 456/2024",
        title: "ABC Corp vs. XYZ Ltd",
        stage: "Evidence",
        nextHearingDate: new Date("2024-02-20"),
        judgeName: "Hon'ble Justice Johnson",
        partyDetails: "ABC Corporation vs XYZ Limited",
        status: "pending",
      },
    ];

    return { cases };
  }
);
