import { promisify } from "node:util";

const dateTimeFormat: Intl.DateTimeFormat = new Intl.DateTimeFormat([], {
  dateStyle: "long",
  timeStyle: "long",
});

export function getCurrentTimestamp(): string {
  return dateTimeFormat.format(new Date());
}

export async function sleep(
  durationMs: number,
): Promise<ReturnType<typeof setTimeout>> {
  return await promisify(setTimeout)(durationMs);
}
