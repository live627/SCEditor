---
layout: default
group: func
navtitle: Class: RangeHelper
title: Class: RangeHelper
---
* auto-gen TOC:
{:toc}# Class: RangeHelper

## RangeHelper

#### new RangeHelper(win, d)

Range helper

##### Parameters:

|Name|Type|Description|
|----|----|-----------|
|`win`|||
|`d`|||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js](out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js), [line 80](out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js#L80)

---------------

### Methods

#### clear()

Removes any current selection

*Since:*
    - 1.4.6|

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js](out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js), [line 765](out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js#L765)

#### cloneSelected() &rarr; {Range}

Clones the selected Range

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js](out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js), [line 240](out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js#L240)

##### Returns:

_**Type**_
    *Range*

#### compare(rngA, rngB) &rarr; {boolean}

Compares two ranges.

If rangeB is undefined it will be set to
the current selected range

##### Parameters:

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`rngA`|*Range*|  ||
|`rngB`|*Range*|*optional*  ||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js](out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js), [line 740](out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js#L740)

##### Returns:

_**Type**_
    *boolean*

#### getFirstBlockParent() &rarr; {HTMLElement}

Gets the first block level parent of the selected
contents of the range.

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js](out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js), [line 352](out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js#L352)

##### Returns:

_**Type**_
    *HTMLElement*

#### getFirstBlockParent^2(n, node) &rarr; {HTMLElement}

Gets the first block level parent of the selected
contents of the range.

##### Parameters:

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`n`|*Node*|*optional*  |The element to get the first block level parent from|
|`node`||  ||

*Since:*
    - 1.4.1|

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js](out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js), [line 361](out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js#L361)

##### Returns:

_**Type**_
    *HTMLElement*

#### getMarker(id) &rarr; {Node}

Gets the marker with the specified ID

##### Parameters:

|Name|Type|Description|
|----|----|-----------|
|`id`|*string*||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js](out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js), [line 462](out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js#L462)

##### Returns:

_**Type**_
    *Node*

#### hasSelection() &rarr; {boolean}

Gets if there is currently a selection

*Since:*
    - 1.4.4|

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js](out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js), [line 295](out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js#L295)

##### Returns:

_**Type**_
    *boolean*

#### insertHTML(html, endHTML)

Inserts HTML into the current range replacing any selected
text.

If endHTML is specified the selected contents will be put between
html and endHTML. If there is nothing selected html and endHTML are
just concatenate together.

##### Parameters:

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`html`|*string*|  ||
|`endHTML`|*string*|*optional*  ||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js](out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js), [line 96](out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js#L96)

##### Returns:

False on fail

#### insertMarkers()

Inserts start/end markers for the current selection
which can be used by restoreRange to re-select the
range.

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js](out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js), [line 435](out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js#L435)

#### insertNode(node, endNode) &rarr; {false|undefined}

The same as insertHTML except with DOM nodes instead

<strong>Warning:</strong> the nodes must belong to the
document they are being inserted into. Some browsers
will throw exceptions if they don't.

Returns boolean false on fail

##### Parameters:

|Name|Type|Description|
|----|----|-----------|
|`node`|*Node*||
|`endNode`|*Node*||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js](out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js), [line 201](out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js#L201)

##### Returns:

_**Type**_
    *false*|*undefined*

#### insertNodeAt(start, node)

Inserts a node at either the start or end of the current selection

##### Parameters:

|Name|Type|Description|
|----|----|-----------|
|`start`|*Bool*||
|`node`|*Node*||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js](out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js), [line 388](out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js#L388)

#### parentNode() &rarr; {HTMLElement}

Gets the parent node of the selected contents in the range

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js](out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js), [line 335](out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js#L335)

##### Returns:

_**Type**_
    *HTMLElement*

#### removeMarker(id)

Removes the marker with the specified ID

##### Parameters:

|Name|Type|Description|
|----|----|-----------|
|`id`|*string*||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js](out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js), [line 476](out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js#L476)

#### removeMarkers()

Removes the start/end markers

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js](out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js), [line 493](out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js#L493)

#### replaceKeyword(keywords, includeAfter, requireWhitespace, keypressChar) &rarr; {boolean}

Replaces keywords with values based on the current caret position

Assumes that the keywords array is sorted shortest to longest

##### Parameters:

|Name|Type|Description|
|----|----|-----------|
|`keywords`|*Array.&lt;string, string, RegExp>*||
|`includeAfter`|*boolean*|If to include the text after the
                                   current caret position or just
                                   text before|
|`requireWhitespace`|*boolean*|If the key must be surrounded
                                   by whitespace|
|`keypressChar`|*string*|If this is being called from
                                   a keypress event, this should be
                                   set to the pressed character|

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js](out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js), [line 646](out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js#L646)

##### Returns:

_**Type**_
    *boolean*

#### restoreRange()

Restores the last range saved by saveRange() or insertMarkers()

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js](out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js), [line 564](out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js#L564)

#### saveRage()

Saves the current range location. Alias of insertMarkers()

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js](out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js), [line 506](out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js#L506)

#### selectedHtml() &rarr; {string}

Gets the currently selected HTML

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js](out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js), [line 311](out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js#L311)

##### Returns:

_**Type**_
    *string*

#### selectedRange() &rarr; {Range}

Gets the selected Range

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js](out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js), [line 257](out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js#L257)

##### Returns:

_**Type**_
    *Range*

#### selectOuterText(left, right)

Selects the text left and right of the current selection

##### Parameters:

|Name|Type|Description|
|----|----|-----------|
|`left`|*number*||
|`right`|*number*||

*Since:*
    - 1.4.3|

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js](out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js), [line 594](out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js#L594)

#### selectOuterText(before, length) &rarr; {string}

Gets the text left or right of the current selection

##### Parameters:

|Name|Type|Description|
|----|----|-----------|
|`before`|*boolean*||
|`length`|*number*||

*Since:*
    - 1.4.3|

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js](out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js), [line 623](out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js#L623)

##### Returns:

_**Type**_
    *string*

#### selectRange(range)

Select the specified range

##### Parameters:

|Name|Type|Description|
|----|----|-----------|
|`range`|*Range*||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js](out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js), [line 518](out/C:/Users/John/repos/SCEditor/src/lib/RangeHelper.js#L518)