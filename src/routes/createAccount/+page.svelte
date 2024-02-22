<script>
	import { Label, Input, Button, Select } from 'flowbite-svelte';
    import { supabase } from '$lib/supabase.js';

    let name = '';
    let email = '';
    let password = '';
	let backgroundColour = 'default'; // Default background color

    async function signUpNewUser() {
        // Sign up the user
        const { user, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        // If there's no error signing up the user
        if (!error && user) {
            // Insert user details into Supabase table
            const { data, error } = await supabase
                .from('users')
                .insert([
                    {
                        name: name,
                        email: email,
                        background_colour: backgroundColour,
                    },
                ]);

            if (error) {
                console.error('Error inserting user details:', error.message);
            } else {
                console.log('User details inserted successfully:', data);
                // Redirect the user to the dashboard or another page
            }
        } else {
            console.error('Error signing up the user:', error ? error.message : 'Unknown error');
        }
    }
</script>

<div class="text-center py-11">
	<h1>Create Account</h1>
</div>

<div>
	<form on:submit|preventDefault={signUpNewUser} class="w-96 mx-auto">
		<div class="mb-4">
			<Label for="name">Name</Label>
			<Input id="name" bind:value={name} placeholder="Name" />
		</div>

		<div class="mb-4">
			<Label for="email">Email</Label>
			<Input class="mb-3" id="email" type="email" bind:value={email} placeholder="Email" />
		</div>

		<div class="mb-4">
			<Label for="password">Password</Label>
			<Input class="mb-3" id="password" type="password" bind:value={password} placeholder="Password" />
		</div>

		<div class="mb-4">
            <Label for="background-colour">Background Colour</Label>
            <Select id="background-colour" bind:value={backgroundColour}>
                <option value="default">Default</option>
                <option value="red">Red</option>
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <!-- Add more colour options as needed -->
            </Select>
        </div>

		<div class="mt-14 flex justify-center">
			<Button class="mr-1" type="submit">Submit</Button>

			<Button><a href="/">Cancel</Button>
		</div>
	</form>
</div>
