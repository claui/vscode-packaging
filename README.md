# vscode-packaging

This is the source code repository for the `packaging` VS Code extension.

This document is for **contributors,** not for users of this extension.  
For **user documentation,** see: [extension/README.md](./extension/README.md)  
For **license information,** see the bottom of this document.

## About the extension

For a list of features and details, see the user documentation: [extension/README.md](./extension/README.md)

## Requirements for contributing

Working on this VS Code extension requires the following programs to be installed on your system:

- `yarn` (required)
- `nvm` (recommended)

## Preparing your session

To prepare your session, `cd` to the project root directory, then run `nvm use`.

## Installing dependencies

To install dependencies, run: `yarn install`

If that fails, consult the _Maintenance_ section.

## Building the extension

To build the extension, run: `yarn package`

Unlike `vsce package`, running `yarn package` will work around issue [microsoft/vscode-vsce#517](https://github.com/microsoft/vscode-vsce/issues/517).
Use `yarn package` as long as the issue is unresolved.

## Publishing the extension

Publishing the extension has several steps:

1. Merge the contributions.
2. Choose a target version number.
3. Publish to the Marketplace. (This modifies `extension/package.json`.)
4. Create a Git commit, Git tag, GitHub prerelease and GitHub PR.

### Merging the contributions

Make sure that all the contributions you’re going to have in the
release have been merged to the `main` branch.

### Choosing a target version number

With all contributions merged into `main`, choose a target version
number.  
[The VS Code folks recommend](https://code.visualstudio.com/api/working-with-extensions/publishing-extension#prerelease-extensions)
the following numbering scheme:

- `major.ODD_NUMBER.patch` (e.g. 1.1.0) for **pre-release** versions; and
- `major.EVEN_NUMBER.patch` (e.g. 1.2.0) for **release** versions.

### Publishing to the Marketplace

After deciding on a target version, run:

- `git checkout main`
- `yarn login`
- `yarn publish [--pre-release] [version]`

The `yarn publish` command first updates the version number in [extension/package.json](./extension/package.json) to the given version. Then it packages and publishes the extension to the VS Code Extension Marketplace.

### Committing, tagging and creating a GitHub prerelease and PR

With the extension now published on the Marketplace, commit the
change, create a tag, push, cut a GitHub (pre-)release, and create a
pull request against `main`:

```
(
  set -eux
  git checkout -b publish
  tag="$(jq -r '"v" + .version' extension/package.json)"
  echo "New tag: ${tag}"
  git add -u
  git commit --edit -m "Release ${tag}"
  git tag "${tag}"
  git push --tags
  gh release create --generate-notes --prerelease "${tag}"
  gh pr create --fill --web
)
```

## Maintenance

### yarn install

To install the current project dependencies as specified in `package.json` and `yarn.lock`, run `yarn install`.

### yarn clean-install

If the Yarn version has changed and you run `yarn install`, Yarn will try to upgrade itself. That causes changes to several files, such as the `LICENSE` files I have placed into several subdirectories.

Anytime that happens, run the `yarn clean-install` script, a wrapper around `yarn install` which cleans up afterwards.

Note that the `yarn clean-install` script may fail and tell you to run `yarn install` instead. I haven’t figured out why it does that. If that happens, run `yarn install` followed by `yarn clean-install`.

### yarn outdated

To see a list of outdated packages, run: `yarn outdated`

### yarn upgrade-lockfile

This runs `yarn up -R '**' && yarn clean-install` behind the scenes
in order to upgrade all resolutions in the lockfile as far as
possible, but leaves your `package.json` as is.

### yarn upgrade-packages

The built-in `yarn up` command can be a bit cumbersome to use if you want to upgrade all dependencies in one go.

Running the `yarn upgrade-packages` script will upgrade all relevant
dependencies. That includes the `@types` and `@yarnpkg` scopes but
excludes Yarn itself (see the `yarn upgrade-yarn-itself` section).

Also excluded is the `@types/vscode` package. For details, see
section _Upgrading the VS Code API_.

### yarn upgrade-yarn-itself

To upgrade Yarn PnP to the latest available version, run the `yarn upgrade-yarn-itself` script.

Note that the script will only print manual instructions. That’s because Yarn makes changes to `package.json`, and that doesn’t play well with Yarn PnP in scripts.

### yarn upgrade-all

To also upgrade Yarn itself, run `yarn upgrade-all`.

### Upgrading the VS Code API

Upgrading the version of the `@types/vscode` package should always
be a manual step and a conscious decision. It effectively bumps the
minimum supported VS Code version that this extension supports.

To bump the minimum supported VS Code version, follow these steps:

1. In `package.json`, manually update the minimum version to a new
   version triple (e.g. `~=1.99.0`).  
   Make sure to preserve the `~=` prefix as you change the value.

2. In `extension/package.json` under the `engines` section, manually
   update the value of the `vscode` property to the new version
   triple.  
   Preserve the `^` prefix as you change the value.

3. Run `yarn clean-install`.

## Handling vulnerable dependencies

### The thing about vulnerabilities in transitive dependencies

People sometimes discover vulnerabilities in packages on which
vscode-packaging depends.

If that happens and a patch comes out, I need to upgrade the
affected package to a newer version, which includes the patch.

But a vulnerability might also affect a package on which
vscode-packaging depends only indirectly, e.g. through a
transitive requirement. A patch may exist for such a package, but
somewhere in the chain of dependencies (from the vulnerable package
all the way down to vscode-packaging), the patch may be
outside the specified semver range so I **can’t upgrade** the
package via the usual `yarn up` or `yarn up -R` command.

### Dealing with the risk

If such cases arise, I’m going to try force-upgrading affected
packages, and document those upgrades in the section
_List of force-upgraded transitive dependencies_ below.  
Even if the upgrade happens to fail (or if it breaks the app and I
have to roll back the upgrade, leaving the vulnerability unpatched),
I’m also going to document that failure here.

## List of force-upgraded transitive dependencies

The goal of this list is:

- to document the drift between version requirements (in the tree
  of `package.json` files) and the resolutions in `yarn.lock`; and

- to inform about unpatched vulnerabilities.

<!-- Remove this line when adding the first entry: -->No entries yet.

<!--
I have preserved the order in which I have applied the upgrades.
The list starts with the first upgrade and ends with the latest one.
-->

<!--
### Vulnerability in …………, dependency of ………… v…………

I have manually bumped `…………`’s dependency `…………` to
v………… in order to bump the transitive dependency `…………` to v…………:

```shell
yarn set resolution --save …………@npm:………… …………
```

(Remove this section once an upgrade to `…………` is available
that depends on ………… v………… or higher.)
-->

## See also

- [TextMate language grammars](https://macromates.com/manual/en/language_grammars)
- Default themes
  [dark_vs](https://github.com/microsoft/vscode/blob/main/extensions/theme-defaults/themes/dark_vs.json)
  and
  [dark_plus](https://github.com/microsoft/vscode/blob/main/extensions/theme-defaults/themes/dark_plus.json)
  as references on how VS Code renders grammar scopes.

## License

This source code repository contains code and assets sourced from different parties. Therefore, multiple sets of license terms apply to different parts of this source code repository.

The following table shows which terms apply to which parts of this source code repository:

| Directory tree | Description | License | Terms |
|---|---|---|---|
| `.` | This directory | Apache-2.0 | [License](./LICENSE)<br>with License header below |
| `./.yarn/releases` | The `yarn` package manager | BSD-2-Clause | [License](./.yarn/releases/LICENSE) |
| `./.yarn/sdks` | SDK files for `yarn` | BSD-2-Clause | [License](./.yarn/sdks/LICENSE) |
| `./extension` | The source code for this VS Code extension | Apache-2.0 | [License](./extension/LICENSE.txt)<br>with [License header](./extension/README.md#license) |

In each of the directories the table mentions, you will find one license file, named `LICENSE` or `LICENSE.txt`.  
Each license file applies to the directory that contains it, including all subdirectories, but excluding any subdirectory tree whose root has a license file on its own.

## License header

Copyright (c) 2022 Claudia Pellegrino

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
For a copy of the License, see [LICENSE](LICENSE).
