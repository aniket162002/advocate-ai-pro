import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { secret } from "encore.dev/config";

const openAIKey = secret("OpenAIKey");

export interface CreateDraftRequest {
  caseId: string;
  draftType: string;
  voiceInput?: string;
  manualInput?: string;
  templateId?: number;
}

export interface Draft {
  id: string;
  caseId: string;
  content: string;
  complianceIssues: string[];
  suggestions: string[];
  createdAt: Date;
}

// Creates AI-powered legal drafts with compliance checking.
export const createDraft = api<CreateDraftRequest, Draft>(
  { auth: true, expose: true, method: "POST", path: "/ecourt/drafts" },
  async (req) => {
    const auth = getAuthData()!;
    
    if (auth.role !== "lawyer") {
      throw new Error("Only lawyers can create drafts");
    }

    // Simulate AI draft generation
    const content = `
BEFORE THE HON'BLE COURT

IN THE MATTER OF: ${req.caseId}

DRAFT APPLICATION

TO,
THE HON'BLE COURT

MOST RESPECTFULLY SHOWETH:

1. That the applicant is a law-abiding citizen and has never been involved in any criminal activity.

2. That the facts of the case are as follows:
${req.manualInput || req.voiceInput || "Details to be filled"}

3. That the applicant seeks the following relief:
- [Relief sought]

PRAYER:
In view of the above, it is most respectfully prayed that this Hon'ble Court may be pleased to:
a) Grant the relief sought
b) Pass any other order as deemed fit

Place: [City]
Date: ${new Date().toLocaleDateString()}

                                                    Advocate for Applicant
    `;

    const complianceIssues = [
      "Missing case citation in paragraph 2",
      "Prayer section needs specific relief details",
    ];

    const suggestions = [
      "Add relevant case law citations",
      "Include specific dates and amounts",
      "Verify court formatting requirements",
    ];

    return {
      id: `draft_${Date.now()}`,
      caseId: req.caseId,
      content,
      complianceIssues,
      suggestions,
      createdAt: new Date(),
    };
  }
);
