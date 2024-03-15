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
  
  let selected = 'Select Train Station'; // Initial button name
  let selectedStation: Trainstop | null = null;
  let trainRoute: Train[] = [];
  let stopData: Trainstop[] = [];
  let departureData: TrainDeparture[] = [];
  let directionData: TrainDirections[] = [];
  let departuresData: Departures | undefined = undefined;
  
  function selectItem(item: Trainstop) {
    selected = item.stop_name; // Update button name
    selectedStation = item;
    fetchNextTrains(); // Fetch next trains when a new station is selected
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
        stopsToDisplay = stopData; // Update stopsToDisplay with all stops initially
      }
    });
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
    if (searchInput === '') {
      stopsToDisplay = stopData; // Display all stops when search input is empty
    } else {
      let results = stopData.filter(stop =>
        stop.stop_name.toLowerCase().includes(searchInput.toLowerCase())
      );
      stopsToDisplay = results;
    }
  }
  
  function handleSubmit(event: any) {
    event.preventDefault();
    searchStops();
  }
  
  </script>
  <main>
    <Button class="bg-blue-600 text-white sizes" size="lg">
      {selected}
      <ChevronDownSolid class="w-3 h-3 ms-2 text-white dark:text-white" />
    </Button>
  
    <Dropdown class="overflow-y-auto px-3 pb-3 text-sm h-44">
      <div slot="header" class="p-3">
        <form on:submit={handleSubmit}>
          <Search size="md" bind:value={searchInput} on:keyup={searchStops}/>
        </form>
      </div>
      {#each stopsToDisplay as stop (stop.stop_id)}
        <DropdownItem on:click={() => selectItem(stop)}>{stop.stop_name}</DropdownItem>
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