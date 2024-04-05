<script lang="ts">
    import { Label, Input, Button } from 'flowbite-svelte';
    import { goto } from '$app/navigation';
    import { selectedColour } from '$lib/colour.js'; // Import selectedColour store
    import { selectedStation } from '$lib/station.js'; // Import selectedStation store

    export let data;

    let pageData = data;
    console.log(pageData);

    // layout.ts wraps supabase object and also page.ts - basically wraps twice
    let supabase = pageData.supabase.supabase;

    let email = '';
    let password = '';
    let loggedIn: Boolean = false;

    async function signInWithEmail() {
        console.log(email, password)
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            console.error('Error logging in:', error.message);
            loggedIn = false;
        } else {
            console.log('Logged in:', data.user.email);
            loggedIn = true;

            // Fetch user profile after successful login
            const { data: profileData, error: profileError } = await supabase
                .from('users')
                .select('id, name, email, trainstation, bg_colour') 
                .eq('email', email) // Using 'email' as a unique identifier for the user
                .single();

            if (profileData) {
                console.log('ProfileData:',profileData);
                localStorage.setItem('users', JSON.stringify(profileData));
                // Update the background color preference
                selectedColour.set(profileData.bg_colour || 'blue');
                // Update the selected station
                selectedStation.set(profileData.trainstation || 'Select Train Station');

            } else if(profileError) {
                console.log('ProfileError',profileError);
            }

            goto('/departureTimetable'); // Redirect to the departure timetable page
        }
    }

    async function gitHubSignIn() {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'github'
        });
        if (data) {
            loggedIn = false;
            goto('/departureTimetable');
        } else if(error) {
            console.log(error);
        }
    }
</script>

<div class="{loggedIn ? 'bg error' : 'bg'}">
</div>

<div class="text-center py-11  text-white">
	<h1 class="text-4xl font-bold">Train Departure App</h1>
</div>

<div class="bg">
	<form on:submit|preventDefault={signInWithEmail} class="w-96 mx-auto p-6 rounded-lg shadow-md">
		<div class="mb-4">
			<Label for="email" class="text-white">Email</Label>
			<Input class="mb-3 bg-white text-black" id="email" type="email" bind:value={email} placeholder="Email" />
		</div>

		<div class="mb-4">
			<Label for="password" class="text-white">Password</Label>
			<Input class="mb-3 bg-white text-black" id="password" type="password" bind:value={password} placeholder="Password" />
		</div>

		<div class="mt-6 flex justify-center">
			<Button class="mr-1 bg-white text-blue-500" type="submit">Log in</Button>
			<Button class="bg-white text-blue-500" on:click={gitHubSignIn}>Sign In With GitHub</Button>
		</div>

		<div class="mt-6 text-sm text-white">
			<a href="/createAccount" class="text-white underline">Create Account</a>
		</div>
	</form>

	{#if !loggedIn && email && password}
		<p class="text-center text-white mt-4">Invalid email or password</p>
	{/if}
</div>


