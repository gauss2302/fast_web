'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import UserMenu from './UserMenu';
import {cn} from "@/utils/utils";

export default function Navbar() {
	const pathname = usePathname();
	const { isAuthenticated, isRecruiter } = useAuth();

	const navigation = [
		{ name: 'Home', href: '/' },
		{ name: 'Jobs', href: '/jobs' },
		{ name: 'Companies', href: '/companies' },
	];

	// Добавляем рекрутерские ссылки
	if (isRecruiter) {
		navigation.push(
			{ name: 'Dashboard', href: '/recruiter/dashboard' },
			{ name: 'Post Job', href: '/recruiter/jobs/new' }
		);
	}

	return (
		<nav className="bg-white shadow-sm border-b border-gray-200">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					{/* Logo */}
					<div className="flex items-center">
						<Link href="/" className="flex items-center">
							<div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
								<span className="text-white font-bold text-lg">J</span>
							</div>
							<span className="ml-2 text-xl font-bold text-gray-900">JobBoard</span>
						</Link>
					</div>

					{/* Navigation */}
					<div className="hidden md:block">
						<div className="ml-10 flex items-baseline space-x-4">
							{navigation.map((item) => (
								<Link
									key={item.name}
									href={item.href}
									className={cn(
										'px-3 py-2 rounded-md text-sm font-medium transition-colors',
										pathname === item.href
											? 'bg-indigo-100 text-indigo-700'
											: 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
									)}
								>
									{item.name}
								</Link>
							))}
						</div>
					</div>

					{/* User Menu */}
					<div className="flex items-center">
						<UserMenu />
					</div>
				</div>
			</div>

			{/* Mobile navigation */}
			<div className="md:hidden">
				<div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200">
					{navigation.map((item) => (
						<Link
							key={item.name}
							href={item.href}
							className={cn(
								'block px-3 py-2 rounded-md text-base font-medium transition-colors',
								pathname === item.href
									? 'bg-indigo-100 text-indigo-700'
									: 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
							)}
						>
							{item.name}
						</Link>
					))}
				</div>
			</div>
		</nav>
	);
}
