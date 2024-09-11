import {
  commands,
  Disposable,
  ExtensionContext,
  extensions,
} from "vscode";

import {
  PACMAN_INSTALL_SCRIPT_SELECTOR,
  pacmanInstallScriptStatusItem,
  PKGBUILD_SELECTOR,
  pkgbuildStatusItem,
} from "./language";
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
  pacmanInstallScriptStatusItem.command = {
    command: "packaging.action.showLog",
    title: "Show extension log",
  };
  pkgbuildStatusItem.command = { ...pacmanInstallScriptStatusItem.command };

  const helpers: SubscriptionHelper[] = [
    new SubscriptionHelper(context, PACMAN_INSTALL_SCRIPT_SELECTOR),
    new SubscriptionHelper(context, PKGBUILD_SELECTOR),
  ];
  for (const helper of helpers) {
    let subscription: Disposable | null = helper.trySubscribe();
    extensions.onDidChange((_) => {
      if (subscription) {
        subscription = helper.refresh(subscription);
      } else {
        subscription = helper.trySubscribe();
      }
    });
  }

  const { version } = packageJson(context);
  log.info(`Extension v${version} startup successful`);
  return {};
}

export function deactivate() {
  return;
}
