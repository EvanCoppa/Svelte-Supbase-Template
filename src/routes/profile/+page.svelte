<script lang="ts">
	import { getContext } from 'svelte';
	import { goto } from '$app/navigation';
	import type { SessionData } from '$lib/types/auth';

	const session = getContext<SessionData | null>('session');

	// Redirect to login if not authenticated
	$effect(() => {
		if (!session) {
			goto('/auth/login');
		}
			console.log(session.profile);

	});

	function formatDate(date: Date | string): string {
		return new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		}).format(new Date(date));
	}

</script>

<svelte:head>
	<title>Profile</title>
</svelte:head>

{#if session}
	<div class="max-w-4xl mx-auto px-4 py-12">
		<div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
			<!-- Profile Header -->
			<div class="bg-gradient-to-r from-gray-800 to-gray-900 px-8 py-12">
				<div class="flex items-center space-x-6">
					{#if session.profile?.avatar}
						<img
							src={session.profile.avatar}
							alt="Profile"
							class="w-24 h-24 rounded-full border-4 border-white object-cover"
						/>
					{:else}
						<div class="w-24 h-24 rounded-full border-4 border-white bg-gray-600 flex items-center justify-center">
							<span class="text-3xl font-bold text-white">
								{session.profile?.firstName?.charAt(0) || session.user.email?.charAt(0).toUpperCase()}
							</span>
						</div>
					{/if}
					<div class="text-white">
						<h1 class="text-3xl font-bold mb-2">
							{#if session.profile?.firstName || session.profile?.lastName}
								{session.profile.firstName} {session.profile.lastName}
							{:else}
								User Profile
							{/if}
						</h1>
						{#if session.profile?.username}
							<p class="text-gray-300">@{session.profile.username}</p>
						{/if}
					</div>
				</div>
			</div>

			<!-- Profile Content -->
			<div class="px-8 py-6 space-y-6">
				<!-- Bio Section -->
				{#if session.profile?.bio}
					<div>
						<h2 class="text-lg font-semibold mb-2">Bio</h2>
						<p class="text-gray-700">{session.profile.bio}</p>
					</div>
					<hr class="border-gray-200" />
				{/if}

				<!-- Account Information -->
				<div>
					<h2 class="text-lg font-semibold mb-4">Account Information</h2>
					<div class="space-y-4">
						<div class="grid grid-cols-3 gap-4">
							<span class="text-gray-600 font-medium">Email:</span>
							<span class="col-span-2 text-gray-900">{session.user.email}</span>
						</div>

						{#if session.profile?.role}
							<div class="grid grid-cols-3 gap-4">
								<span class="text-gray-600 font-medium">Role:</span>
								<span class="col-span-2 text-gray-900 capitalize">{session.profile.role}</span>
							</div>
						{/if}

						{#if session.profile?.isVerified !== undefined}
							<div class="grid grid-cols-3 gap-4">
								<span class="text-gray-600 font-medium">Status:</span>
								<span class="col-span-2">
									{#if session.profile.isVerified}
										<span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
											Verified
										</span>
									{:else}
										<span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
											Unverified
										</span>
									{/if}
								</span>
							</div>
						{/if}

						{#if session.profile?.createdAt}
							<div class="grid grid-cols-3 gap-4">
								<span class="text-gray-600 font-medium">Member Since:</span>
								<span class="col-span-2 text-gray-900">{formatDate(session.profile.createdAt)}</span>
							</div>
						{/if}
					</div>
				</div>

				<!-- Actions -->
				<hr class="border-gray-200" />
				<div class="flex justify-between items-center pt-4">
					<button
						onclick={() => goto('/')}
						class="text-gray-600 hover:text-gray-800 transition-colors"
					>
						← Back to Home
					</button>
					<button
						class="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-700 transition-colors"
					>
						Edit Profile
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}