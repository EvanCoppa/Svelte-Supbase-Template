<script lang="ts">
	import { goto } from '$app/navigation';
	import { getContext } from 'svelte';
	import type { PageData } from './$types';
	import type { SessionData } from '$lib/types/auth';

	let { data }: { data: PageData } = $props();
	const session = getContext<SessionData | null>('session');

	function formatPrice(price: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 0
		}).format(price);
	}

	function formatDate(date: Date): string {
		return new Intl.DateTimeFormat('en-US', {
			month: 'short',
			day: 'numeric',
			hour: 'numeric',
			minute: '2-digit'
		}).format(new Date(date));
	}
</script>

<svelte:head>
	<title>Smile Design Gallery - Brutalist Art Marketplace</title>
</svelte:head>

<!-- Hero Section -->
<section class="bg-black text-white py-20">
	<div class="max-w-6xl mx-auto px-4 text-center">
		<h1 class="text-6xl font-bold mb-6 tracking-tight">
			BRUTALIST<br />
			ART MARKETPLACE
		</h1>
		<p class="text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
			Raw. Uncompromising. Direct. Buy and sell art through live auctions, silent bids, or immediate purchase.
		</p>

		{#if session}
			<div class="space-y-4">
				<p class="text-lime-400 text-lg">
					Welcome back, {session.profile?.firstName || session.user.email}
				</p>
				<div class="flex justify-center space-x-4">
					<button
						onclick={() => goto('/gallery')}
						class="bg-lime-400 text-black px-8 py-3 text-lg font-bold hover:bg-lime-300 transition-colors"
					>
						BROWSE GALLERY
					</button>
					<button
						onclick={() => goto('/profile')}
						class="border-2 border-white text-white px-8 py-3 text-lg font-bold hover:bg-white hover:text-black transition-colors"
					>
						MY PROFILE
					</button>
				</div>
			</div>
		{:else}
			<div class="flex justify-center space-x-4">
				<button
					onclick={() => goto('/auth/signup')}
					class="bg-lime-400 text-black px-8 py-3 text-lg font-bold hover:bg-lime-300 transition-colors"
				>
					START BIDDING
				</button>
				<button
					onclick={() => goto('/gallery')}
					class="border-2 border-white text-white px-8 py-3 text-lg font-bold hover:bg-white hover:text-black transition-colors"
				>
					VIEW GALLERY
				</button>
			</div>
		{/if}
	</div>
</section>

<!-- Featured Artworks -->
<section class="py-16 bg-gray-100">
	<div class="max-w-6xl mx-auto px-4">
		<h2 class="text-4xl font-bold mb-12 text-center">FEATURED WORKS</h2>

		<div class="grid md:grid-cols-3 gap-8">
			{#each data.featuredArtworks as artwork}
				<div class="bg-white border-4 border-black">
					<img src={artwork.imageUrl} alt={artwork.title} class="w-full h-64 object-cover" />
					<div class="p-6">
						<h3 class="text-xl font-bold mb-2">{artwork.title}</h3>
						<p class="text-gray-600 mb-4">by {artwork.artist}</p>

						{#if artwork.saleMode === 'buy_now'}
							<p class="text-2xl font-bold mb-4">{formatPrice(artwork.price || 0)}</p>
							<button
								onclick={() => goto(`/product/${artwork.id}`)}
								class="w-full bg-black text-white py-3 font-bold hover:bg-gray-800 transition-colors"
							>
								BUY NOW
							</button>
						{:else if artwork.saleMode === 'live_auction'}
							<p class="text-2xl font-bold mb-2">Current Bid: {formatPrice(artwork.currentBid || 0)}</p>
							<p class="text-sm text-gray-600 mb-4">LIVE AUCTION</p>
							<button
								onclick={() => goto(`/product/${artwork.id}`)}
								class="w-full bg-lime-400 text-black py-3 font-bold hover:bg-lime-300 transition-colors"
							>
								PLACE BID
							</button>
						{:else}
							<p class="text-2xl font-bold mb-2">{formatPrice(artwork.price || 0)}</p>
							<p class="text-sm text-gray-600 mb-4">SILENT AUCTION</p>
							<button
								onclick={() => goto(`/product/${artwork.id}`)}
								class="w-full bg-gray-800 text-white py-3 font-bold hover:bg-gray-700 transition-colors"
							>
								SUBMIT BID
							</button>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Live Auctions -->
{#if data.liveAuctions.length > 0}
	<section class="py-16 bg-black text-white">
		<div class="max-w-6xl mx-auto px-4">
			<h2 class="text-4xl font-bold mb-12 text-center">LIVE AUCTIONS</h2>

			<div class="grid md:grid-cols-2 gap-8">
				{#each data.liveAuctions as auction}
					<div class="border-2 border-lime-400 p-6">
						<h3 class="text-2xl font-bold mb-2">{auction.title}</h3>
						<p class="text-gray-300 mb-4">by {auction.artist}</p>
						<div class="flex justify-between items-center mb-4">
							<div>
								<p class="text-3xl font-bold text-lime-400">{formatPrice(auction.currentBid)}</p>
								<p class="text-sm text-gray-400">{auction.bidCount} bids</p>
							</div>
							<div class="text-right">
								<p class="text-sm text-gray-400">Ends</p>
								<p class="font-bold">{formatDate(auction.endTime)}</p>
							</div>
						</div>
						<button
							onclick={() => goto(`/product/${auction.id}`)}
							class="w-full bg-lime-400 text-black py-3 font-bold hover:bg-lime-300 transition-colors"
						>
							JOIN AUCTION
						</button>
					</div>
				{/each}
			</div>
		</div>
	</section>
{/if}

<!-- Upcoming Events -->
{#if data.upcomingEvents.length > 0}
	<section class="py-16 bg-white">
		<div class="max-w-6xl mx-auto px-4">
			<h2 class="text-4xl font-bold mb-12 text-center">UPCOMING EVENTS</h2>

			<div class="grid md:grid-cols-2 gap-8">
				{#each data.upcomingEvents as event}
					<div class="border-4 border-black p-6">
						<h3 class="text-2xl font-bold mb-2">{event.title}</h3>
						<p class="text-gray-600 mb-2">{event.location}</p>
						<p class="text-lg font-bold mb-4">{formatDate(event.date)}</p>
						<button
							onclick={() => goto('/events')}
							class="bg-black text-white px-6 py-2 font-bold hover:bg-gray-800 transition-colors"
						>
							LEARN MORE
						</button>
					</div>
				{/each}
			</div>
		</div>
	</section>
{/if}

<!-- Call to Action -->
<section class="py-20 bg-lime-400 text-black">
	<div class="max-w-4xl mx-auto px-4 text-center">
		<h2 class="text-5xl font-bold mb-6">READY TO START?</h2>
		<p class="text-xl mb-8">
			Join our community of artists and collectors. Buy, sell, and discover brutalist art.
		</p>

		{#if session}
			<div class="space-x-4">
				<button
					onclick={() => goto('/gallery')}
					class="bg-black text-white px-8 py-3 text-lg font-bold hover:bg-gray-800 transition-colors"
				>
					EXPLORE GALLERY
				</button>
				<button
					onclick={() => goto('/events')}
					class="border-2 border-black text-black px-8 py-3 text-lg font-bold hover:bg-black hover:text-white transition-colors"
				>
					VIEW EVENTS
				</button>
			</div>
		{:else}
			<div class="space-x-4">
				<button
					onclick={() => goto('/auth/signup')}
					class="bg-black text-white px-8 py-3 text-lg font-bold hover:bg-gray-800 transition-colors"
				>
					CREATE ACCOUNT
				</button>
				<button
					onclick={() => goto('/auth/login')}
					class="border-2 border-black text-black px-8 py-3 text-lg font-bold hover:bg-black hover:text-white transition-colors"
				>
					SIGN IN
				</button>
			</div>
		{/if}
	</div>
</section>