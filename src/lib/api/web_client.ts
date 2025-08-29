import axios from "axios";
import {headers} from "next/headers";

export function makeServerApi(cookieHeader?: string, bearer?: string) {
	const instance = axios.create({
		baseURL: process.env.API_BASE_URL,  // FastAPI
		timeout: 10_000,
		withCredentials: true,              // важно для проксирования Set-Cookie
		headers: {
			...(cookieHeader ? { Cookie: cookieHeader } : {}),
			...(bearer ? { Authorization: `Bearer ${bearer}` } : {}),
		},
	});

	instance.interceptors.request.use(
		headers
	);

	instance.interceptors.response.use();

	return instance;
}
