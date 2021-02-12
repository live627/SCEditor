---
layout: default
group: func
navtitle: Class\: TokenizeToken
title: Class\: TokenizeToken
---
* auto-gen TOC:
{:toc}# Class: TokenizeToken

## [BBCodeParser](BBCodeParser.md)#TokenizeToken

#### new TokenizeToken(type, name, val, attrs, children, closing)

Tokenize token object

##### Parameters:

|Name|Type|Description|
|----|----|-----------|
|`type`|*string*|The type of token this is,
                      should be one of tokenType|
|`name`|*string*|The name of this token|
|`val`|*string*|The originally matched string|
|`attrs`|*Array*|Any attributes. Only set on
                      TOKEN_TYPE_OPEN tokens|
|`children`|*Array*|Any children of this token|
|`closing`|*[TokenizeToken](TokenizeToken.md)*|This tokens closing tag.
                                Only set on TOKEN_TYPE_OPEN tokens|

*Source:*
[out/C:/Users/John/repos/SCEditor/src/formats/bbcode.js](out/C:/Users/John/repos/SCEditor/src/formats/bbcode.js), [line 86](out/C:/Users/John/repos/SCEditor/src/formats/bbcode.js#L86)

---------------