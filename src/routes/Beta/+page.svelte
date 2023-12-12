<script lang="ts">
import type { PageData } from './$types';
import EditBottle from './EditBottle.svelte';
export let data: PageData;
$: bottles = data.bottles;
</script>

<EditBottle form={data.form} />

{#each bottles as bottle}
	<br />
	<p>{JSON.stringify(bottle,null,2)}</p>
{/each}
