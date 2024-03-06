<script>
	import { onMount } from 'svelte';
	import { openWeatherMapUrl } from '$lib/weatherinfo.js';

	let weatherData = {};

	onMount(async () => {
		try {
			const response = await fetch(openWeatherMapUrl);
			if (response.ok) {
				weatherData = await response.json();
			} else {
				throw new Error('Failed to fetch weather data');
			}	
		} catch (error) {
			console.error(error);
		}
	});
</script>

<div class="text-lg font-bold text-gray-700 dark:text-white border border-gray-300 p-4 mt-4">
	{#if weatherData && weatherData.main}
	  <h1>{weatherData.name}</h1>
	  <div class="flex items-center">
		<img src={`http://openweathermap.org/img/w/${(weatherData.weather && weatherData.weather[0].icon) || ''}.png`} alt="Weather Icon" />
		<h5 class="mb-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{Math.round((weatherData.main.temp || 0) - 273.15)}°C</h5>
	  </div>
	  <p class="font-normal text-gray-700 dark:text-gray-400 leading-tight">{weatherData.weather[0].description}</p>
	{/if}
</div>
