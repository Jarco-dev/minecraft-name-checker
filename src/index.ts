import "dotenv/config";
import { EmbedBuilder, WebhookClient } from "discord.js";

interface NotFoundBody {
    errorMessage: string;
    path: string;
}

interface ProfileBody {
    id: string;
    name: string;
}

try {
    if (!process.env.INTERVAL_MINUTES) throw new Error("No interval provided");
    if (!process.env.NOTIFICATION_TIMEOUT_MINUTES)
        throw new Error("No notification timeout provided");
    if (!process.env.USERNAME) throw new Error("No username provided");
    if (!process.env.DISCORD_USER_ID)
        throw new Error("No discord user id provided");
    if (!process.env.DISCORD_WEBHOOK_URL)
        throw new Error("No discord webhook provided");
} catch (err) {
    console.log(err);
    process.exit();
}

const webhook = new WebhookClient({
    url: process.env.DISCORD_WEBHOOK_URL as string,
});
async function checkAvailability(name: string): Promise<void> {
    const res = await fetch(
        `https://api.mojang.com/users/profiles/minecraft/${name}`,
    );
    const body: NotFoundBody | ProfileBody = await JSON.parse(await res.text());

    if (res.status === 200 && "id" in body && "name" in body) {
        console.log(`${name} is not available`);
        return;
    } else if (res.status === 404) {
        if (
            "errorMessage" in body &&
            body.errorMessage.includes("Couldn't find")
        ) {
            console.log(`${name} is either available now or in 37 days!`);
            sendNotification(
                `\`${name}\` is either available now or in 37 days!\n[Try to claim it](https://www.minecraft.net/en-us/msaprofile/mygames/editprofile)`,
            );
            return;
        }

        console.log(`${name} might be available, or something went wrong`);
        sendNotification(
            `\`${name}\` might be available, or something went wrong\n[Try to claim it](https://www.minecraft.net/en-us/msaprofile/mygames/editprofile)`,
        );
        return;
    }
    console.log("Unexpected response from Mojang API", res, body);
}

let notifyTimeout = false;
async function sendNotification(message: string): Promise<void> {
    if (notifyTimeout) return;

    const embed = new EmbedBuilder()
        .setColor("#F88038")
        .setTitle("Minecraft Name Checker")
        .setDescription(`${message}`);

    webhook
        .send({
            content: `<@${process.env.DISCORD_USER_ID}>`,
            embeds: [embed],
        })
        .then(() => {
            setTimeout(
                () => {
                    notifyTimeout = false;
                },
                parseInt(process.env.NOTIFICATION_TIMEOUT_MINUTES as string) *
                    60000,
            );
            notifyTimeout = true;
        })
        .catch(console.log);
}

(async () => {
    console.log(
        `Checking every ${process.env.INTERVAL_MINUTES} minute(s) for ${process.env.USERNAME} to become available\n\n`,
    );

    await sendNotification(
        `This is a test message, the program has started successfully!\nChecking every \`${parseInt(process.env.INTERVAL_MINUTES as string)}\` minute(s) for availability on \`${process.env.USERNAME}\``,
    );
    notifyTimeout = false;

    setInterval(
        () => checkAvailability(process.env.USERNAME!.toLowerCase()),
        parseInt(process.env.INTERVAL_MINUTES as string) * 60000,
    );
})();
