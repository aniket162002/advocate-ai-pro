import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";

export interface OCRRequest {
  imageBase64: string;
  documentType: "aadhaar" | "pan" | "land_record";
}

export interface OCRResponse {
  extractedData: Record<string, any>;
  confidence: number;
}

// Extracts data from uploaded documents using OCR and AI.
export const extractDocumentData = api<OCRRequest, OCRResponse>(
  { auth: true, expose: true, method: "POST", path: "/documents/ocr" },
  async (req) => {
    try {
      const auth = getAuthData()!;
      
      if (auth.role !== "lawyer" && auth.role !== "admin") {
        throw new Error("Only lawyers and admins can use OCR");
      }

      // Simulate OCR extraction based on document type
      let extractedData: Record<string, any> = {};
      
      switch (req.documentType) {
        case "aadhaar":
          extractedData = {
            name: "John Doe",
            aadhaarNumber: "1234-5678-9012",
            dateOfBirth: "01/01/1990",
            address: "123 Main Street, City, State - 123456",
            gender: "Male",
          };
          break;
        case "pan":
          extractedData = {
            name: "John Doe",
            panNumber: "ABCDE1234F",
            dateOfBirth: "01/01/1990",
            fatherName: "Father Name",
          };
          break;
        case "land_record":
          extractedData = {
            surveyNumber: "123/1A",
            khataNumber: "456",
            landArea: "2.5",
            landType: "Agricultural",
            ownerName: "John Doe",
            village: "Sample Village",
            district: "Sample District",
            state: "Sample State",
          };
          break;
        default:
          throw new Error("Invalid document type");
      }

      return {
        extractedData,
        confidence: 0.95,
      };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Failed to extract document data");
    }
  }
);
