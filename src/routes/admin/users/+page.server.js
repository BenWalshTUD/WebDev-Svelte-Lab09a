import { db } from '$lib/server/db';

// load - server side
export async function load() {

    // get users
    const users = await db.query.user.findMany();

    // debugging purposes
    console.log('Users:', users);
    
    // return data
    return {
        users : users
    }
}