<script lang="ts">
	import ReviewCard from './ReviewCard.svelte';
	let { ratings }: { ratings: Review[] } = $props();

	interface Review {
		id: number;
		userId: string;
		professorId: number;
		rating: number;
		courseId: number;
		review: string;
		createdAt: Date;
		classNum: string;
		classTitle: string | undefined;
	}
</script>

<div class="flex flex-wrap px-2">
	{#if ratings.length === 0}
		<div class="card w-full bg-base-300 shadow-xl">
			<div class="card-body">
				<div class="flex justify-center text-center">
					<p class="text-2xl text-gray-400">No reviews yet</p>
				</div>
			</div>
		</div>
	{:else}
		{#each ratings as review}
			<div class="mb-4 w-full px-2">
				<ReviewCard {review} />
			</div>
		{/each}
	{/if}
</div>
