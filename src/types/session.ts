// Session type
interface Session {
  expiresAt: string;
  token: string;
  createdAt: string;
  updatedAt: string;
  ipAddress: string;
  userAgent: string;
  userId: string;
  impersonatedBy: null | string;
  id: string;
}

// User type
interface User {
  name: string;
  email: string;
  emailVerified: boolean;
  image: string;
  createdAt: string;
  updatedAt: string;
  role: 'user' | 'admin' | 'provider'; // Add other roles as needed
  banned: boolean;
  banReason: null | string;
  banExpires: null | string;
  hasShop: boolean;
  id: string;
}

// Complete session response type
interface SessionResponse {
  session: Session;
  user: User;
}

// Or if you want a more reusable approach with generics
export type SessionData = {
  session: Session;
  user: User;
};
