import { type NextRequest } from "next/server";
import { createClient } from "@/supabase/middleware";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

const locales = ["en", "fr"];
const defaultLocale = "en";

export async function middleware(request: NextRequest) {
	// Step 1. Redirect if there's no locale.
	const redirectResponse = redirectLocale(request);
	if (redirectResponse) return redirectResponse;

	// Step 2. SUPABASE
	const { supabase, response } = createClient(request);

	// Refresh session if expired - required for Server Components
	// https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
	await supabase.auth.getSession();

	return response;
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon (favicon file)
		 * - monitoring (health check)
		 * - img (static images, in /public)
		 * - js (JavaScript files, in /public)
		 * - v0,v1 (api.reacher.email/v0/...)
		 * - version (api.reacher.email/version)
		 */
		"/((?!api|_next/static|_next/image|favicon|monitoring|img|js|v0|v1|version).*)",
	],
};

function redirectLocale(request: NextRequest): Response | undefined {
	// Followed:
	// https://nextjs.org/docs/app/building-your-application/routing/internationalization

	const { pathname } = request.nextUrl;

	if (pathname.startsWith("/api") || pathname.startsWith("/auth")) return;

	// Check if there is any supported locale in the pathname
	const pathnameHasLocale = locales.some(
		(locale) =>
			pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
	);

	if (!pathnameHasLocale) {
		// Redirect if there is no locale
		const locale = getLocale(request);
		request.nextUrl.pathname = `/${locale}${pathname}`;
		// e.g. incoming request is /products
		// The new URL is now /en/products
		return Response.redirect(request.nextUrl);
	}
}

function getLocale({ headers }: NextRequest): string {
	const languages = new Negotiator({
		headers: {
			"accept-language": headers.get("accept-language") || undefined,
		},
	}).languages(locales);

	return match(languages, locales, defaultLocale);
}
