import {get} from "./dynamics.mjs";

(async () => {
    try {
        // get all fsc resource data
        const resources = await get("/")
        console.log(resources.filter(({name}) => name.includes("fsc")))

        // get certificate bodies
        console.log(await get("/fsc_sites"))

        // get with queries
        console.log(await get("/fsc_countrydatas?$filter=statecode eq 0"))
    } catch (e) {
        console.error(e);
    }
})()