import {
  commands,
  Disposable,
  ExtensionContext,
  extensions,
} from "vscode";

import { statusItem } from "./language";
import log from "./log";
import { SubscriptionHelper } from "./shellcheck";

interface ExtensionPackageJson {
  "displayName": string,
  "version": string,
}

function packageJson(context: ExtensionContext): ExtensionPackageJson {
  return context.extension.packageJSON as ExtensionPackageJson;
}

export function activate(context: ExtensionContext) {
  commands.registerCommand("packaging.action.showLog", log.show, log);
  statusItem.command = {
    command: "packaging.action.showLog",
    title: "Show extension log",
  };

  const helper: SubscriptionHelper = new SubscriptionHelper(context);
  let subscription: Disposable | null = helper.trySubscribe();
  extensions.onDidChange((_) => {
    if (subscription) {
      subscription = helper.refresh(subscription);
    } else {
      subscription = helper.trySubscribe();
    }
  });

  const { version } = packageJson(context);
  log.info(`Extension v${version} startup successful`);
  return {};
}

export function deactivate() {
  return;
}
