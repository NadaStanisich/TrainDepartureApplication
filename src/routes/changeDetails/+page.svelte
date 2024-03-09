<script lang="ts">
    import { Label, Input, Button, Select } from 'flowbite-svelte';
    import { supabase } from '$lib/supabase.js';
    import { selectedColour } from '$lib/colour.js'; 
    import { goto } from '$app/navigation'; // Import goto for navigation

    let name = ''; // New name
    let email = ''; // New email address
    let backgroundColour = '#3B82F6'; // Default background color is blue #3B82F6

    let users = localStorage.getItem('users');
    let parsedUsers = users ? JSON.parse(users) : {};

    
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
            <Input class="mb-3" id="name" type="text" bind:value={name} placeholder={name = (parsedUsers?.name || '' )} />
            <!--   Name is set to the current name of the user  -->
        </div>

        <div class="mb-4">
            <Label for="email">Email</Label>              
            <Input class="mb-3" id="email" type="email" bind:value={email} placeholder={email = (parsedUsers?.email || '')} />

            <!--   Email is set to the current email address of the user  -->
        </div>
        <div class="mb-4">
            <Label for="backgroundColour">Background Colour</Label>
            <Select id="backgroundColour" bind:value={backgroundColour}>
                <option value="#3B82F6">Default (Blue)</option>
                <option value="#FF0000">Red</option> 
                <option value="#00FF00">Green</option> 
                <option value="#FFFF00">Yellow</option>
                <option value="#FF00FF">Pink</option>
                <option value="#00FFFF">Cyan</option>
                <option value="#FFA500">Orange</option>
                <option value="#800080">Purple</option>
                <option value="#000000">Black</option>
                <option value="#FFFFFF">White</option>
                <option value="#808080">Grey</option>
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
