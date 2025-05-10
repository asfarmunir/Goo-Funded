import { DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user?: {
      id: string;
      name?: string;
      email?: string;
      image?: string;
      totalReferrals?: number;
    };
  }

  interface User extends DefaultUser {
    id: string;
  }
}