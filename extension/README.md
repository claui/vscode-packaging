# Packaging

This extension helps you work with package definition files for
package repositories.

It currently supports only a single type of package repository: the
[Arch User Repository](https://aur.archlinux.org/) (AUR).

## Screenshots

| `PKGBUILD` file without this extension | `PKGBUILD` file with this extension |
|:--------------------------------------:|:-----------------------------------:|
| <img alt="Screenshot of a PKGBUILD file opened in VS Code without the Packaging extension installed. The screenshot shows dozens of ShellCheck diagnostics, most of which are useless for PKGBUILDs. The two relevant findings are difficult to spot because they have become lost in the noise." src="https://raw.githubusercontent.com/claui/vscode-packaging/main/extension/images/screenshot-pkgbuild-without-extension.png" width="75%"> | <img alt="Screenshot of a PKGBUILD file opened in VS Code with the Packaging extension installed. The screenshot now only shows the two ShellCheck findings which are actual mistakes in the PKGBUILD." src="https://raw.githubusercontent.com/claui/vscode-packaging/main/extension/images/screenshot-pkgbuild-with-extension.png" width="75%"> |
| [ShellCheck](https://marketplace.visualstudio.com/items?itemName=timonwong.shellcheck) findings are mostly irrelevant. | Only see ShellCheck diagnostics that matter. |

## Features

### PKGBUILD (AUR)

The Packaging extension supports user-contributed
[PKGBUILD](https://wiki.archlinux.org/title/PKGBUILD) files in the
AUR.

For `PKGBUILD` files opened in VS Code, this extension enables
linting through the
[ShellCheck](https://marketplace.visualstudio.com/items?itemName=timonwong.shellcheck)
extension.

By default, however, ShellCheck emits a number of unhelpful warnings
that are false alarms in the context of `PKGBUILD` files. To remove
those false alarms, this extension configures the ShellCheck
extension in the following ways:

- Sets Bash as the shell.

- Disables rule [SC2034](https://www.shellcheck.net/wiki/SC2034)
  _(“foo appears unused. Verify it or export it.”)_

- Disables rule [SC2154](https://www.shellcheck.net/wiki/SC2154)
  _(“var is referenced but not assigned.”)_

- Disables rule [SC2164](https://www.shellcheck.net/wiki/SC2164)
  _(“Use `cd ... || exit` in case `cd` fails.”)_

- Will not affect regular shell scripts, only `PKGBUILD`s

## Prerequisites

This extension depends on the
[ShellCheck extension](https://marketplace.visualstudio.com/items?itemName=timonwong.shellcheck),
maintained by Felipe Santos.

Usually, VS Code will take care of this dependency for you.
When in doubt, you can reinstall the ShellCheck extension to get the
latest version. You should have to do that only once though, if
ever.

## FAQ

- Q. Why does this extension set Bash as the shell?  
  A. `makepkg`, the program that sources `PKGBUILD`s, runs in Bash.

- Q. Why does this extension disable rule SC2164 for `PKGBUILD`s?  
  A. `makepkg` first configures `shopt -o -s errexit`, which is
     roughly equivalent to `set -e` , before it calls into
     `PKGBUILD`’s functions. ShellCheck doesn’t know this, and
     still reports SC2164 violations, but those are unhelpful false
     alarms in that context.

- Q. Why does this extension disable rule SC2034 for `PKGBUILD`s?  
  A. There are
     [more than a dozen PKGBUILD variables](https://wiki.archlinux.org/title/PKGBUILD).
     ShellCheck emits `SC2034` violations for every single one of
     them, because it can’t tell that `makepkg` will consume those
     variables after it sources the `PKGBUILD`. So those are
     unhelpful false alarms.  
     Disabling rule SC2034 incurs some collateral damage, but due to
     [limitations in ShellCheck itself](https://github.com/koalaman/shellcheck/issues/356),
     this is probably the best we can do for now.

- Q. Why does this extension disable rule SC2154 for `PKGBUILD`s?  
  A. Similarly to SC2034, ShellCheck emits `SC2154` violations for
     variables like `srcdir` and `pkgdir`, because it can’t tell
     that `makepkg` always pre-initializes those variables before it
     calls into `PKGBUILD` functions. Hence, these are false alarms,
     too.  
     Just like SC2034, disabling rule SC2154 will also suppress
     some legitimate ShellCheck warnings but we can’t do anything
     about it unless someone introduces
     [the missing feature](https://github.com/koalaman/shellcheck/issues/356)
     to ShellCheck proper.

## Acknowledgements

A shout-out to these amazing people:

- [Felipe Santos](https://github.com/felipecrs), maintainer of the
  [VS Code extension for ShellCheck](https://github.com/vscode-shellcheck/vscode-shellcheck)

- [Mark Skelton](https://github.com/mskelton), author of
  [yarn-plugin-outdated](https://github.com/mskelton/yarn-plugin-outdated)

- [Vidar Holen](https://github.com/koalaman), who wrote
  [ShellCheck](https://www.shellcheck.net/)

## License

Copyright (c) 2022 Claudia Pellegrino

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
For a copy of the License, see [LICENSE.txt](LICENSE.txt).
