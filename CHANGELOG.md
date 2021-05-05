# Changelog

## [3.0.0](https://www.github.com/live627/SCEditor/compare/v2.1.3...v3.0.0) (2021-05-05)


### ⚠ BREAKING CHANGES

* No longer passing `caller` in `command.exec`/`command.code`
* Make all plugins ES modules
* `txtExec` => `code`
* Remove the option `autoUpdate`
* `base.bind()`  => `base.events.on()`
* Make all icons objects ES modules
* Drop `base.rtl()`; infer the direction from the body
* Drop the option `rtl`
* Drop the option `id`
* Drop `emoticons()` (Pass empty opt `emoticons` to disable)
* Drop option `emoticonsEnabled`
* remove the readOnly option; call editor.readOnly(bool) instead
* Drop txtExec
* Drop form events
* emoticons now an array of objects
* break up the xhtml plugin into modules
* sceditor.formats.bbcode is no longer defined and is exported to the window as `bbcode`
* Renamed `base.val()` => `base.getValue()` (use `base.insert()` to add stuff)
* Rename `base.inSourceMode()` => `base.isInSourceMode()`
* Remove `base.sourceMode()` (use `base.toggleSourceMode()`, calling `base.isInSourceMode()`to determine the current mode)
* Remove `base.keyDown()` (use `base.bind('keydown', handler)`)
* Remove `base.keyPress()` (use `base.bind('keypress', handler)`)
* Remove `base.keyUp()` (use `base.bind('keyup', handler)`)
* Remove `base.nodeChanged()` (use `base.bind('nodechanged', handler)`)
* Remove `base.selectionChanged()` (use `base.bind('selectionchanged', handler)`)
* Remove `base.valueChanged()` (use `base.bind('valuechanged', handler)`)
* Plugins to register event listeners instead of "signals"
* Drop option `toolbarExclude`
* The option `toolbar` is now an array
* The option `fonts` is now an array
* Drop option `zIndex`
* The option `colors` an array of objects
* Change dropdown API
* option for plugins now an array

### Features

* Add `base.setValue()` ([d6fcbbc](https://www.github.com/live627/SCEditor/commit/d6fcbbce28dd03ac154d4a9b7c26aad80e8ee7bb))
* Add format() to utils.js ([2579b5a](https://www.github.com/live627/SCEditor/commit/2579b5a1c293f75c8e22fa7ae5d077c7864c7ef8))
* Add isDigit() to utils.js ([23e8e2f](https://www.github.com/live627/SCEditor/commit/23e8e2f411e07eb2928250eef73921961831ab1e))
* add popup ([c163b54](https://www.github.com/live627/SCEditor/commit/c163b5470e34a2e49f597d714b9d5d81e4e5370e))
* Add replaceVars() to utils.js ([5804e7f](https://www.github.com/live627/SCEditor/commit/5804e7f6daaaebb3e72e27c42639010095e2a6a9))
* encode attributes  with entities ([e63d6aa](https://www.github.com/live627/SCEditor/commit/e63d6aa99f8f3e940ceb7b085478fc92a443d8ce))
* image tag ALT text support ([e6e0708](https://www.github.com/live627/SCEditor/commit/e6e0708b51d4711bee59b11f6e28a732bd8f2c2b))
* Linebreak in toolbar ([d71e40a](https://www.github.com/live627/SCEditor/commit/d71e40a98806f20cb28f1e85654a22c2264a07fc))
* Support excluded html tag attributes in bbcode formats with `false` ([d0f58d7](https://www.github.com/live627/SCEditor/commit/d0f58d76dec42ea1ff5488a2c5a8015a373a24cb))
* support timestamps in youtube tag ([a04efe6](https://www.github.com/live627/SCEditor/commit/a04efe64e1e9067a813ddac549868da09aaa94d3))


### Bug Fixes

* Change iframe src to about:blank so that nvda can read its contents ([d81ad18](https://www.github.com/live627/SCEditor/commit/d81ad184f3f571753dee4599e747ff5aacbab808))
* going back in the browser causes content to be lost ([3c72bcb](https://www.github.com/live627/SCEditor/commit/3c72bcb16e6711b33234c47faee2a20c770774ea))
* hasStyling() must always return boolean ([5460ee9](https://www.github.com/live627/SCEditor/commit/5460ee976d2535b99e599bc859aa47d32ffc8e59))
* Throw error if format plugin not found ([ec20603](https://www.github.com/live627/SCEditor/commit/ec2060345db6889a55b8d983a7100b83eeddc1f4))
* try not to double encode entities ([223dc3a](https://www.github.com/live627/SCEditor/commit/223dc3a97863459d831c99b5c98494b430f9f07c))


### Code Refactoring

* `txtExec` => `code` ([b11433c](https://www.github.com/live627/SCEditor/commit/b11433c54a39655e558f30a05caf98188224a1f6))
* break up the bbcode plugin into modules ([26455d0](https://www.github.com/live627/SCEditor/commit/26455d0ac86909a1725ee71e33ca1c0254018629))
* break up the xhtml plugin into modules ([6c86d1e](https://www.github.com/live627/SCEditor/commit/6c86d1ef942eb7260f129612cc1ac71ea4571eb8))
* Change dropdown API ([bf416e2](https://www.github.com/live627/SCEditor/commit/bf416e20153d03f8097cc3e77ec0d9022eb41a6c))
* Drop `base.rtl()`; infer the direction from the body ([3a97bca](https://www.github.com/live627/SCEditor/commit/3a97bca771a0127832659e57c1c46654c335660a))
* Drop `emoticons()` (Pass empty opt `emoticons` to disable) ([b9eada1](https://www.github.com/live627/SCEditor/commit/b9eada1f73695e7180f10ba19c69cd8504ebff2c))
* Drop form events ([d36cfa7](https://www.github.com/live627/SCEditor/commit/d36cfa7eb9009c41a33859ead573dd8d062e6451))
* Drop option `emoticonsEnabled` ([bb621ab](https://www.github.com/live627/SCEditor/commit/bb621ab81783dd11adeceb19fd4005b421d0c12c))
* Drop option `toolbarExclude` ([325b9b2](https://www.github.com/live627/SCEditor/commit/325b9b23f01aca931c262554f3b698003c9cb847))
* Drop option `zIndex` ([20a655e](https://www.github.com/live627/SCEditor/commit/20a655e5267b5c9af1a601ae0931a61245286c72))
* Drop the option `id` ([887282a](https://www.github.com/live627/SCEditor/commit/887282a46fcdfef2ca799d9618a67bcaad395216))
* Drop the option `rtl` ([f39fb7a](https://www.github.com/live627/SCEditor/commit/f39fb7afcdeb4f414a590dd2735b05055bbc24b4))
* Drop txtExec ([26fdbd9](https://www.github.com/live627/SCEditor/commit/26fdbd97a96a57ab301eee7141a2d4ca30f5649d))
* emoticons now an array of objects ([244d8d0](https://www.github.com/live627/SCEditor/commit/244d8d058bc2c65cffcacf7218e161138f73ffce))
* Make all icons objects ES modules ([c18c70d](https://www.github.com/live627/SCEditor/commit/c18c70d95dc868272dba1c85aeb5a5cb278e1a8d))
* Make all plugins ES modules ([802eba6](https://www.github.com/live627/SCEditor/commit/802eba60de608825464859e82e9a7cbb822185e8))
* No longer passing `caller` in `command.exec`/`command.code` ([555d7ff](https://www.github.com/live627/SCEditor/commit/555d7ff30b60a4cc8b398c5c8b287c5d18c547d5))
* option for plugins now an array ([1c0014c](https://www.github.com/live627/SCEditor/commit/1c0014c7b69eeee6afb0a9dc293331831feee2f6))
* Plugins to register event listeners instead of "signals" ([4a010da](https://www.github.com/live627/SCEditor/commit/4a010dad51de9e6107d784ec2bed5b2040d35096))
* Remove `base.keyDown()` (use `base.bind('keydown', handler)`) ([d6fcbbc](https://www.github.com/live627/SCEditor/commit/d6fcbbce28dd03ac154d4a9b7c26aad80e8ee7bb))
* Remove `base.keyPress()` (use `base.bind('keypress', handler)`) ([d6fcbbc](https://www.github.com/live627/SCEditor/commit/d6fcbbce28dd03ac154d4a9b7c26aad80e8ee7bb))
* Remove `base.keyUp()` (use `base.bind('keyup', handler)`) ([d6fcbbc](https://www.github.com/live627/SCEditor/commit/d6fcbbce28dd03ac154d4a9b7c26aad80e8ee7bb))
* Remove `base.nodeChanged()` (use `base.bind('nodechanged', handler)`) ([d6fcbbc](https://www.github.com/live627/SCEditor/commit/d6fcbbce28dd03ac154d4a9b7c26aad80e8ee7bb))
* Remove `base.selectionChanged()` (use `base.bind('selectionchanged', handler)`) ([d6fcbbc](https://www.github.com/live627/SCEditor/commit/d6fcbbce28dd03ac154d4a9b7c26aad80e8ee7bb))
* Remove `base.sourceMode()` (use `base.toggleSourceMode()`, calling `base.isInSourceMode()`to determine the current mode) ([d6fcbbc](https://www.github.com/live627/SCEditor/commit/d6fcbbce28dd03ac154d4a9b7c26aad80e8ee7bb))
* Remove `base.valueChanged()` (use `base.bind('valuechanged', handler)`) ([d6fcbbc](https://www.github.com/live627/SCEditor/commit/d6fcbbce28dd03ac154d4a9b7c26aad80e8ee7bb))
* Remove the option `autoUpdate` ([edebf7e](https://www.github.com/live627/SCEditor/commit/edebf7ec2bdf4f9bf94442cb67475740bddddb90))
* remove the readOnly option; call editor.readOnly(bool) instead ([00f90f7](https://www.github.com/live627/SCEditor/commit/00f90f75dd9191c935995e34c12e79365311281a))
* Rename `base.inSourceMode()` => `base.isInSourceMode()` ([d6fcbbc](https://www.github.com/live627/SCEditor/commit/d6fcbbce28dd03ac154d4a9b7c26aad80e8ee7bb))
* Renamed `base.val()` => `base.getValue()` (use `base.insert()` to add stuff) ([d6fcbbc](https://www.github.com/live627/SCEditor/commit/d6fcbbce28dd03ac154d4a9b7c26aad80e8ee7bb))
* The option `colors` an array of objects ([382cb13](https://www.github.com/live627/SCEditor/commit/382cb13a7285a11ac00bc207e6733f6571e4ad29))
* The option `fonts` is now an array ([d571125](https://www.github.com/live627/SCEditor/commit/d5711257711a196392eaefa57eca7dcc5730808d))
* The option `toolbar` is now an array ([922a5d2](https://www.github.com/live627/SCEditor/commit/922a5d2a39b5a709ebe3cdceba4bc8adccaf6be0))
* Use nanoevents ([56dfb6c](https://www.github.com/live627/SCEditor/commit/56dfb6c01d6b76eb064df17b11a36ae187d512ca))
