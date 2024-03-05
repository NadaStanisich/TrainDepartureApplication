import { writable } from 'svelte/store';

// Define user interface
interface User {
    id: number;
    name: string;
    email: string;
    trainstation: string
    bg_colour: string;

}
// Still working on this part


// Initialize writable store for user data
export const user = writable<User | null>(null); // Start with null value
