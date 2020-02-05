run npm init --yes for default package.json

when importing modules these steps are taken:
1) check core modules - only if module name provided
2) check for file or folder - if path given as argument
   looks for foldername/index.js
3) node_modules (no path must be given)

When installing a node package, package dependencies are also installed and saved under application's node_modules/ folder. Only if dependency version different from version required by app, will a package be saved locally under package. This saves from multiple saves of same module and deeply nested structure.

use 'npm i' to install the dependencies listed in package.json. Make sure to include node_modules/ in .gitignore

Semantic Versioning (SemVer)

    Packages that have version numbers split into three numbers seperated by .
    e.g. 4.13.2 => Major.Minor.Patch
    Patch: mainly for bug fixes
    Minor: new features that don't break existing API
    Major: new features that may break existing apps that depend on current version

    e.g. ^4.13.2 => same as 4.x => meaning download any version falling under
    Major release 4. Allows for patch and minor release updates.

    e.g. ~1.8.3 => same as 1.8.x => meaning download any version falling under
    Major release 1 and Minor release 8. Allows for patch updates.

    Remove caret (^) or tilde (~) to specify download of exact version. e.g. 4.13.2

Checking Versions
    Use 'npm list' to list all node modules and their versions.
    'npm list --depth=0' to list only application dependencies.

    Use 'npm view package-name' to view package.json file for a node package.
    Use 'npm view package-name dependencies' to view only depencies for package.
    Use 'npm view package-name versions' to view all version numbers.

Downgrading and Upgrading
    to install a specific version:
    e.g. npm i mongoose@2.4.2

    Use 'npm outdated' to view packages that are not latest release. It shows current version, wanted version depending on dependency rules, and latest version in npm registry.

    Using 'npm update' will update all packages to latest Minor/Patch releases.

    Using the package: npm-check-updates => npm-check-updates to do versioning check.
    Then use 'ncu -u' to update package.json => WARN: this does not install new version.
    Must then use npm i to install latest releases in npm registry. npm outdated will then not return anything.

DevDependencies
    Deps that are not used in app functionality but help development process. e.g. testing scripts.
    to save: 'npm i package-name --save-dev'
    dev deps will still be saved under node_modules/

Uninstall Package
    To uninstall package: 'npm uninstall package-name' or 'npm un package-name'. Removes package from package.json and node_modules/

Global Packages
    -g flag refers to global packages installed on machine.
    e.g. 'npm i -g npm' will update npm cli tool on local system.
    works with other commands e.g. 'npm -g outdated'

Publishing Packages
    See lion-lib folder.