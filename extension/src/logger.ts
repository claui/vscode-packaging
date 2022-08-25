import { OutputChannel, window } from "vscode";
import { getCurrentTimestamp } from "./time";

export interface Logger {
  debug(...args: any[]): void;
  error(...args: any[]): void;
  info(...args: any[]): void;
  log(level: string, ...args: any[]): void;
}

export const outputChannel: OutputChannel =
  window.createOutputChannel("Packaging");

export const log: Logger = {
  debug: function (...args) {
    this.log("DEBUG", ...args);
  },
  error: function (...args) {
    this.log("ERROR", ...args);
  },
  info: function (...args) {
    this.log("INFO", ...args);
  },
  log: function (level: string, ...args: any[]) {
    const timestamp = getCurrentTimestamp();
    outputChannel.appendLine(`${timestamp} [${level}] ${args.join(" ")}`);
  },
};
