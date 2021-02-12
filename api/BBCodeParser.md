---
layout: default
group: func
navtitle: Class\: BBCodeParser
title: Class\: BBCodeParser
---
* auto-gen TOC:
{:toc}# BBCodeParser

## BBCodeParser

#### new BBCodeParser(options)

SCEditor BBCode parser class

##### Parameters:

|Name|Type|Description|
|----|----|-----------|
|`options`|*object*||

*Since:*
    - v1.4.0|

*Source:*
[out/C:/Users/John/repos/SCEditor/src/formats/bbcode.js](out/C:/Users/John/repos/SCEditor/src/formats/bbcode.js), [line 160](out/C:/Users/John/repos/SCEditor/src/formats/bbcode.js#L160)

---------------

### Classes
[TokenizeToken](BBCodeParser_TokenizeToken.md)

### Methods

#### <_inner_> normaliseNewLines(children, parent, onlyRemoveBreakAfter) &rarr; {void}

Normalise all new lines

Removes any formatting new lines from the BBCode
leaving only content ones. I.e. for a list:

[list]
[*] list item one
with a line break
[*] list item two
[/list]

would become

[list] [*] list item one
with a line break [*] list item two [/list]

Which makes it easier to convert to HTML or add
the formatting new lines back in when converting
back to BBCode

##### Parameters:

|Name|Type|Description|
|----|----|-----------|
|`children`|*Array*||
|`parent`|*[TokenizeToken](TokenizeToken.md)*||
|`onlyRemoveBreakAfter`|*boolean*||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/formats/bbcode.js](out/C:/Users/John/repos/SCEditor/src/formats/bbcode.js), [line 649](out/C:/Users/John/repos/SCEditor/src/formats/bbcode.js#L649)

##### Returns:

_**Type**_
    *void*