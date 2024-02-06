<script>
	import { supabase } from '$lib/supabase.js';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	onMount(async () => {
		let { error } = await supabase.auth.signOut();
		if (error) {
			console.error(error);
		}
		goto('/');
	});
</script>
