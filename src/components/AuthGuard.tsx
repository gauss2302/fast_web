'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

interface AuthGuardProps {
	children: React.ReactNode;
	requireAuth?: boolean;
	requireAdmin?: boolean;
	requireRecruiter?: boolean;
	fallbackUrl?: string;
	loadingComponent?: React.ReactNode;
}

export default function AuthGuard({
									  children,
									  requireAuth = false,
									  requireAdmin = false,
									  requireRecruiter = false,
									  fallbackUrl = '/auth/signin',
									  loadingComponent
								  }: AuthGuardProps) {
	const { isAuthenticated, isAdmin, isRecruiter, loading, user } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (loading) return; // Still loading

		// Check authentication requirement
		if (requireAuth && !isAuthenticated) {
			router.push(`${fallbackUrl}?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
			return;
		}

		// Check admin requirement
		if (requireAdmin && !isAdmin) {
			router.push('/403');
			return;
		}

		// Check recruiter requirement
		if (requireRecruiter && !isRecruiter) {
			router.push('/become-recruiter');
			return;
		}
	}, [isAuthenticated, isAdmin, isRecruiter, loading, router, requireAuth, requireAdmin, requireRecruiter, fallbackUrl]);

	// Show loading while checking auth
	if (loading) {
		return loadingComponent || (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
			</div>
		);
	}

	// Don't render protected content if requirements not met
	if (requireAuth && !isAuthenticated) return null;
	if (requireAdmin && !isAdmin) return null;
	if (requireRecruiter && !isRecruiter) return null;

	return <>{children}</>;
}
