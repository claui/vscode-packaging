import { promisify } from "util";

const dateTimeFormat: Intl.DateTimeFormat = new Intl.DateTimeFormat([], {
  dateStyle: "long",
  timeStyle: "long",
});

export function getCurrentTimestamp(): string {
  return dateTimeFormat.format(new Date());
}

export async function sleep(durationMs: number): Promise<NodeJS.Timer> {
  return await promisify(setTimeout)(durationMs);
}
