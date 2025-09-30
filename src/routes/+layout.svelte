<script lang="ts">
	import '../app.css';
	import { setContext, onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import { supabase } from '$lib/supabase';
	import favicon from '$lib/assets/favicon.svg';
	import type { LayoutData } from './$types';
	import { createBrowserClient } from '@supabase/ssr';
	
	let { children, data }: { children: any; data: LayoutData } = $props();
	
	// Set session context for child components
	setContext('session', data.session);
	
	onMount(() => {
		const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
			console.log('Auth state change detected');
			invalidateAll();
		});
	
		return () => {
			subscription.unsubscribe();
		};
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Smile Design Gallery - Art Marketplace</title>
	<meta name="description" content="A brutalist art marketplace for buying and selling artwork through auctions and direct sales" />
</svelte:head>

<!-- Navigation -->
<nav class="bg-black text-white p-4">
	<div class="max-w-6xl mx-auto flex justify-between items-center">
		<a href="/" class="text-2xl font-bold">SMILE DESIGN GALLERY</a>

		<div class="flex items-center space-x-6">
			<a href="/gallery" class="hover:text-lime-400 transition-colors">GALLERY</a>
			<a href="/events" class="hover:text-lime-400 transition-colors">EVENTS</a>

			{#if data.session}
				<span class="text-lime-400">
					{data.session.profile?.firstName || data.session.user.email}
				</span>
				<form method="POST" action="/?/logout" class="inline">
					<button type="submit" class="hover:text-lime-400 transition-colors">
						LOGOUT
					</button>
				</form>
			{:else}
				<a href="/auth/login" class="hover:text-lime-400 transition-colors">LOGIN</a>
				<a href="/auth/signup" class="bg-lime-400 text-black px-4 py-2 hover:bg-lime-300 transition-colors">
					SIGN UP
				</a>
			{/if}
		</div>
	</div>
</nav>

<!-- Main Content -->
<main class="min-h-screen bg-white">
	{@render children?.()}
</main>

<!-- Footer -->
<footer class="bg-black text-white p-8">
	<div class="max-w-6xl mx-auto text-center">
		<p>&copy; 2024 Smile Design Gallery. A brutalist art marketplace.</p>
		<div class="mt-4 space-x-4">
			<a href="/about" class="hover:text-lime-400 transition-colors">ABOUT</a>
			<a href="/contact" class="hover:text-lime-400 transition-colors">CONTACT</a>
			<a href="/terms" class="hover:text-lime-400 transition-colors">TERMS</a>
			<a href="/privacy" class="hover:text-lime-400 transition-colors">PRIVACY</a>
		</div>
	</div>
</footer>
