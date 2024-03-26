<script>
	import { supabase } from '$lib/supabase.js';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { selectedColour } from '$lib/colour.js';

	onMount(async () => {
		let { error } = await supabase.auth.signOut();
		if (error) {
			console.error(error);
		}
		selectedColour.set('#3B82F6');
		goto('/');
	});
</script>
