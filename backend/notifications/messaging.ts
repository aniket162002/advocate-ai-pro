import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { secret } from "encore.dev/config";

const twilioSid = secret("TwilioSID");
const twilioToken = secret("TwilioToken");
const whatsappApiKey = secret("WhatsAppAPIKey");

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
    const auth = getAuthData()!;
    
    if (auth.role !== "lawyer" && auth.role !== "admin") {
      throw new Error("Only lawyers and admins can send notifications");
    }

    // Simulate sending notification
    let messageId: string;
    
    switch (req.type) {
      case "sms":
        messageId = `sms_${Date.now()}`;
        // Integrate with Twilio SMS API
        break;
      case "email":
        messageId = `email_${Date.now()}`;
        // Integrate with email service
        break;
      case "whatsapp":
        messageId = `whatsapp_${Date.now()}`;
        // Integrate with WhatsApp Business API
        break;
      default:
        throw new Error("Invalid notification type");
    }

    return {
      success: true,
      messageId,
    };
  }
);
