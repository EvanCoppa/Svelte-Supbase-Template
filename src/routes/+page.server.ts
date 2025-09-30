import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { createSupabaseServerClient } from '$lib/supabase.server';

export const load: PageServerLoad = async ({ parent }) => {
  const { session } = await parent();

  // Mock featured content - in production this would come from database
  const featuredArtworks = [
    {
      id: '1',
      title: 'CONCRETE DREAMS',
      artist: 'ALEX BRUTALIST',
      price: 2500,
      imageUrl: 'https://via.placeholder.com/400x300/000000/FFFFFF?text=CONCRETE+DREAMS',
      saleMode: 'buy_now'
    },
    {
      id: '2',
      title: 'STEEL EMOTION',
      artist: 'SARAH HARSH',
      currentBid: 1800,
      imageUrl: 'https://via.placeholder.com/400x300/000000/FFFFFF?text=STEEL+EMOTION',
      saleMode: 'live_auction'
    },
    {
      id: '3',
      title: 'RAW VISION',
      artist: 'MIKE MINIMAL',
      price: 3200,
      imageUrl: 'https://via.placeholder.com/400x300/000000/FFFFFF?text=RAW+VISION',
      saleMode: 'silent_auction'
    }
  ];

  const liveAuctions = [
    {
      id: '2',
      title: 'STEEL EMOTION',
      artist: 'SARAH HARSH',
      currentBid: 1800,
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      bidCount: 12
    }
  ];

  const upcomingEvents = [
    {
      id: '1',
      title: 'BRUTALIST SHOWCASE',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      location: 'GALLERY MAIN FLOOR',
      type: 'exhibition'
    }
  ];

  return {
    featuredArtworks,
    liveAuctions,
    upcomingEvents,
    session
  };
};

export const actions: Actions = {
  logout: async (event) => {
    const supabase = createSupabaseServerClient(event);
    const { error } = await supabase.auth.signOut();

    if (error) {
      return fail(500, {
        error: 'Error logging out'
      });
    }

    throw redirect(302, '/');
  }
};