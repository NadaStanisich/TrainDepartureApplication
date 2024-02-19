<script>
	import '../app.pcss';

	const dev = import.meta.env.VITE_APP_ENV === 'development';
	//console.log('dev', dev);

</script>

<main style={dev ? 'border-top: 9px solid red;' : ``}>
	<div class="h-screen bg-blue-400">	
		<slot />
	</div>
</main>