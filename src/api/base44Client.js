import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "6945a6303463952f18ae3a77", 
  requiresAuth: true // Ensure authentication is required for all operations
});
