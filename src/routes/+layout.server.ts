import type { LayoutServerLoad } from './$types';
import { createSupabaseServerClient } from '$lib/supabase.server';

export const load: LayoutServerLoad = async (event) => {
  const supabase = createSupabaseServerClient(event);

  try {
    // Use getUser() instead of getSession() for better security
    const { data: { user }, error } = await supabase.auth.getUser();

    // Don't log "Auth session missing" as an error - it's normal when not logged in
    if (error && !error.message?.includes('Auth session missing')) {
      console.error('Error getting user:', error);
    }

    // Get user profile if authenticated (mock for now)
    let userProfile = null;
    if (user) {
      // Mock user profile - in production this would come from user_profiles table
      userProfile = {
        id: user.id,
        username: user.user_metadata?.username || 'user',
        firstName: user.user_metadata?.firstName || 'User',
        lastName: user.user_metadata?.lastName || '',
        role: 'buyer',
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }

    // Convert user to session format for compatibility
    const session = user ? { user, profile: userProfile } : null;

    return {
      session
    };
  } catch (error) {
    // If there's any error getting the user, just return no session
    return {
      session: null
    };
  }
};