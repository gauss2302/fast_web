import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../[...nextauth]/authOptions';
import axios from 'axios';
import {BACKEND_URL} from "@/utils/server_provider";

export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json(
				{ message: 'Not authenticated' },
				{ status: 401 }
			);
		}

		// Get cookies from request
		const cookies = request.headers.get('cookie') || '';

		// Refresh token through backend
		const response = await axios.post(`${BACKEND_URL}/api/v1/auth/web/refresh`, {}, {
			headers: {
				'Cookie': cookies,
			},
			withCredentials: true,
		});

		const refreshedTokens = response.data;

		return NextResponse.json({
			accessToken: refreshedTokens.access_token,
			expiresIn: refreshedTokens.expires_in,
		});

	} catch (error) {
		console.error('Token refresh error:', error);

		if (axios.isAxiosError(error) && error.response?.status === 401) {
			return NextResponse.json(
				{ message: 'Refresh token expired' },
				{ status: 401 }
			);
		}

		return NextResponse.json(
			{ message: 'Failed to refresh token' },
			{ status: 500 }
		);
	}
}
