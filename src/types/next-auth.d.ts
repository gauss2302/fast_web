import { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
	interface Session extends DefaultSession {
		accessToken?: string;
		backendUser?: {
			id: string;
			email: string;
			full_name?: string;
			avatar_url?: string;
			is_active: boolean;
			is_superuser: boolean;
			created_at: string;
			updated_at: string;
			last_login?: string;
			recruiter_profile?: unknown;
		};
		user: {
			id: string;
			name?: string | null;
			email?: string | null;
			image?: string | null;
		};
	}

	interface User extends DefaultUser {
		accessToken?: string;
		refreshToken?: string;
		expiresAt?: number;
		backendUser?: Session['backendUser'];
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		accessToken?: string;
		refreshToken?: string;
		expiresAt?: number;
		backendUser?: Session['backendUser'];
		error?: string;
		sub: string;
	}
}
