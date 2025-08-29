import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../[...nextauth]/authOptions';
import axios from 'axios';
import {BACKEND_URL} from "@/utils/server_provider";


export async function GET() {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.accessToken) {
			return NextResponse.json(
				{ message: 'Not authenticated' },
				{ status: 401 }
			);
		}

		// Get fresh user data from backend
		const response = await axios.get(`${BACKEND_URL}/api/v1/auth/web/me`, {
			headers: {
				'Authorization': `Bearer ${session.accessToken}`,
			},
		});

		const user = response.data;

		return NextResponse.json({
			user,
			session: {
				isAuthenticated: true,
				isAdmin: user.is_superuser,
				isRecruiter: !!user.recruiter_profile
			}
		});

	} catch (error) {
		console.error('Me endpoint error:', error);

		if (axios.isAxiosError(error) && error.response?.status === 401) {
			return NextResponse.json(
				{ message: 'Token expired' },
				{ status: 401 }
			);
		}

		return NextResponse.json(
			{ message: 'Internal server error' },
			{ status: 500 }
		);
	}
}
