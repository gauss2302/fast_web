export interface User {
	id: string;
	email: string;
	full_name?: string;
	avatar_url?: string;
	is_active: boolean;
	is_superuser: boolean;
	created_at: string;
	updated_at: string;
	last_login?: string;
	recruiter_profile?: {
		id: string;
		company_id: string;
		status: 'pending' | 'approved' | 'rejected' | 'suspended';
		can_manage_company: boolean;
		is_active: boolean;
	};
}

export interface AuthContextType {
	user: User | null;
	session: any;
	loading: boolean;
	isAuthenticated: boolean;
	isAdmin: boolean;
	isRecruiter: boolean;
	signIn: (credentials: { email: string; password: string }) => Promise<{ success: boolean; error?: string }>;
	signOut: () => Promise<void>;
	register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
	refreshUser: () => Promise<void>;
}

export interface RegisterData {
	email: string;
	password: string;
	full_name?: string;
}

export interface LoginData {
	email: string;
	password: string;
}
