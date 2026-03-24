import schema from "@/instant.schema";
import { init } from "@instantdb/react";

export const db = init({
    appId: process.env.VITE_INSTANT_APP_ID || "54846a19-b581-4c9b-a22e-618f8c2ffe26",
    schema: schema,
    useDateObjects: true,
})


// import schema from "@/instant.schema";
// import { init } from "@instantdb/react";

// // Pass schema as a type parameter
// export const db = init<typeof schema>({
//     appId: process.env.VITE_INSTANT_APP_ID || "54846a19-b581-4c9b-a22e-618f8c2ffe26",
//     devtool: true
// })
