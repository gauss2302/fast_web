import { cookies, headers } from "next/headers";

export async function buildCookieHeaderFromServer(): Promise<string | null> {
	const cookieStore = await cookies();
	const all = cookieStore.getAll();
	if (!all.length) return null;
	return all.map(({ name, value }) => `${name}=${value}`).join("; ");
}

export async function getAccessFromNextCookie(): Promise<string | null> {
	const cookieStore = await cookies();
	return cookieStore.get("nxt_access")?.value ?? null;
}
