import moment from "moment";
import cron from "node-cron";

import config from "./config";
import { sendAvailableNotification, sendStartupNotification } from "./notify";
import {logWithDateTime} from "./logger";

async function checkAvailability(): Promise<void> {
    const res = await fetch(
        `https://api.mojang.com/minecraft/profile/lookup/bulk/byname`,
        {
            body: JSON.stringify(Object.keys(config.NAME_TO_ID)),
            headers: { "Content-Type": "application/json" },
            method: "POST",
        },
    );

    const body: { id: string; name: string }[] = await res.json();
    if (res.status !== 200 || !Array.isArray(body)) {
        console.log("Unexpected response from Mojang API", res, body);
        return;
    }

    const available = [];
    const resUsernames = body.map((u) => u.name.toLowerCase());
    for (const username of Object.keys(config.NAME_TO_ID)) {
        if (resUsernames.includes(username)) continue;

        logWithDateTime(`${username} is now available`);
        sendAvailableNotification(
            username,
            `\`{{username}}\` will be released somewhere between now and 37 days!\n[Try to claim it](https://www.minecraft.net/en-us/msaprofile/mygames/editprofile) | Checked at ${moment.utc().format("YYYY-MM-DD HH:mm:ss")} UTC`,
        );
        available.push(username);
    }
}

(async () => {
    console.log(
        `Checking every ${process.env.INTERVAL_MINUTES} minute(s) for availability on ${config.USERNAMES.join(", ")}\n\n`,
    );
    await sendStartupNotification();
    checkAvailability();
    cron.schedule(`*/${config.INTERVAL_MINUTES} * * * *`, checkAvailability);
})();
