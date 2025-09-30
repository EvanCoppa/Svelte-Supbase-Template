import type { Handle } from '@sveltejs/kit';
import { createSupabaseServerClient } from '$lib/supabase.server';
import { redirect } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// Create Supabase client
	const supabase = createSupabaseServerClient(event);

	// Define public routes that don't require authentication
	const publicRoutes = ['/auth/login', '/auth/register', '/auth/callback', '/register/invite', '/register/pending'];
	const isPublicRoute = publicRoutes.some(route => event.url.pathname.startsWith(route));

	// Skip authentication check for public routes
	if (isPublicRoute) {
		return resolve(event);
	}

	try {
		// Check for authentication
		const { data: { session } } = await supabase.auth.getSession();
		const { data: { user } } = await supabase.auth.getUser();

		// Redirect to login if not authenticated and not on a public route
		if (!session && !user) {
			console.log(`[Hooks] No authentication found, redirecting to login from: ${event.url.pathname}`);
			throw redirect(302, '/auth/login');
		}

		// Continue with the request if authenticated
		return resolve(event);
	} catch (error) {
		// If it's a redirect, re-throw it
		if (error instanceof Response && error.status >= 300 && error.status < 400) {
			throw error;
		}

		// For other errors, redirect to login
		console.error('[Hooks] Authentication error:', error);
		throw redirect(302, '/auth/login');
	}
};