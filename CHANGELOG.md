## [2.0.1](https://github.com/vladislavbogomolov/sdk-fidelio-suite-8/compare/v2.0.0...v2.0.1) (2026-07-13)


### Bug Fixes

* backfill ProfileGlobalID from the insert response in Profile.create() ([9417e8b](https://github.com/vladislavbogomolov/sdk-fidelio-suite-8/commit/9417e8b33760c60c9d1b898c73f21d8153355b5a))

# [2.0.0](https://github.com/vladislavbogomolov/sdk-fidelio-suite-8/compare/v1.0.106...v2.0.0) (2026-07-13)


### Bug Fixes

* bind spawned requests and hydrated models to the active connection ([61177c7](https://github.com/vladislavbogomolov/sdk-fidelio-suite-8/commit/61177c78ef74db123a3f6e8e4f57c4a1f80f7335))
* honor caller arguments that were silently discarded ([44de8df](https://github.com/vladislavbogomolov/sdk-fidelio-suite-8/commit/44de8dfc0bc2550fd0c983045240fb1f58b3d05e))
* initialize absent collections instead of crashing ([4fc7d56](https://github.com/vladislavbogomolov/sdk-fidelio-suite-8/commit/4fc7d5617bf07c4de64c5240666f4d6cb3d9b579))
* make repeated sends on one instance safe ([94d126e](https://github.com/vladislavbogomolov/sdk-fidelio-suite-8/commit/94d126e95c8bde782419466599b54e146acf51c9))
* parse Fidelio timestamps with 24-hour clock ([0f4abe2](https://github.com/vladislavbogomolov/sdk-fidelio-suite-8/commit/0f4abe2b9e68aac5d063eb3295b431434a62676f))
* read PersonalDocument IssuerCountryID from its own attribute ([0ebb261](https://github.com/vladislavbogomolov/sdk-fidelio-suite-8/commit/0ebb26136cd75ef8ff50329c9bc2f62a3cae1614))
* stop auto-loading .env from library code ([d8e9124](https://github.com/vladislavbogomolov/sdk-fidelio-suite-8/commit/d8e91248d31f7e3635bddaeb01e21f82abbb9021))


### Features

* typed FidelioError and full package-root exports ([bcd0ea6](https://github.com/vladislavbogomolov/sdk-fidelio-suite-8/commit/bcd0ea6ed6845d411f4aaa17eb6242f4198597b1))


### BREAKING CHANGES

* server errors are thrown as FidelioError instances
instead of plain {status, message} objects (both fields still present).
The broken addNote_old method, the placeholder Connections array, the
unused IFidelioRequest alias and the misspelled interfaces/commamds
deep-import path have been removed. The SDK no longer auto-loads .env
on import.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
