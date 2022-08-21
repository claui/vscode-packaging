# AUR packaging

This extension adds support for user-contributed PKGBUILDs in the
Arch User Repository (AUR).

## What it does

This extension configures the
[Shellcheck](https://marketplace.visualstudio.com/items?itemName=timonwong.shellcheck)
extension so it applies Bash rules to `PKGBUILD` files.

**Note:** This extension is a work in progress. It requires a custom
build of the Shellcheck extension at this time.  
Specifically, it won’t work with the Shellcheck extension version
0.20.0 or older.

<!--
- Suppresses unhelpful Shellcheck rules
  [SC2034](https://www.shellcheck.net/wiki/SC2034) and
  [SC2154](https://www.shellcheck.net/wiki/SC2154) for
  `PKGBUILD` files.
-->

## License

Copyright (c) 2022 Claudia Pellegrino

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
For a copy of the License, see [LICENSE](LICENSE).
