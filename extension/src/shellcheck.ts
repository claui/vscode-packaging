import {
  Disposable,
  DocumentFilter,
  Extension,
  ExtensionContext,
  extensions,
} from "vscode";

import log from "./log";

const SHELLCHECK_EXTENSION: string = "timonwong.shellcheck";

export interface ShellCheckExtensionApiVersion1 {
  registerDocumentFilter: (documentFilter: DocumentFilter) => Disposable;
}

export class SubscriptionHelper {
  #context: ExtensionContext;
  #firstTry = true;
  #prefix: string;
  #selector: DocumentFilter;

  constructor(context: ExtensionContext, selector: DocumentFilter) {
    this.#context = context;
    this.#prefix = selector.language ?? JSON.stringify(selector);
    this.#selector = { ...selector };
  }

  trySubscribe(): Disposable | null {
    const subscription: Disposable | null = this.#subscribe();

    if (subscription) {
      if (this.#firstTry) {
        log.info(`${this.#prefix}: Connected to ShellCheck extension.`);
      } else {
        log.info(`${this.#prefix}:`
          + " ShellCheck extension has appeared. Connected.");
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      if (this.#firstTry) {
        log.info(`${this.#prefix}: ShellCheck extension not active.`);
      } else {
        log.info(`${this.#prefix}:`
          + " Extensions have changed but still no sign of ShellCheck.");
      }
    }

    this.#firstTry = !!subscription;
    return subscription;
  }

  /* eslint-disable-next-line class-methods-use-this --
   * Even though this method doesn’t use `this`, we leave it non-static
   * for better API consistency
   */
  refresh(subscription: Disposable): Disposable | null {
    if (SubscriptionHelper.#api()) {
      log.info(`${this.#prefix}:`
        + " Extensions have changed but ShellCheck is still around.");
      return subscription;
    }
    log.info(`${this.#prefix}:`
      + "ShellCheck extension has gone away. Cleaning up.");
    subscription.dispose();
    return null;
  }

  static #api(): ShellCheckExtensionApiVersion1 | null {
    const shellCheckExtension: Extension<unknown> | undefined =
      extensions.getExtension(SHELLCHECK_EXTENSION);

    if (!shellCheckExtension?.exports
      || !(shellCheckExtension.exports instanceof Object)
      || !("apiVersion1" in shellCheckExtension.exports)) {
      log.error(
        "The ShellCheck extension is active but did not provide an API surface."
        + " Is the ShellCheck extension outdated?",
      );
      return null;
    }
    const { apiVersion1 } = shellCheckExtension.exports as
      { apiVersion1: ShellCheckExtensionApiVersion1 };
    return apiVersion1;
  }

  #subscribe(): Disposable | null {
    const api = SubscriptionHelper.#api();
    if (!api) {
      return null;
    }

    const subscription: Disposable = api.registerDocumentFilter(this.#selector);
    this.#context.subscriptions.push(subscription);
    return subscription;
  }
}
