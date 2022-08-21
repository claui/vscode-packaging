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
        log.info("ShellCheck extension has appeared. Connected.");
      } else {
        log.info("Connected to ShellCheck extension.");
      }
    } else {
      if (this.#retryPending) {
        log.info("Extensions have changed but still no sign of ShellCheck.");
      } else {
        log.info("ShellCheck extension not active.");
      }
    }

    this.#retryPending = !subscription;
    return subscription;
  }

  refresh(subscription: Disposable): Disposable | null {
    if (this.#api()) {
      log.info("Extensions have changed but ShellCheck is still around.");
      return subscription;
    }
    log.info("ShellCheck extension has gone away. Cleaning up.");
    subscription.dispose();
    return null;
  }

  #api(): ShellCheckExtensionApiVersion1 | null {
    const shellCheckExtension: Extension<any> =
      extensions.getExtension(SHELLCHECK_EXTENSION);

    if (shellCheckExtension && !shellCheckExtension.exports?.apiVersion1) {
      log.error(
        "The ShellCheck extension is active but did not provide an API surface." +
          " Is the ShellCheck extension outdated?"
      );
    }
    return shellCheckExtension?.exports?.apiVersion1;
  }

  #subscribe(): Disposable | null {
    if (!this.#api()) {
      return null;
    }

    const subscription: Disposable =
      this.#api().registerDocumentFilter(LANGUAGE_FILTER);
    this.#context.subscriptions.push(subscription);
    return subscription;
  }
}
