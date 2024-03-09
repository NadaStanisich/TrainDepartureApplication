<script lang="ts">
  import { Label, Input, Button, Select } from 'flowbite-svelte';
  import { supabase } from '$lib/supabase.js';
  import { goto } from '$app/navigation';
  import { user } from '$lib/user';
  import { selectedColour } from '$lib/colour.js'; // Import selectedColour store

  let name = '';
  let email = '';
  let password = '';
  let backgroundColour = '#3B82F6'; // Set default background color to blue

  async function signUpNewUser() {
    try {
      // Sign up the user
      const { data, error } = await supabase.auth.signUp({ 
        email: email,
        password: password,
      });

      // If error signing up user log the error and return
      if (error) {
        console.error('Error signing up the user:', error.message);
        return;
      } else {

        if(data) {
          addUserToDb();
          // Update selectedColour store with the new background colour
          selectedColour.set(backgroundColour);
        }
      }
      
      async function addUserToDb() {
        // Insert user details into Supabase table
        const { data, error: insertError } = await supabase
          .from('users')
          .insert([
            {
              name: name,
              email: email,
              bg_colour: backgroundColour,
            },
          ]);
  
        if (insertError) {
          console.error('Error inserting user details:', insertError.message);
        } else {
          console.log('User details inserted successfully:', data);
          // Update the user store
          user.set(data);
          // Redirect the user to the dashboard or another page
          goto('/departureTimetable');
        }
      }

    } catch (error) {
      console.error('Unknown error:', (error as Error).message);
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
    <Button class="mr-1" type="submit">Submit</Button>
    <Button><a href="/">Cancel</a></Button>
  </div>
</form>
</div>
