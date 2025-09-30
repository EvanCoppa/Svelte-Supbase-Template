<script lang="ts">
	import { goto } from '$app/navigation';
	import { getContext } from 'svelte';
	import type { SessionData } from '$lib/types/auth';

	const session = getContext<SessionData | null>('session');
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-16 text-center">
	<h1 class="text-5xl font-bold mb-6">Welcome</h1>
	<p class="text-xl text-gray-600 mb-8">
		This is a SvelteKit + Supabase starter template with authentication built in.
	</p>

	{#if session}
		<p class="text-lg mb-6">
			Welcome back, {session.profile?.firstName || session.user.email}!
		</p>
		<div class="flex justify-center gap-4">
			<button
				onclick={() => goto('/profile')}
				class="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors"
			>
				View Profile
			</button>
		</div>
	{:else}
		<div class="flex justify-center gap-4">
			<button
				onclick={() => goto('/auth/login')}
				class="border-2 border-black text-black px-6 py-3 rounded hover:bg-black hover:text-white transition-colors"
			>
				Sign In
			</button>
			<button
				onclick={() => goto('/auth/register')}
				class="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors"
			>
				Sign Up
			</button>
		</div>
	{/if}
</div>