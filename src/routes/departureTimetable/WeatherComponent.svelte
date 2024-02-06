<script>
	import { onMount } from 'svelte';

	let weatherData = {};

	const openWeatherMapUrl = import.meta.env.PUBLIC_SUPABASE_WEATHER_URL;

	onMount(async () => {
		const response = await fetch('https://api.openweathermap.org/data/2.5/weather?q=Melbourne,au&appid=655d31f3a94eefed114602aa7f045194')
		weatherData = await response.json();
	});
</script>

<div class="text-lg font-bold text-gray-700 dark:text-white border border-gray-300 p-4 mt-4">
	{#if weatherData}
		{#if weatherData.main}
			<h1>{weatherData.name}</h1>
			<div class="flex items-center">
				<img src="http://openweathermap.org/img/w/{(weatherData.weather && weatherData.weather[0].icon) || ''}.png" alt="Weather Icon" />
				<h5 class="mb-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{Math.round(weatherData.main.temp - 273.15)}°C</h5>
			</div>
			<p class="font-normal text-gray-700 dark:text-gray-400 leading-tight">{weatherData.weather[0].description}</p>
		{/if}
	{/if}
</div>
