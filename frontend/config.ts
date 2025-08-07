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

// Demo credentials for testing
export const demoCredentials = {
  admin: {
    email: 'admin@advocateai.com',
    password: 'admin123',
  },
  lawyer: {
    email: 'lawyer@advocateai.com',
    password: 'lawyer123',
  },
  user: {
    email: 'user@advocateai.com',
    password: 'user123',
  },
};
