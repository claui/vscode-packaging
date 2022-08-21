# AUR packaging

This extension adds support for user-contributed PKGBUILDs in the
Arch User Repository (AUR).

## What it does

This extension configures the
[ShellCheck](https://marketplace.visualstudio.com/items?itemName=timonwong.shellcheck)
extension so it applies a specific set of rules to `PKGBUILD` files.

The specific ShellCheck configuration defaults for `PKGBUILD`s are:

- Apply Bash rules by default.  
  Equivalent to `--shell bash` in `shellcheck.customArgs`.

- Disable [SC2164](https://www.shellcheck.net/wiki/SC2164) by
  default.  
  This is justified because `makepkg` configures `shopt -o -s errexit`
  (roughly equivalent to `set -e`) before it calls into `PKGBUILD`’s
  functions.

**Note:** This extension is work in progress. It requires a custom
build of the ShellCheck extension at this time.  
Specifically, it won’t work with the ShellCheck extension version
0.20.0 or older.

<!--
- Suppresses unhelpful ShellCheck rules
  [SC2034](https://www.shellcheck.net/wiki/SC2034) and
  [SC2154](https://www.shellcheck.net/wiki/SC2154) for
  `PKGBUILD` files.
-->

## License

Copyright (c) 2022 Claudia Pellegrino

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
For a copy of the License, see [LICENSE](LICENSE).
