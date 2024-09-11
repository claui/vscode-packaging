import { DocumentFilter, languages, LanguageStatusItem } from "vscode";

export const PKGBUILD_SELECTOR: DocumentFilter = { language: "aur-pkgbuild" };

export const pkgbuildStatusItem: LanguageStatusItem = languages
  .createLanguageStatusItem(
    "aur-pkgbuild.status.item",
    PKGBUILD_SELECTOR,
  );

export const PACMAN_INSTALL_SCRIPT_SELECTOR: DocumentFilter = {
  language: "pacman-install-script",
};

export const pacmanInstallScriptStatusItem: LanguageStatusItem = languages
  .createLanguageStatusItem(
    "pacman-install-script",
    PACMAN_INSTALL_SCRIPT_SELECTOR,
  );
