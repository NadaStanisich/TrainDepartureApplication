<script lang="ts">
    import { Label, Input, Button, Select } from 'flowbite-svelte';
    import { supabase } from '$lib/supabase.js';
    import { selectedColour } from '$lib/colour.js'; 
    import { goto } from '$app/navigation'; // Import goto for navigation

    let name = ''; // New name
    let email = ''; // New email address
    let backgroundColour = 'blue'; //'bg-blue-400'; Set default background color to blue
    
    async function updateUserDetails() {
    const { error } = await supabase
        .from('users')
        .update({
            name: name,
            email: email,
            bg_colour: backgroundColour,
        })
        .eq('email', email); // Using'email' as a unique identifier for the user

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
            <Input class="mb-3" id="name" type="text" bind:value={name} placeholder={name = (JSON.parse(localStorage.getItem('users'))?.name || '')} />
            <!--   Name is set to the current name of the user  -->
        </div>

        <div class="mb-4">
            <Label for="email">Email</Label>              
            <Input class="mb-3" id="email" type="email" bind:value={email} placeholder={email = (JSON.parse(localStorage.getItem('users'))?.email || '')} />
    <!--   Email is set to the current email address of the user  -->
        </div>
        <div class="mb-4">
            <Label for="backgroundColour">Background Colour</Label>
            <Select id="backgroundColour" bind:value={backgroundColour}>
                <option value="blue">Default (Blue)</option>
                <option value="red">Red</option>
                <option value="green">Green</option>
                <!-- More colour options to be added -->
            </Select>
        </div>

        <div class="mt-14 flex justify-center">
            <Button class="mr-1" type="submit">Update Details</Button>
            <Button><a href="/departureTimetable">Cancel</a></Button> 
        </div>
    </form>
</div>
