<script lang="ts">
    import { Label, Input, Button, Select } from 'flowbite-svelte';
    import { supabase } from '$lib/supabase.js';
    import { selectedColour } from '$lib/colour.js'; 
    import { goto } from '$app/navigation'; // Import goto for navigation
    import { colourOptions } from '$lib/colourOptions.js';
   
    let users = localStorage.getItem('users'); // Get the users from local storage
    let parsedUsers = users ? JSON.parse(users) : {}; /* Parse the users from local storage*/
    let uuid = parsedUsers?.id || '';
    let name = parsedUsers?.name || ''; // New name
    let email = parsedUsers?.email || ''; // New email address
    let backgroundColour = '#3B82F6'; // Default background color is blue #3B82F6
    
    async function updateUserDetails() {
        console.log('Updating: ', parsedUsers)
        console.log('Updating user details...', name, email, uuid)
        const { error } = await supabase
            .from('users')
            .update({
                name: name,
                email: email,
                bg_colour: backgroundColour,
            })
            .eq('id', uuid); // Using 'id' as a unique identifier for the user

        if (error) {
            console.error('Error updating user details:', error.message);
        } else {
            console.log('User details updated successfully.');

            // Update selectedColour store with the new background colour
            selectedColour.set(backgroundColour);

            // Redirect to trainTimes page
            goto('/departureTimetable');
        }
    }

</script>

<div>
    <h1 class="flex justify-center">Change Details</h1>
    <form on:submit|preventDefault={updateUserDetails} class="w-96 mx-auto">

        <div class="mb-4">
            <Label for="name">Name</Label>
            <Input class="mb-3" id="name" type="text" bind:value={name} />
            <!--   Name is set to the current name of the user  -->
        </div>

        <div class="mb-4">
            <Label for="email">Email</Label>              
            <Input class="mb-3" id="email" type="email" bind:value={email} />
            <!--   Email is set to the current email address of the user  -->
        </div>

        <div class="mb-4">
            <Label for="backgroundColour">Background Colour</Label>
            <Select id="backgroundColour" bind:value={backgroundColour}>
                {#each colourOptions as colourOption}
                  <option value={colourOption.value}>{colourOption.name}</option>
                {/each}
            </Select>
        </div>

        <div class="mt-14 flex justify-center">
            <Button class="mr-1" type="submit">Update Details</Button>
            <!--   Update button to submit the form  -->
            <Button><a href="/departureTimetable">Cancel</a></Button>   
            <!--   Cancel button to redirect to the trainTimes page  -->
        </div>
    </form>
</div>
