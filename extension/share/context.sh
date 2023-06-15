#
# This script is meant to be sourced by ShellCheck. Its purpose is
# to provide context for PKGBUILD files, preventing unnecessary
# warnings.
#

# Allow ShellCheck to interpret this file correctly during development:
# shellcheck shell=bash

# ShellCheck does not recognize `shopt -o -s errexit` so we use `set -e`.
#
# See also:
# https://gitlab.archlinux.org/pacman/pacman/-/blob/e017a5975cfe3e53670848bd45c982524d6745af/scripts/makepkg.sh.in#L396
set -e

# See also:
# https://gitlab.archlinux.org/pacman/pacman/-/blob/e017a5975cfe3e53670848bd45c982524d6745af/scripts/libmakepkg/util/util.sh.in#L106
shopt -u extglob

# Variable names pseudo-exported from PKGBUILD files.
#
# I have sourced the following list from namcap; see also:
# https://github.com/keenerd/namcap/blob/master/Namcap/rules/extravars.py
export arch
export b2sums
export backup
export changelog
export checkdepends
export conflicts
export depends
export epoch
export groups
export install
export license
export makedepends
export md5sums
export noextract
export optdepends
export options
export pkgbase
export pkgdesc
export pkgname
export pkgrel
export pkgver
export provides
export replaces
export sha1sums
export sha224sums
export sha256sums
export sha384sums
export sha512sums
export source
export url
export validpgpkeys

# Variables exported from makepkg. See also:
# https://wiki.archlinux.org/title/Creating_packages#Defining_PKGBUILD_variables
export srcdir
export pkgdir

# Environment variables that makepkg accepts. See also:
# https://gitlab.archlinux.org/pacman/pacman/-/blob/e017a5975cfe3e53670848bd45c982524d6745af/doc/makepkg.8.asciidoc#user-content-environment-variables
export BUILDDIR
export BUILDTOOL
export BUILDTOOLVER
export CARCH
export GITFLAGS
export GNUPGHOME
export GPGKEY
export LOGDEST
export MAKEPKG_CONF
export PACKAGER
export PACMAN
export PKGDEST
export PKGEXT
export SOURCE_DATE_EPOCH
export SRCDEST
export SRCPKGDEST
