import { EmbedBuilder, WebhookClient } from "discord.js";

import config from "./config";

const webhook = new WebhookClient({ url: config.DISCORD_WEBHOOK_URL });

const notifyTimeout: { [key: string]: true } = {};
export function sendAvailableNotification(
    username: string,
    message: string,
): void {
    if (notifyTimeout[username]) return;

    const embed = new EmbedBuilder()
        .setColor("#F88038")
        .setTitle("Minecraft Name Checker")
        .setDescription(message.replaceAll("{{username}}", username));

    webhook
        .send({
            content: `<@${config.NAME_TO_ID[username]}>`,
            embeds: [embed],
        })
        .then(() => {
            setTimeout(() => {
                delete notifyTimeout[username];
            }, config.NOTIFICATION_TIMEOUT_MINUTES * 60000);
            notifyTimeout[username] = true;
        })
        .catch(console.log);
}

export function sendStartupNotification(): void {
    const embed = new EmbedBuilder()
        .setColor("#F88038")
        .setTitle("Minecraft Name Checker")
        .setDescription(
            `Started successfully, checking very ${config.INTERVAL_MINUTES} minute(s) for availability on ${config.USERNAMES.map((u) => `\`${u}\``).join(", ")}`,
        );

    webhook.send({ embeds: [embed] });
}
