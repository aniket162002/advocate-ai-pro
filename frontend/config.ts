// The Clerk publishable key, to initialize Clerk.
// TODO: Set this to your Clerk publishable key, which can be found in the Clerk dashboard.
export const clerkPublishableKey = "";

// API configuration
export const apiConfig = {
  baseUrl: process.env.NODE_ENV === 'production' ? 'https://your-app.com' : 'http://localhost:4000',
};

// Feature flags
export const features = {
  enableVoiceInput: true,
  enableArgumentSimulator: true,
  enableRealTimeNotifications: true,
};
