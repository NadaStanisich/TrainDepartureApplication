<script lang="ts">
	import {
		Button,
		Dropdown, 
		DropdownItem,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';

	import { ChevronDownSolid } from 'flowbite-svelte-icons';

	import { onMount, afterUpdate } from "svelte";
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
  

  async function fetchData(url: string, options: any) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
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

  function selectItem(item: Trainstop) {
    selected = item.stop_name;
    selectedStation = item;
    fetchNextTrains();
  }

  async function fetchTrainData() {
    try {
      const trainUrl = "https://ptvapiwrapper.azurewebsites.net/trains/get-all-routes";
      const options = getFetchOptions();
      const responseData = await fetchData(trainUrl, options);
      if (responseData) {
        trainRoute = responseData.map((item: any) => new Train(item.route_type, item.route_id, item.route_name));
      }
    } catch (error) {
      console.error("Error fetching train data:", error);
    }
  }

  async function fetchStopsData() {
    try {
      const stopsUrl = "https://ptvapiwrapper.azurewebsites.net/trains/get-all-stops";
      const options = getFetchOptions();
      const stopsDataResponse = await fetchData(stopsUrl, options);
      if (stopsDataResponse) {
        stopData = stopsDataResponse.map((stop: any) =>
          new Trainstop(
            stop.stop_id,
            stop.stop_name,
            stop.stop_suburb,
            stop.stop_latitude,
            stop.stop_longitude,
            stop.route_type,
          )
        );
      }
    } catch (error) {
      console.error("Error fetching stops data:", error);
    }
  }

  async function fetchNextTrains() {
    try {
      if (selectedStation) {
        const departuresUrl = `https://ptvapiwrapper.azurewebsites.net/trains/get-departures/${selectedStation.stop_id}`;
        const options = getFetchOptions();
        const departuresResponse = await fetchData(departuresUrl, options);
        if (departuresResponse) {
          departuresData = departuresResponse;
          fetchTrainData(); // Refresh routes based on the selected station
        }
      }
    } catch (error) {
      console.error("Error fetching next trains:", error);
    }
  }

  onMount(() => {
    fetchTrainData(); // Fetch train data on component mount
    fetchStopsData(); // Fetch stops data on component mount
    const lastSelectedStation = localStorage.getItem('selectedStation');
    if (lastSelectedStation) {
      selectedStation = JSON.parse(lastSelectedStation);
      selected = selectedStation?.stop_name ?? 'Select Train Station';
    }
  });

  afterUpdate(() => {
    if (selectedStation) {
      localStorage.setItem('selectedStation', JSON.stringify(selectedStation));
    }
  });

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


    const diffInMilliseconds: number = Number(scheduledTime.getTime()) - Number(currentTime.getTime());
    const diffInMinutes = Math.ceil(diffInMilliseconds / (1000 * 60));

    return `${diffInMinutes} min`;
  }

</script>

<main>
  <Button class="bg-blue-600 text-white sizes" size="lg">{selected}<ChevronDownSolid class="w-3 h-3 ms-2 text-white dark:text-white" /></Button>
  <Dropdown class="overflow-y-auto px-3 pb-3 text-sm h-44">
    {#each stopData as stop (stop.stop_id)}
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
        <TableHeadCell style="background-color: darkgrey; color: white;">
          <div>Departing</div>
          <div>Platform</div>
        </TableHeadCell>
        <TableHeadCell style="background-color: darkgrey; color: white;">
          <div>Departing</div>
          <div>Platform</div>
        </TableHeadCell>
        <TableHeadCell style="background-color: darkgrey; color: white;">
          <div>Departing</div>
          <div>Platform</div>
        </TableHeadCell>
        <TableHeadCell style="background-color: darkgrey; color: white;">
          <div>Departing</div>
          <div>Platform</div>
        </TableHeadCell>
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


</style>