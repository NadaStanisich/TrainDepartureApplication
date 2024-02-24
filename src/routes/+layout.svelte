<script lang="ts">
	import '../app.pcss';
	import { selectedColour } from '$lib/colour.js';

	const dev = import.meta.env.VITE_APP_ENV === 'development';
	//console.log('dev', dev);

	//console.log('selectedColour', selectedColour);
	// Cannot use selectedColour directly in the style attribute as it is a `reactive variable`?
	
</script>

<main style={dev ? 'border-top: 9px solid red;' : ``}>
		<slot />
<style>
	body{
		background-color: #3B82F6; 
	}
</style>
	
</main>