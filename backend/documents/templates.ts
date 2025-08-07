import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { SQLDatabase } from "encore.dev/storage/sqldb";

const db = SQLDatabase.named("advocate_ai");

export interface Template {
  id: number;
  name: string;
  type: string;
  content: string;
  placeholders: string[];
  state?: string;
  district?: string;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
}

export interface CreateTemplateRequest {
  name: string;
  type: string;
  content: string;
  placeholders: string[];
  state?: string;
  district?: string;
}

export interface ListTemplatesResponse {
  templates: Template[];
}

// Creates a new document template.
export const createTemplate = api<CreateTemplateRequest, Template>(
  { auth: true, expose: true, method: "POST", path: "/documents/templates" },
  async (req) => {
    try {
      const auth = getAuthData()!;
      
      if (auth.role !== "admin") {
        throw new Error("Only admins can create templates");
      }

      if (!req.name || !req.type || !req.content) {
        throw new Error("Name, type, and content are required");
      }

      const template = await db.queryRow<any>`
        INSERT INTO templates (name, type, content, placeholders, state, district, created_by, created_at)
        VALUES (${req.name}, ${req.type}, ${req.content}, ${JSON.stringify(req.placeholders)}, 
                ${req.state || null}, ${req.district || null}, ${auth.userID}, NOW())
        RETURNING id, name, type, content, placeholders, state, district, is_active, created_by, created_at
      `;

      return {
        id: template!.id,
        name: template!.name,
        type: template!.type,
        content: template!.content,
        placeholders: JSON.parse(template!.placeholders as string),
        state: template!.state,
        district: template!.district,
        isActive: template!.is_active,
        createdBy: template!.created_by,
        createdAt: template!.created_at,
      };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Failed to create template");
    }
  }
);

// Lists all available templates.
export const listTemplates = api<void, ListTemplatesResponse>(
  { auth: true, expose: true, method: "GET", path: "/documents/templates" },
  async () => {
    try {
      const templates = await db.queryAll<any>`
        SELECT id, name, type, content, placeholders, state, district, is_active, created_by, created_at
        FROM templates
        WHERE is_active = TRUE
        ORDER BY created_at DESC
      `;

      return {
        templates: templates.map(t => ({
          id: t.id,
          name: t.name,
          type: t.type,
          content: t.content,
          placeholders: JSON.parse(t.placeholders),
          state: t.state,
          district: t.district,
          isActive: t.is_active,
          createdBy: t.created_by,
          createdAt: t.created_at,
        })),
      };
    } catch (error) {
      throw new Error("Failed to fetch templates");
    }
  }
);
