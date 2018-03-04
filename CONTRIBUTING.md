## So you wanna contribute, eh?

This is a [commitizen](https://github.com/commitizen/cz-cli) friendly project! After running yarn or pnpm/npm install, be sure to use git cz when committing, and then follow the prompts :)

## Releases

This project uses [standard-version](https://github.com/conventional-changelog/standard-version) to manage versions.

When updates are ready to released, run the min and doc commands to updated the minified versions and documentation

> npm run min
> npm run doc

Then commit with git cz and push.

The following is an excerpt from the standard-version README, follow the steps outlined to release.

> stop using `npm version`, use `standard-version` it rocks!

Automatic versioning and CHANGELOG generation, using GitHub's squash button and
[conventional commit messages](https://conventionalcommits.org).

_how it works:_

1. when you land commits on your `master` branch, select the _Squash and Merge_ option.
2. add a title and body that follows the [Conventional Commits Specification](https://conventionalcommits.org).
3. when you're ready to release to npm:
  1. `git checkout master; git pull origin master`
  2. run `standard-version`
  3. `git push --follow-tags origin master && npm publish`

`standard-version` does the following:

1. bumps the version in _package.json/bower.json_ (based on your commit history)
2. uses [conventional-changelog](https://github.com/conventional-changelog/conventional-changelog) to update _CHANGELOG.md_
3. commits _package.json (et al.)_ and _CHANGELOG.md_
4. tags a new release

You can also run
> standard-version --dry-run
OR
> npm run version:dry
in order to see what commands will be run without committing to git or updating files.