import moment from "moment/moment";

export function logWithDateTime(...logs: unknown[]): void {
    console.log(`[${moment.utc().format("YYYY-MM-DD HH:mm:ss")}]`, logs);
}
