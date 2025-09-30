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
	<title>App Name</title>
	<meta name="description" content="SvelteKit + Supabase starter template" />
</svelte:head>

<!-- Navigation -->
<nav class="bg-black text-white p-4">
	<div class="max-w-6xl mx-auto flex justify-between items-center">
		<a href="/" class="text-xl font-bold">App Name</a>

		<div class="flex items-center space-x-6">
			{#if data.session}
				<span class="text-gray-300">
					{data.session.profile?.firstName || data.session.user.email}
				</span>
				<form method="POST" action="/?/logout" class="inline">
					<button type="submit" class="hover:text-gray-300 transition-colors">
						Logout
					</button>
				</form>
			{:else}
				<a href="/auth/login" class="hover:text-gray-300 transition-colors">Login</a>
				<a href="/auth/register" class="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors">
					Sign Up
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
		<p>&copy; 2024 App Name</p>
	</div>
</footer>
