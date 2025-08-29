'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function UserMenu() {
	const { user, isAuthenticated, isAdmin, signOut } = useAuth();
	const [isOpen, setIsOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);
	const router = useRouter();

	// Close menu when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		}

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleSignOut = async () => {
		await signOut();
		setIsOpen(false);
		router.push('/');
	};

	if (!isAuthenticated || !user) {
		return (
			<div className="flex items-center space-x-4">
				<Link
					href="/auth/signin"
					className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
				>
					Sign In
				</Link>
				<Link
					href="/auth/signup"
					className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
				>
					Sign Up
				</Link>
			</div>
		);
	}

	return (
		<div className="relative" ref={menuRef}>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
				id="user-menu-button"
				aria-expanded={isOpen}
				aria-haspopup="true"
			>
				<span className="sr-only">Open user menu</span>
				{user.avatar_url ? (
					<img
						className="h-8 w-8 rounded-full object-cover"
						src={user.avatar_url}
						alt={user.full_name || user.email}
					/>
				) : (
					<div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
            </span>
					</div>
				)}
				<span className="ml-2 text-gray-700 font-medium hidden sm:block">
          {user.full_name || user.email}
        </span>
				<svg
					className="ml-1 h-4 w-4 text-gray-400"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</button>

			{isOpen && (
				<div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
					<div className="py-1" role="none">
						<div className="px-4 py-2 border-b border-gray-200">
							<p className="text-sm text-gray-900 font-medium">
								{user.full_name || 'User'}
							</p>
							<p className="text-sm text-gray-500 truncate">
								{user.email}
							</p>
						</div>

						<Link
							href="/profile"
							className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
							role="menuitem"
							onClick={() => setIsOpen(false)}
						>
							Your Profile
						</Link>

						<Link
							href="/settings"
							className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
							role="menuitem"
							onClick={() => setIsOpen(false)}
						>
							Settings
						</Link>

						{isAdmin && (
							<Link
								href="/admin"
								className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
								role="menuitem"
								onClick={() => setIsOpen(false)}
							>
								Admin Panel
							</Link>
						)}

						<hr className="my-1" />

						<button
							onClick={handleSignOut}
							className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
							role="menuitem"
						>
							Sign Out
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
