# AUR packaging

This extension adds support for user-contributed
[PKGBUILD](https://wiki.archlinux.org/title/PKGBUILD) files in the
[Arch User Repository](https://aur.archlinux.org/) (AUR).

## What it does

This extension configures the
[ShellCheck](https://marketplace.visualstudio.com/items?itemName=timonwong.shellcheck)
extension so it applies a specific set of rules to `PKGBUILD` files.

For `PKGBUILD` files opened in VS Code, this extension configures
ShellCheck in the following ways:

- It sets Bash as the shell.

- It disables rule [SC2164](https://www.shellcheck.net/wiki/SC2164)
  _(“Use `cd ... || exit` in case `cd` fails.”)_

<!--
Ideas for upcoming features:

- It disables rule [SC2034](https://www.shellcheck.net/wiki/SC2034)
  _(“foo appears unused. Verify it or export it.”)_

- It disables rule [SC2154](https://www.shellcheck.net/wiki/SC2154)
  _(“var is referenced but not assigned.”)_
-->


## Caveat

This extension is work in progress. It requires a custom
build of the ShellCheck extension at this time.  
Specifically, it won’t work with the ShellCheck extension version
0.21.1 or older.

If you want to use this extension, you can either
[package it
yourself](https://github.com/claui/vscode-aur-packaging/blob/main/README.md#building-the-extension)
or wait for
[the first release](https://github.com/claui/vscode-aur-packaging/milestone/1)
to be published on the VS Code Marketplace.

## FAQ

- Q. Why does this extension set Bash as the shell?  
  A. `makepkg`, the program that sources `PKGBUILD`s, runs in Bash.

- Q. Why does this extension disable rule SC2164 for `PKGBUILD`s?  
  A. `makepkg` first configures `shopt -o -s errexit`, which is
     roughly equivalent to `set -e` , before it calls into
     `PKGBUILD`’s functions. ShellCheck doesn’t know this, and
     still reports SC2164 violations, but those are unhelpful false
     alarms in that context.

- Q. Why does VS Code still report SC2034 violations?
     _(“foo appears unused. Verify it or export it.”)_  
  A. See [issue #1](https://github.com/claui/vscode-aur-packaging/issues/1).

<!--
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
-->

- Q. Why does VS Code still report SC2154 violations?
     _(“var is referenced but not assigned.”)_  
  A. See [issue #2](https://github.com/claui/vscode-aur-packaging/issues/2).

<!--
- Q. Why does this extension disable rule SC2154 for `PKGBUILD`s?  
  A. See explanation for SC2034.
-->

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
For a copy of the License, see [LICENSE](LICENSE).
