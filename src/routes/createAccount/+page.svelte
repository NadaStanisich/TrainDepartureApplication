<script lang="ts">
  import { Label, Input, Button, Select } from 'flowbite-svelte';
  import { supabase } from '$lib/supabase.js';
  import { goto } from '$app/navigation';
  import { user } from '$lib/user';
  import { selectedColour } from '$lib/colour.js'; // Import selectedColour store
  import { colourOptions } from '$lib/colourOptions.js';

  let name = '';
  let email = '';
  let password = '';
  let backgroundColour = '#3B82F6'; /* Set default background color to blue */                                                                                                        let videoUrl = 'https://www.youtube.com/embed/ZzUsKizhb8o?list=PL_vkVwrwck3NJ9ajMQv7Y-DfX9gVAk5in&index=2';


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
            {#each colourOptions as colourOption}
              <option value={colourOption.value}>{colourOption.name}</option>
            {/each}
          </Select>
  </div>

  <div class="mt-14 flex justify-center">
    <Button class="mr-1" type="submit">Submit</Button>
    <Button><a href="/">Cancel</a></Button>
  </div>
</form>
</div>



























{#if backgroundColour === 'video'}
  <!-- Display the video when the video option is selected -->
  <div style="display: flex; justify-content: center;">
    <iframe width="760" height="450" src={videoUrl} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
  </div>
{/if} 
