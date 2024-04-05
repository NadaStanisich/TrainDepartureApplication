<script lang="ts">
	
	import '../app.pcss';
	import { onMount } from 'svelte';
	import { selectedColour } from '$lib/colour.js'; // Import selectedColour store
   
	const dev = import.meta.env.VITE_APP_ENV === 'development';
	//console.log('dev', dev);

	let backgroundColor = '#3B82F6'; // Default background color
	
	// Update background color when the component mounts and whenever the selected color changes
	onMount(() => {
	  document.body.style.backgroundColor = backgroundColor;
	  selectedColour.subscribe(value => {
		backgroundColor = value;
		document.body.style.backgroundColor = backgroundColor;
	  });
	});
	
</script>

<main style={dev ? 'border-top: 9px solid red;' : ``}>
		<slot /> 
	
</main>