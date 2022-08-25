import { ExtensionContext, commands, extensions, Disposable } from "vscode";

import { statusItem } from "./language";
import { outputChannel } from "./logger";
import { SubscriptionHelper } from "./shellcheck";

const ACTION_SHOW_LOG: string = "packaging.action.showLog";

export function activate(context: ExtensionContext) {
  commands.registerCommand(ACTION_SHOW_LOG, () => {
    outputChannel.show();
  });

  statusItem.command = {
    command: ACTION_SHOW_LOG,
    title: "Show extension log",
  };

  const helper: SubscriptionHelper = new SubscriptionHelper(context);
  let subscription: Disposable = helper.trySubscribe();
  extensions.onDidChange((_) => {
    if (subscription) {
      subscription = helper.refresh(subscription);
    } else {
      subscription = helper.trySubscribe();
    }
  });

  return {};
}

export function deactivate() {}
