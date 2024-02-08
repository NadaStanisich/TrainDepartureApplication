<script>
    import { onMount, onDestroy } from 'svelte';
  
    let currentTime = new Date();
  
    // Update the current time every second
    const updateCurrentTime = () => {
      currentTime = new Date();
    };
  
    // Set up interval to update time
    let interval;
    onMount(() => {
      interval = setInterval(updateCurrentTime, 1000);
    });
  
    // Clear interval on component destruction to prevent memory leaks
    onDestroy(() => {
      clearInterval(interval);
    });
  </script>
  
  <div>
    <p>{currentTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}</p> 
  </div>

  
  