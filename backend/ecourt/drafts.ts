import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";

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
    try {
      const auth = getAuthData()!;
      
      if (auth.role !== "lawyer") {
        throw new Error("Only lawyers can create drafts");
      }

      if (!req.caseId || !req.draftType) {
        throw new Error("Case ID and draft type are required");
      }

      // Simulate AI draft generation based on type
      let content = "";
      let complianceIssues: string[] = [];
      let suggestions: string[] = [];

      switch (req.draftType) {
        case "application":
          content = `BEFORE THE HON'BLE COURT

IN THE MATTER OF: ${req.caseId}

APPLICATION UNDER SECTION ___

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

                                                    Advocate for Applicant`;
          break;
        case "petition":
          content = `PETITION UNDER ARTICLE ___ OF THE CONSTITUTION

TO,
THE HON'BLE COURT

The humble petition of the petitioner above named

MOST RESPECTFULLY SHOWETH:

1. That the petitioner is filing this petition in public interest.

2. ${req.manualInput || req.voiceInput || "Petition details to be filled"}

PRAYER:
It is therefore most respectfully prayed that this Hon'ble Court may be pleased to:
a) Issue appropriate writ/order/direction
b) Grant such other relief as deemed fit

                                                    Petitioner`;
          break;
        default:
          content = `LEGAL DOCUMENT

${req.manualInput || req.voiceInput || "Content to be filled"}

Date: ${new Date().toLocaleDateString()}
                                                    Advocate`;
      }

      complianceIssues = [
        "Missing specific section references",
        "Prayer section needs more detail",
        "Verification clause missing",
      ];

      suggestions = [
        "Add relevant case law citations",
        "Include specific dates and amounts",
        "Verify court formatting requirements",
        "Add proper cause title",
      ];

      return {
        id: `draft_${Date.now()}`,
        caseId: req.caseId,
        content,
        complianceIssues,
        suggestions,
        createdAt: new Date(),
      };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Failed to create draft");
    }
  }
);
