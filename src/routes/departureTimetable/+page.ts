import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
    let layoutData = await parent();

    console.log('layoutData:', layoutData)

    return { 
        supabase: layoutData
    };
}