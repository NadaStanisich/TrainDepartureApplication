<script lang="ts">
  import {
    Button,
    Dropdown,
    DropdownItem,
    Search,
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell
  } from 'flowbite-svelte';

  import { ChevronDownSolid } from 'flowbite-svelte-icons';
  import { onMount } from "svelte";
  import { Train } from "$lib/train";
  import { Trainstop } from "$lib/trainstop";
  import type { TrainDeparture, Departures } from "$lib/traindeparture";
  import type { TrainDirections } from "$lib/traindirections";
  import { supabase } from '$lib/supabase.js';
  import { goto } from '$app/navigation'; // Import goto for navigation
  import { auth } from '$lib/supabase.js';

  let selected = 'Select Train Station'; // Initial button name
  let selectedStation: Trainstop | null = null;
  let trainRoute: Train[] = [];
  let stopData: Trainstop[] = [];
  let departureData: TrainDeparture[] = [];
  let directionData: TrainDirections[] = [];
  let departuresData: Departures | undefined = undefined;
  let  trainstation ='';
  let email='';
  
  async function checkUserSession() {
  try {
    
    // Get the current user session
    const session = await supabase.auth.getSession();

    if (session?.data.session?.user) {
      // There is an active user session
      console.log('User is logged in:', session.user.email);
      // You can access other user details like session.user.id, session.user.role, etc.
    } else {
      // No active user session
      console.log('No user logged in.');
    }
  } catch (error) {
    console.error('Error checking user session:', error.message);
  }
}
  
  async function updateUserDetails(email: string, selectedStopName: string) {
    console.log("updateDetails: ", selectedStopName)
  const { data, error } = await supabase
    .from('users')
    .update({
      trainstation: selectedStopName,
    })  
    .eq('email', email)
    

  if (data) {
    console.log("Data updated for user with email:", email);
  } else {
    console.log("No data updated for user with email:", email);
  }

  if (error) {
    console.error('Error updating user details for email', email, ':', error.message);
  } else {
    console.log('User details updated successfully for email:', email);
  }
}

async function selectItem(item: Trainstop) {
  try {
    // Get current user session
    console.log("selectItem: ", item, selectedStation, trainstation)
    
    const session = await supabase.auth.getSession();
    const email: string = session.data.session?.user.email!; // Assuming email is present in user information
    console.log("selectItem :", session, email);

    if (session) {
      const { data, error } = session;
      if (data.session?.user) {
        
        selected = item.stop_name;
        selectedStation = item;
        fetchNextTrains();
        updateUserDetails(email, item.stop_name);
      } else {
        console.error('No user logged in.');
      }
    } else {
      console.error('No active session.');
    }
  } catch (error) {
    console.error('Error during item selection:', error.message);
  }
}


  
  function getFetchOptions() {
    return {
      method: "GET",
      headers: {
        "Content-type": "application/json;charset=UTF-8",
        "X-Api-Key": "pDDuZJyKSfzVU1zRriSw4vWvzpRAoGIAtw0osQPqkwn9MOIpOVpGTeEoMM94jXZw",
      },
    };
  }
  
  async function fetchData(url: string) {
    try {
      const response = await fetch(url, getFetchOptions());
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  
  onMount(() => {
    fetchData("https://ptvapiwrapper.azurewebsites.net/trains/get-all-routes").then(responseData => {
      if (responseData) {
        trainRoute = responseData.map(
          (item: any) => new Train(item.route_type, item.route_id, item.route_name)
        );
      }
    });
    fetchData("https://ptvapiwrapper.azurewebsites.net/trains/get-all-stops").then(stopsDataResponse => {
      if (stopsDataResponse) {
        stopData = stopsDataResponse.map(
          (stop: any) =>
            new Trainstop(
              stop.stop_id,
              stop.stop_name,
              stop.stop_suburb,
              stop.stop_latitude,
              stop.stop_longitude,
              stop.route_type
            )
        );
      }
    });
  });
  
  onMount(async () => {
  // Assuming there's a function to fetch the user's data when they log in
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('trainstation')
    .single(); // Assuming there's only one user data entry per user

  if (userData && userData.trainstation) {
    const selectedStop = stopData.find(stop => stop.stop_name === userData.trainstation);
    if (selectedStop) {
      selectedStation = selectedStop;
      selected = selectedStop.stop_name;
      fetchNextTrains(); // Fetch next trains when a saved station is loaded
    }
  } else {
    console.error('Error fetching user data:', userError ? userError.message : 'No data found.');
  }
});
  /* import { onMount, afterUpdate } from "svelte";
  afterUpdate(() => {
    if (selectedStation) {
      localStorage.setItem('selectedStation', JSON.stringify(selectedStation));
    }
  }); */
  
  // Update data when selectedStation changes
  $: {
    if (selectedStation) {
      fetchNextTrains();
    }
  }
  
  async function fetchNextTrains() {
    try {
      if (selectedStation) {
        const departuresResponse = await fetchData(`https://ptvapiwrapper.azurewebsites.net/trains/get-departures/${selectedStation.stop_id}`);
        if (departuresResponse) {
          departuresData = departuresResponse;
          fetchData("https://ptvapiwrapper.azurewebsites.net/trains/get-all-routes"); // Refresh routes based on the selected station
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
  
  function getRouteName(route_id: number) {
    const route = trainRoute.find(route => route.route_id === route_id);
    return route ? route.route_name : '';
  }
  
  function organizeDeparturesByRoute(routeId: number) {
    const currentTimestamp = new Date().getTime();
    return (
      (departuresData?.departures ?? [])
        .filter(
          (departure) =>
            departure.route_id === routeId &&
            new Date(departure.scheduled_departure_utc).getTime() >= currentTimestamp
        )
        .sort(
          (a, b) =>
            new Date(a.scheduled_departure_utc).getTime() -
            new Date(b.scheduled_departure_utc).getTime()
        )
        .slice(0, 4) || []
    );
  }
  
  function departureTimeWithMinutesLeft(departureTime: Date) {
    const scheduledTime: Date = new Date(departureTime);
    const currentTime: Date = new Date();
    // Calculate the difference in milliseconds
    const diffInMilliseconds: number = Number(scheduledTime.getTime()) - Number(currentTime.getTime());
    const diffInMinutes = Math.ceil(diffInMilliseconds / (1000 * 60)); // Convert milliseconds to minutes
    return `${diffInMinutes} min`;
  }
  
  
  let searchInput = '';
  let stopsToDisplay = stopData;
  
  function searchStops() {
    let results = stopData.filter(stop =>
      stop.stop_name.toLowerCase().includes(searchInput.toLowerCase())
    );
    stopsToDisplay = results;
    return results;
  }
  
  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    searchStops();
    if (stopsToDisplay.length === 1) {
      selectItem(stopsToDisplay[0]);
    } else {
      // Handle multiple search results or no results
    }
  }

  async function submitAndUpdateUserDetails(event: SubmitEvent) {
  await handleSubmit(event);
  if (selectedStation && email) {
    updateUserDetails(email, selectedStation.stop_name);
  }
}
  
  </script>
  <main>
    <Button class="bg-blue-600 text-white sizes" size="lg">
      {selected}
      <ChevronDownSolid class="w-3 h-3 ms-2 text-white dark:text-white" />
    </Button>
    
    <Dropdown class="overflow-y-auto px-3 pb-3 text-sm h-44" id="trainstation"> <!-- bind:value={trainstation}> -->
      <div slot="header" class="p-3">
        <form on:submit={submitAndUpdateUserDetails}>
          <Search size="md" bind:value={searchInput} on:keyup={searchStops} />
        </form>
      </div>
      {#each stopsToDisplay as stop (stop.stop_id)}
        <DropdownItem on:click={() => selectItem(stop)} value={stop.stop_id}>{stop.stop_name}</DropdownItem>
      {/each}
    </Dropdown>
    
      {#if departuresData != undefined && departuresData.departures != undefined}
        <Table striped={true}>
          <TableHead>
            <TableHeadCell style="background-color: darkgrey; color: white;">
              <div>Destination/</div>
              <div>Route</div>
            </TableHeadCell>
      {#each new Array(4) as _, index}
          <TableHeadCell style="background-color: darkgrey; color: white;">
            <div>Departing</div>
            <div>Platform</div>
          </TableHeadCell>
      {/each}
          </TableHead>
      <TableBody>
        {#each trainRoute.filter(route => (departuresData?.departures ?? []).some(departure => departure.route_id === route.route_id)) as route}
          <TableBodyRow>
            <TableBodyCell style="background-color: lightgrey; color: black;">{getRouteName(route.route_id)}</TableBodyCell>
            {#each organizeDeparturesByRoute(route.route_id) as departure}
              <TableBodyCell style="background-color: lightyellow;">
                <div>
                  <div>{departureTimeWithMinutesLeft(new Date(departure.scheduled_departure_utc))}</div>
                  <div>Platform {departure.platform_number}</div>
                </div>
              </TableBodyCell>
            {/each}
          </TableBodyRow>
        {/each}
      </TableBody>  
    </Table>
  {/if}
  </main>
  
  <style>
    /* Add your styles here if needed */
  </style>