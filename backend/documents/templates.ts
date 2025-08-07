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
    const auth = getAuthData()!;
    
    if (auth.role !== "admin") {
      throw new Error("Only admins can create templates");
    }

    const template = await db.queryRow<Template>`
      INSERT INTO templates (name, type, content, placeholders, state, district, created_by, created_at)
      VALUES (${req.name}, ${req.type}, ${req.content}, ${JSON.stringify(req.placeholders)}, 
              ${req.state || null}, ${req.district || null}, ${auth.userID}, NOW())
      RETURNING id, name, type, content, placeholders, state, district, is_active, created_by, created_at
    `;

    return {
      ...template!,
      placeholders: JSON.parse(template!.placeholders as string),
      isActive: template!.is_active,
      createdBy: template!.created_by,
      createdAt: template!.created_at,
    };
  }
);

// Lists all available templates.
export const listTemplates = api<void, ListTemplatesResponse>(
  { auth: true, expose: true, method: "GET", path: "/documents/templates" },
  async () => {
    const templates = await db.queryAll<any>`
      SELECT id, name, type, content, placeholders, state, district, is_active, created_by, created_at
      FROM templates
      WHERE is_active = TRUE
      ORDER BY created_at DESC
    `;

    return {
      templates: templates.map(t => ({
        ...t,
        placeholders: JSON.parse(t.placeholders),
        isActive: t.is_active,
        createdBy: t.created_by,
        createdAt: t.created_at,
      })),
    };
  }
);
