import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
    let layoutData = await parent();

    return { 
        supabase: layoutData
    };
}