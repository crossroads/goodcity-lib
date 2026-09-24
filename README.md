# GoodCity Lib

Shared Ember addon for the GoodCity **stock** (warehouse) and **browse** (charity) apps,
part of the [GoodCity](https://www.goodcity.hk) platform run by Crossroads Foundation,
Hong Kong.

It holds widgets and utilities used by both apps. It has **no models, adapters, session
or socket layer**. For the donor and admin apps, that domain layer lives in
[shared.goodcity](https://github.com/crossroads/shared.goodcity), a separate addon.

| Consumer                                                         | Pinned as                                                                 |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------- |
| [stock.goodcity](https://github.com/crossroads/stock.goodcity)   | `"goodcity-lib": "https://github.com/crossroads/goodcity-lib.git#master"` |
| [browse.goodcity](https://github.com/crossroads/browse.goodcity) | `"goodcity-lib": "https://github.com/crossroads/goodcity-lib.git#master"` |

The addon is private and not published to npm. Apps install it straight from this repo's
`master` branch.

## What's inside

This is an **app-tree addon**. Most files live in `app/`, which Ember merges into the host
app's own namespace, so the stock app imports `stock/utils/ajax-promise` even though the
file comes from here.

| Area        | Files                                                                                                                                                                            |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Components  | `loading`, `message-box`, `message-box-click-button`, `numeric-input`, `online-button`, `radio-button`, `select-list`                                                            |
| Services    | `message-box`: `alert` / `confirm` / `custom` modal dialogs                                                                                                                      |
| Utils       | `ajax-promise`: the raw-AJAX client for the GoodCity API, a jQuery AJAX call wrapped in a promise. It reads `config.APP.NAMESPACE`, or `NAMESPACE_V2` when you pass `version: 2` |
| Computed    | `local-storage`: a computed property backed by localStorage, then a cookie, then memory                                                                                          |
| Controllers | `search_module`, `search_organisation`: infinite-scroll search built on `ember-infinity`                                                                                         |
| Helpers     | `is-and`, `is-or`, `is-not`, `is-equal`, `is-not-equal`, `is-greater`, `apply-line-break`, `display-messages-day`, `js-x`                                                        |
| Styles      | `_goodcity_lib.scss` (loading, select, ellipsis, smart banner)                                                                                                                   |

To use the styles, a consuming app adds `@import 'goodcity_lib';` to its `app.scss`.

### Things to know before editing

- **A host app's own file wins, silently.** If a file with the same name exists in the host
  app, Ember uses the host's copy and gives no warning. `stock.goodcity` overrides
  `loading`, `message-box`, `message-box-click-button`, `online-button` and
  `radio-button`. `browse.goodcity` overrides `loading` and `message-box`. Editing those
  files here changes nothing in those apps.
- **browse never imports `_goodcity_lib.scss`**, so this addon's styles don't reach browse.
- **stock doesn't define `NAMESPACE_V2`.** Calling `ajax-promise` with `version: 2` in
  stock puts `undefined` in the URL.
- **`js-x` evaluates its template arguments with `Function()`.** Never pass it anything a
  user controls.
- **Stay on Ember 2.x idioms**: `Ember.$`, `Ember.Controller.extend`, mixins. Don't mix in
  Octane-style code.

## Setup

Requires **Node 10** (see `.nvmrc`). Ember itself comes from **Bower**, so the
`bower install` step is required.

```bash
git clone git@github.com:crossroads/goodcity-lib.git
cd goodcity-lib
nvm use
yarn
yarn run bower install
```

## Developing against a consuming app

Link your local checkout into stock or browse. `index.js` sets `isDevelopingAddon` to
true, so once the addon is linked, `ember serve` in the app watches this addon's source
and live-reloads when you edit it.

```bash
cd goodcity-lib && yarn link
cd ../stock.goodcity && yarn link goodcity-lib    # or browse.goodcity

# to go back to the git-installed copy
yarn unlink goodcity-lib && yarn install --force
```

Test in **both** consumers before merging. A change can look fine in stock and still break
browse.

## Tests

There are no unit or integration tests. The test run consists of the `ember-cli-jshint`
lint checks, one per module, against the dummy app in `tests/dummy`.

CI starts a dev server before it runs the tests, so do the same locally:

```bash
# terminal 1
yarn run ember server --port 4203
# terminal 2
yarn run ember test
```

> **Don't use `yarn test`.** It runs `ember try:each` across old Ember version scenarios
> that no longer pass. Use `yarn run ember test`.

Prettier 1.15.3 runs on commit through husky and lint-staged. There is no config file, so
it uses the defaults. Don't upgrade Prettier: a new version would reformat the entire repo.

## CI and releasing

CircleCI (`.circleci/config.yml`) installs dependencies, runs the tests on every branch,
and uploads coverage to Code Climate from `master` and `live`. No deploy step exists.

"Releasing" means merging to `master`. Consuming apps don't pick the change up
automatically, because each app's `yarn.lock` pins a specific commit. To move the app to
the new commit, run this in each app:

```bash
yarn upgrade goodcity-lib
```

Commit the updated `yarn.lock` to that app.

Work on a `GCW-####-short-description` feature branch and open a PR to `master`.
