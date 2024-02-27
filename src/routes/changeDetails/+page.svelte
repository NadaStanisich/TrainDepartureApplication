<script lang="ts">
    import { Label, Input, Button, Select } from 'flowbite-svelte';
    import { supabase } from '$lib/supabase.js';
    import { user } from '$lib/user';
    import { goto } from '$app/navigation'; // Import goto for navigation

    let name = ''; // New name
    let email = ''; // New email address
    let backgroundColour = '#3B82F6'; //'bg-blue-400'; Set default background color to blue
    
    async function updateUserDetails() {
    const { error } = await supabase
        .from('user')
        .update({
            name: name,
            email: email,
            background_colour: backgroundColour,
        })
        .eq('email', email); // Using'email' as a unique identifier for the user

    if (error) {
        console.error('Error updating user details:', error.message);
    } else {
        console.log('User details updated successfully.');
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
            <Input class="mb-3" id="name" type="text" bind:value={name} placeholder="New Name" />
        </div>

        <div class="mb-4">
            <Label for="email">Email</Label>
            <Input class="mb-3" id="email" type="email" bind:value={email} placeholder="New Email" />
        </div>

        <div class="mb-4">
            <Label for="background-colour">Background Colour</Label>
            <Select id="background-colour" bind:value={backgroundColour}>
                <option value="bg-blue-400">Default (Blue)</option>
                <option value="bg-red-400">Red</option>
                <option value="bg-green-400">Green</option>
                <!-- More colour options to be added -->
            </Select>
        </div>

        <div class="mt-14 flex justify-center">
            <Button class="mr-1" type="submit">Update Details</Button>
            <Button><a href="/departureTimetable">Cancel</a></Button> 
        </div>
    </form>
</div>
