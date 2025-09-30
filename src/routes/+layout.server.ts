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

    // Get user profile if authenticated
    let userProfile = null;
    if (user) {
      console.log('Authenticated user:', user);

      // Extract name from Google OAuth or other providers
      const fullName = user.user_metadata?.full_name || user.user_metadata?.name || '';
      const nameParts = fullName.split(' ');
      const firstName = user.user_metadata?.firstName || nameParts[0] || 'User';
      const lastName = user.user_metadata?.lastName || nameParts.slice(1).join(' ') || '';

      // Get avatar from Google OAuth or other providers
      const avatar = user.user_metadata?.avatar_url || user.user_metadata?.picture || undefined;

      // In production this would come from user_profiles table
      userProfile = {
        id: user.id,
        username: user.user_metadata?.username || user.email?.split('@')[0] || 'user',
        firstName,
        lastName,
        avatar,
        bio: user.user_metadata?.bio,
        role: 'buyer',
        isVerified: user.user_metadata?.email_verified || false,
        createdAt: new Date(user.created_at || Date.now()),
        updatedAt: new Date(user.updated_at || Date.now())
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