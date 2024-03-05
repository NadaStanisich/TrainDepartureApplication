<script lang="ts">
	import '../app.pcss';
   
	const dev = import.meta.env.VITE_APP_ENV === 'development';
	//console.log('dev', dev);
	// Cannot use selectedColour directly in the style attribute as it is a `reactive variable`?
	
</script>

<main style={dev ? 'border-top: 9px solid red;' : ``}>
		<slot />
<style>
	body{
		
		/* assign blue as the background color */
		/* create a variable to store the background color */
		background-color: #3B82F6; 
		
	}	
</style>
	
</main>