import { DocumentFilter, languages, LanguageStatusItem } from "vscode";

export const LANGUAGE_SELECTOR: DocumentFilter = { language: "aur-pkgbuild" };

export const statusItem: LanguageStatusItem = languages
  .createLanguageStatusItem(
    "aur-pkgbuild.status.item",
    LANGUAGE_SELECTOR,
  );
