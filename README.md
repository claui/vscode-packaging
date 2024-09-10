# vscode-packaging

This is the source code repository for the `packaging`
VS Code extension.

This document is for **contributors,** not for users of this
extension.  
For **user documentation,** see: [extension/README.md](./extension/README.md)  
For **license information,** see the bottom of this document.

## About the extension

For a list of features and details, see the user documentation:
[extension/README.md](./extension/README.md)

## Requirements for contributing

Working on this VS Code extension requires the following programs to
be installed on your system:

- `yarn` (required)
- `nvm` (recommended)

## Preparing your session

To prepare your session, `cd` to the project root directory, then
run `nvm use`.

## Installing dependencies

To install dependencies, run: `yarn install`

If that fails, consult the _Maintenance_ section.

## Building the extension

To build the extension, run: `yarn package`

Unlike `vsce package`, running `yarn package` will work around issue
[microsoft/vscode-vsce#517](https://github.com/microsoft/vscode-vsce/issues/517).
Use `yarn package` as long as the issue is unresolved.

## Publishing the extension

Publishing the extension has several steps:

1. Merge the contributions.
2. Choose a target version number.
3. Publish to the Marketplace. (This modifies `extension/package.json`.)
4. Publish to the Open VSX Registry.
5. Create a Git commit, Git tag, GitHub prerelease and GitHub PR.

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

1. Check out the `main` branch and make sure it is pristine.

2. Decide on a new version number under which to publish the package.

3. Edit the `extension/share/dist/package.json` manifest to reflect
   the new version number.

4. Run: `yarn package`

5. If necessary, run: `yarn workspace extension login`

6. Run: `yarn workspace extension publish-vsce [--pre-release]`

The final `yarn […] publish-vsce` command packages and publishes the
extension to the VS Code Extension Marketplace.

### Publishing to the Open VSX Registry

Follow these steps to publish the extension to the Open VSX Registry:

1. Set the `OVSX_PAT` environment variable to your personal access
   token.

   For example, if you’re on Bash and you have your token in
   1Password, you could run the following command line:

   ```bash
   read -r OVSX_PAT < <(
     op item get 'Open VSX Registry' --fields password
   ) && export OVSX_PAT
   ```

2. Make sure you have published the extension to the VS Code
   Extension Marketplace. This ensures that the version number has
   been updated.

3. Run `yarn package` to generate a `.vsix` package.

4. Run the `yarn […] ovsx publish` command with the correct
   `extension/dist/[…].vsix` file as the sole argument.  
   Example in Bash:

   ```bash
   yarn workspace extension ovsx publish "dist/packaging-$(jq -r .version extension/share/dist/package.json).vsix"
   ```

### Committing, tagging and creating a GitHub prerelease and PR

With the extension now published on the Marketplace, commit the
change, create a tag, push, cut a GitHub (pre-)release, and create a
pull request against `main`:

```bash
(
  set -eux
  git checkout -b publish
  tag="$(jq -r '"v" + .version' extension/share/dist/package.json)"
  echo "New tag: ${tag}"
  git add -u
  git commit --edit -m "Release ${tag}"
  git tag "${tag}"
  git push --tags
  gh release create --generate-notes "${tag}"
  gh pr create --fill --web
)
```

## Maintenance

### yarn install

To install the current project dependencies as specified in
`package.json` and `yarn.lock`, run `yarn install`.

### yarn clean-install

If the Yarn version has changed and you run `yarn install`, Yarn
will try to upgrade itself. That causes changes to several files,
such as the `LICENSE` files I have placed into several
subdirectories.

Anytime that happens, run the `yarn clean-install` script, a wrapper
around `yarn install` which cleans up afterwards.

Note that the `yarn clean-install` script may fail and tell you to
run `yarn install` instead. I haven’t figured out why it does that.
If that happens, run `yarn install` followed by `yarn clean-install`.

### yarn outdated

To see a list of outdated packages, run: `yarn outdated`

### yarn upgrade-lockfile

This runs `yarn up -R '**' && yarn clean-install` behind the scenes
in order to upgrade all resolutions in the lockfile as far as
possible, but leaves your `package.json` as is.

### yarn upgrade-packages

The built-in `yarn up` command can be a bit cumbersome to use if you
want to upgrade all dependencies in one go.

Running the `yarn upgrade-packages` script will upgrade all relevant
dependencies. That includes the `@types`, `@typescript-eslint`, and
`@yarnpkg` scopes but excludes Yarn itself (see the
`yarn upgrade-yarn-itself` section).

Also excluded is the `@types/vscode` package. For details, see
section _Upgrading the VS Code API version_.

### yarn upgrade-yarn-itself

To upgrade Yarn PnP to the latest available version, run the
`yarn upgrade-yarn-itself` script.

Note that the script will only print manual instructions. That’s
because Yarn makes changes to `package.json`, and that doesn’t play
well with Yarn PnP in scripts.

### yarn upgrade-all

To also upgrade Yarn itself, run `yarn upgrade-all`.

### Upgrading the VS Code API version

Upgrading the version of the `@types/vscode` package should always
be a manual step and a conscious decision. It effectively bumps the
minimum supported VS Code version that this extension supports.

To bump the minimum supported VS Code version, follow these steps:

1. In `extension/package.json`, manually update the minimum version
   to a new version tuple (e.g. `=1.99`).  
   Make sure to preserve the `=` prefix as you change the value.

2. In the root `package.json` file, modify the `upgrade-package`
   script to update the same tuple (e.g `@types/vscode@=1.99`).  
   Preserve the `@types/vscode@=` prefix as you change the value.

3. In `extension/share/dist/package.json` under the `engines`
   section, manually update the value of the `vscode` property to
   the chosen version.
   Since `vsce` expects a triple for that property, append a `.0`.  
   Preserve the `^` prefix as you change the value.

4. Run `yarn clean-install`.

## Patching dependencies

Sometimes you may want to tweak a dependency. This section explains how to do that using `yarn patch`.

### Start editing

To start editing a dependency, run `yarn patch <dependency>`.

For example, to start editing the `vsce` executable, run:

```shell
yarn patch @vscode/vsce@npm:2.21.1
```

Since this project is already patching this dependency, you may want to apply the existing patch to the temporary working directory:

```shell
patch < path/to/this/project/.yarn/patches/@vscode-vsce-npm-2.21.1.patch
```

### Committing a patch for the first time

To commit a patch for the first time, run `yarn patch-commit -s <workdir>`.

### Modifying an existing patch

To commit a modified patch, run `yarn repatch -- <workdir>`.

For example, if the temporary working directory is `/tmp/xfs-36e26fe6/user`, run:

```shell
yarn repatch -- /tmp/xfs-36e26fe6/user
```

Note: `yarn repatch` is a custom script. It serves to work around two issues in `yarn patch-commit`:

- Using bare `yarn patch-commit` would create a nested patch while amending the patch is what I actually want.

- It may also use an incorrect key in the resolution entry it writes to `package.json`.  
  The key should match the dependency’s semver expression, not the resolved version.
  Using the latter as a key causes the resolution to never apply.  
  Example for a correct key: `"@vscode/vsce@^2.21.1"`

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

This source code repository contains code and assets sourced from
different parties. Therefore, multiple sets of license terms apply
to different parts of this source code repository.

The following table shows which terms apply to which parts of this
source code repository:

| Directory tree | Description | License | Terms |
|---|---|---|---|
| `.` | This directory | Apache-2.0 | [License](./LICENSE)<br>with License header below |
| `./.yarn/releases` | The `yarn` package manager | BSD-2-Clause | [License](./.yarn/releases/LICENSE) |
| `./.yarn/sdks` | SDK files for `yarn` | BSD-2-Clause | [License](./.yarn/sdks/LICENSE) |
| `./extension` | Front-end source code for this VS Code extension | Apache-2.0 | [License](./extension/LICENSE.txt)<br>with [License header](./extension/README.md#license) |

In each of the directories the table mentions, you will find one
license file, named `LICENSE` or `LICENSE.txt`.  
Each license file applies to the directory that contains it,
including all subdirectories, but excluding any subdirectory tree
whose root has a license file on its own.

## License header

Copyright (c) 2022–2024 Claudia Pellegrino

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
For a copy of the License, see [LICENSE](LICENSE).
