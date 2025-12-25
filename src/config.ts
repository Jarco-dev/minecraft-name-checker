import "dotenv/config";

try {
    if (!process.env.INTERVAL_MINUTES) throw new Error("No interval provided");
    if (!process.env.NOTIFICATION_TIMEOUT_MINUTES)
        throw new Error("No notification timeout provided");
    if (!process.env.USERNAMES) throw new Error("No usernames provided");
    if (!process.env.DISCORD_USER_IDS)
        throw new Error("No discord user ids provided");
    if (!process.env.DISCORD_WEBHOOK_URL)
        throw new Error("No discord webhook provided");
} catch (err) {
    console.log(err);
    process.exit();
}

const NAME_TO_ID: { [key: string]: string } = {};
const USERNAMES = process.env.USERNAMES!.toLowerCase().split(",");
const DISCORD_USER_IDS = process.env.DISCORD_USER_IDS!.split(",");
if (USERNAMES.length > 10)
    throw new Error("You can only check upto 10 usernames per instance");
if (USERNAMES.length !== new Set(USERNAMES).size)
    throw new Error("There is 1 or more duplicate usernames");
if (USERNAMES.length !== DISCORD_USER_IDS.length)
    throw new Error("Invalid mis matched usernames & discord_user_ids length");

for (let i = 0; i < USERNAMES.length; i++) {
    NAME_TO_ID[USERNAMES[i]] = DISCORD_USER_IDS[i];
}

export default {
    DISCORD_USER_IDS: process.env.DISCORD_USER_IDS!.split(","),
    DISCORD_WEBHOOK_URL: process.env.DISCORD_WEBHOOK_URL,
    INTERVAL_MINUTES: parseInt(process.env.INTERVAL_MINUTES),
    NAME_TO_ID,
    NOTIFICATION_TIMEOUT_MINUTES: parseInt(
        process.env.NOTIFICATION_TIMEOUT_MINUTES,
    ),
    USERNAMES,
} as const;
