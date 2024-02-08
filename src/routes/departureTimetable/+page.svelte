<script>
	import { Button } from 'flowbite-svelte';
	import TrainTimes from './trainTimes.svelte';
	import StandardTime from './StandardTime.svelte';
	import WeatherComponent from './WeatherComponent.svelte';

  </script>
  
  <div class="container">
	<div class="header">
	  <div class="large-font">
		<StandardTime />
	  </div>
	  <div class="top-right">
		<Button class="logout-button"><a href="/logout">Logout</a></Button>

		<WeatherComponent />
	  </div>
	</div>
	
  
	<div class="main-content">
		<TrainTimes />
	</div>
  
	<div class="footer">
	  <!-- Your train times component goes here -->
	</div>
  </div>
  

  <style>
	/* Add your styling here */
	.container {
	  display: flex;
	  flex-direction: column;
	  height: 100vh;
	  padding: 20px;
	}
  
	.header {
	  display: flex;
	  justify-content: space-between;
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
  
	.logout-button {
	  background-color: #3498db; /* Use your desired background color */
	  color: white;
	}
  
	.top-right {
	  align-self: flex-end;
	  display: flex;
	  flex-direction: column;
	  align-items: flex-end;
	}
  </style>
  
 