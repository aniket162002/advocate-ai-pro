import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";

export interface SendNotificationRequest {
  recipientId: string;
  message: string;
  type: "sms" | "email" | "whatsapp";
  urgent?: boolean;
}

export interface NotificationResponse {
  success: boolean;
  messageId: string;
}

// Sends real-time notifications via SMS, email, or WhatsApp.
export const sendNotification = api<SendNotificationRequest, NotificationResponse>(
  { auth: true, expose: true, method: "POST", path: "/notifications/send" },
  async (req) => {
    try {
      const auth = getAuthData()!;
      
      if (auth.role !== "lawyer" && auth.role !== "admin") {
        throw new Error("Only lawyers and admins can send notifications");
      }

      if (!req.recipientId || !req.message) {
        throw new Error("Recipient ID and message are required");
      }

      if (!["sms", "email", "whatsapp"].includes(req.type)) {
        throw new Error("Invalid notification type");
      }

      // Simulate sending notification
      let messageId: string;
      
      switch (req.type) {
        case "sms":
          messageId = `sms_${Date.now()}`;
          // In production, integrate with Twilio SMS API
          console.log(`SMS sent to ${req.recipientId}: ${req.message}`);
          break;
        case "email":
          messageId = `email_${Date.now()}`;
          // In production, integrate with email service
          console.log(`Email sent to ${req.recipientId}: ${req.message}`);
          break;
        case "whatsapp":
          messageId = `whatsapp_${Date.now()}`;
          // In production, integrate with WhatsApp Business API
          console.log(`WhatsApp sent to ${req.recipientId}: ${req.message}`);
          break;
        default:
          throw new Error("Invalid notification type");
      }

      return {
        success: true,
        messageId,
      };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Failed to send notification");
    }
  }
);
