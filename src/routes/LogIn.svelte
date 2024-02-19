<script>
	import { Label, Input, Button } from 'flowbite-svelte';
	import { supabase } from '$lib/supabase.js';
	import { goto } from '$app/navigation';
  
	let email = '';
	let password = '';
	let loginError = false;
  
	async function signInWithEmail() {
	  const { data, error } = await supabase.auth.signInWithPassword({
		email: email,
		password: password
	  });
	  if (data.user) {
		loginError = false;
		
		// Fetch user profile after successful login
		const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('name, email, trainstation, background_colour') 
        .eq('email', email)
        .single();	
		if (profileData) {
			console.log(profileData);
			localStorage.setItem('user', JSON.stringify(profileData));
		} else if(profileError) {
			console.log(profileError);
		}

		goto('/departureTimetable');
		console.log(data);
	  } else if(error) {
	  	console.log(error);
		loginError = true;
	  }
	}

	async function gitHubSignIn() {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: 'github'
		});
		if (data) {
			loginError = false;
			goto('/departureTimetable');
		} else if(error) {
			console.log(error);
			loginError = true;
		}
	}
</script>

<div class="text-center py-11 bg-blue-500 text-white">
	<h1 class="text-4xl font-bold">Train Departure App</h1>
</div>

<div class="bg-blue-400">
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
		<div class="mt-2 text-sm text-white">
			<a href="/" class="text-white underline">Forgot your password?</a>
		</div>
	</form>

	{#if loginError}
		<p class="text-center text-white mt-4">Invalid email or password</p>
	{/if}
</div>
