<script>
	import { Label, Input, Button } from 'flowbite-svelte';
    import { supabase } from '$lib/supabase.js';

    let name = '';
    let email = '';
    let password = '';

    async function signUpNewUser() {
		const { data, error } = await supabase.auth.signUp({
			name: name, 
            email: email,
			password: password,
		});
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

		<div class="mt-14 flex justify-center">
			<Button class="mr-1" type="submit">Submit</Button>

			<Button><a href="/">Cancel</Button>
		</div>
	</form>
</div>
