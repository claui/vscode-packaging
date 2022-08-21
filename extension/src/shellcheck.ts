import {
  Disposable,
  DocumentFilter,
  Extension,
  ExtensionContext,
  extensions,
} from "vscode";

import { LANGUAGE_FILTER } from "./language";
import { log } from "./logger";

const SHELLCHECK_EXTENSION: string = "timonwong.shellcheck";

export interface ShellCheckExtensionApiVersion1 {
  registerDocumentFilter: (documentFilter: DocumentFilter) => Disposable;
}

export class SubscriptionHelper {
  #context: ExtensionContext;
  #retryPending = false;

  constructor(context: ExtensionContext) {
    this.#context = context;
  }

  trySubscribe(): Disposable | null {
    const subscription: Disposable = this.#subscribe();

    if (subscription) {
      if (this.#retryPending) {
        log.info("Shellcheck extension has appeared. Connected.");
      } else {
        log.info("Connected to Shellcheck extension.");
      }
    } else {
      if (this.#retryPending) {
        log.info("Extensions have changed but still no sign of Shellcheck.");
      } else {
        log.info("Shellcheck extension not active.");
      }
    }

    this.#retryPending = !subscription;
    return subscription;
  }

  refresh(subscription: Disposable): Disposable | null {
    if (this.#shellcheckApi()) {
      log.info("Extensions have changed but Shellcheck is still around.");
      return subscription;
    }
    log.info("Shellcheck extension has gone away. Cleaning up.");
    subscription.dispose();
    return null;
  }

  #shellcheckApi(): ShellCheckExtensionApiVersion1 | null {
    const shellcheckExtension: Extension<any> =
      extensions.getExtension(SHELLCHECK_EXTENSION);

    if (shellcheckExtension && !shellcheckExtension.exports?.apiVersion1) {
      log.error(
        "The Shellcheck extension is active but did not provide an API surface." +
          " Is the Shellcheck extension outdated?"
      );
    }
    return shellcheckExtension?.exports?.apiVersion1;
  }

  #subscribe(): Disposable | null {
    if (!this.#shellcheckApi()) {
      return null;
    }

    const shellcheckSubscription: Disposable =
      this.#shellcheckApi().registerDocumentFilter(LANGUAGE_FILTER);
    this.#context.subscriptions.push(shellcheckSubscription);
    return shellcheckSubscription;
  }
}
