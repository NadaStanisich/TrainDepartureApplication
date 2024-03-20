<script>
	import { Button } from 'flowbite-svelte';
	import { goto } from '$app/navigation'; // Import goto for navigation
	import TrainTimes from './trainTimes.svelte';
	import StandardTime from './StandardTime.svelte';
	import WeatherComponent from './WeatherComponent.svelte';

	function goToChangeDetailsPage() {
        goto('/changeDetails'); // Redirect to the changeDetails page
    }
	//import ChangeDetails from '../newDetails/changeDetails.svelte'; // Import the ChangeDetails component

</script>
  
  <div class="container">
	<div class="header">
	  <div class="large-font">
		<StandardTime />
	  </div>
	  <div class="top-left">
	

		<WeatherComponent />
	  </div>
	</div>
	
  
	<div class="main-content">
		<TrainTimes />
	</div>
  
	<div class="footer">
	</div>
  </div>

  <div class="text-right mt-4">
	<Button on:click={goToChangeDetailsPage}>Change Details</Button>
	<Button class="logout-button"><a href="/logout">Logout</a></Button>
  </div>

  <style>
	/* Add your styling here */
	.container {
	  display: flex;
	  flex-direction: column;
	  height: 5vh;
	  padding: 20px;
	}
  
	.header {
	  display: flex;
	  
	  align-items: center;
	  margin-bottom: 20px;
	}
  
	.main-content {
	  display: flex;
	  justify-content: space-between;
	  flex-grow: 1;
	  margin-bottom: 20px;
	}
  
	.footer {
	  margin-top: auto;
	}
  
	.large-font {
	  font-size: 115px; /* Adjust the font size as needed */
	}
  

  
	.top-left {
	  align-self: flex-end;
	  display: flex;
	  flex-direction: column;
	  align-items: flex-end;
	}
  </style>
  
 