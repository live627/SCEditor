---
layout: default
group: func
navtitle: Class: PluginManager
title: Class: PluginManager
---
* auto-gen TOC:
{:toc}# Class: PluginManager

## PluginManager

#### new PluginManager(thisObj)

Plugin Manager class

##### Parameters:

|Name|Type|Description|
|----|----|-----------|
|`thisObj`|||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/PluginManager.js](out/C:/Users/John/repos/SCEditor/src/lib/PluginManager.js), [line 1](out/C:/Users/John/repos/SCEditor/src/lib/PluginManager.js#L1)

---------------

### Members

#### destroy

Clears all plugins and removes the owner reference.

Calling any functions on this object after calling
destroy will cause a JS error.

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/PluginManager.js](out/C:/Users/John/repos/SCEditor/src/lib/PluginManager.js), [line 109](out/C:/Users/John/repos/SCEditor/src/lib/PluginManager.js#L109)

### Methods

#### deregister(plugin) &rarr; {boolean}

Deregisters a plugin.

##### Parameters:

|Name|Type|Description|
|----|----|-----------|
|`plugin`|*string*||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/PluginManager.js](out/C:/Users/John/repos/SCEditor/src/lib/PluginManager.js), [line 78](out/C:/Users/John/repos/SCEditor/src/lib/PluginManager.js#L78)

##### Returns:

_**Type**_
    *boolean*

#### exists(plugin) &rarr; {boolean}

Checks if the plugin exists in plugins

##### Parameters:

|Name|Type|Description|
|----|----|-----------|
|`plugin`|*string*||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/PluginManager.js](out/C:/Users/John/repos/SCEditor/src/lib/PluginManager.js), [line 19](out/C:/Users/John/repos/SCEditor/src/lib/PluginManager.js#L19)

##### Returns:

_**Type**_
    *boolean*

#### isRegistered(plugin) &rarr; {boolean}

Checks if the passed plugin is currently registered.

##### Parameters:

|Name|Type|Description|
|----|----|-----------|
|`plugin`|*string*||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/PluginManager.js](out/C:/Users/John/repos/SCEditor/src/lib/PluginManager.js), [line 31](out/C:/Users/John/repos/SCEditor/src/lib/PluginManager.js#L31)

##### Returns:

_**Type**_
    *boolean*

#### register(plugin) &rarr; {boolean}

Registers a plugin to receive signals

##### Parameters:

|Name|Type|Description|
|----|----|-----------|
|`plugin`|*string*||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/PluginManager.js](out/C:/Users/John/repos/SCEditor/src/lib/PluginManager.js), [line 54](out/C:/Users/John/repos/SCEditor/src/lib/PluginManager.js#L54)

##### Returns:

_**Type**_
    *boolean*