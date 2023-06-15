import { DocumentFilter, languages, LanguageStatusItem } from "vscode";

export const LANGUAGE_FILTER: DocumentFilter = { language: "aur-pkgbuild" };

export const statusItem: LanguageStatusItem = languages
  .createLanguageStatusItem(
    "aur-pkgbuild.status.item",
    LANGUAGE_FILTER,
  );
