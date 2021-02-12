---
layout: default
group: func
navtitle: Class: SCEditor
title: Class: SCEditor
---
* auto-gen TOC:
{:toc}# Class: SCEditor

## SCEditor

#### new SCEditor(original, userOptions)

SCEditor - A lightweight WYSIWYG editor

##### Parameters:

|Name|Type|Description|
|----|----|-----------|
|`original`|*HTMLTextAreaElement*|The textarea to be converted|
|`userOptions`|*object*||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js), [line 53](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js#L53)

---------------

### Members

#### commands

All the commands supported by the editor

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js), [line 316](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js#L316)

#### events

All the events supported by the editor

The supported events are:

* keyup
* keydown
* Keypress
* blur
* focus
* nodechanged - When the current node containing
		the selection changes in WYSIWYG mode
* contextmenu
* selectionchanged
* valuechanged

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js), [line 324](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js#L324)

#### opts

Options for this editor instance

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js), [line 301](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js#L301)

#### <_inner_> format

Editor format like BBCode or HTML

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js), [line 73](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js#L73)

#### <_inner_> isComposing :boolean

If the user is currently composing text via IME

##### Type:
_*boolean*_

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js), [line 144](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js#L144)

#### <_inner_> valueChangedKeyUpTimer :number

Timer for valueChanged key handler

##### Type:
_*number*_

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js), [line 151](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js#L151)

### Methods

#### _(str, args) &rarr; {string}

Translates the string into the locale language.

Replaces any {0}, {1}, {2}, ect. with the params provided.

##### Parameters:

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`str`|*string*|  ||
|`args`|*string*|  *repeatable*||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js), [line 1921](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js#L1921)

##### Returns:

_**Type**_
    *string*

#### blur() &rarr; {this}

Blurs the editors input area

*Since:*
    - 1.3.6|

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js), [line 1935](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js#L1935)

##### Returns:

_**Type**_
    *this*

#### css() &rarr; {string}

Gets the current WYSIWYG editors inline CSS

*Since:*
    - 1.4.3|

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js), [line 2005](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js#L2005)

##### Returns:

_**Type**_
    *string*

#### css^2(css) &rarr; {this}

Sets inline CSS for the WYSIWYG editor

##### Parameters:

|Name|Type|Description|
|----|----|-----------|
|`css`|*string*||

*Since:*
    - 1.4.3|

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js), [line 2014](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js#L2014)

##### Returns:

_**Type**_
    *this*

#### currentBlockNode() &rarr; {Node}

Gets the first block level node that contains the
selection/caret in WYSIWYG mode.

Will be null in sourceMode or if there is no selection.

*Since:*
    - 1.4.4|

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js), [line 1769](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js#L1769)

##### Returns:

_**Type**_
    *Node*

#### currentNode() &rarr; {Node}

Gets the current node that contains the selection/caret in
WYSIWYG mode.

Will be null in sourceMode or if there is no selection.

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js), [line 1756](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js#L1756)

##### Returns:

_**Type**_
    *Node*

#### destroy()

Destroys the editor, removing all elements and
event handlers.

Leaves only the original textarea.

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js), [line 963](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js#L963)

#### dimensions() &rarr; {object}

Returns an object with the properties width and height
which are the width and height of the editor in px.

*Since:*
    - 1.4.1|

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js), [line 770](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js#L770)

##### Returns:

_**Type**_
    *object*

#### dimensions^2(width, height) &rarr; {this}

<p>Sets the width and/or height of the editor.</p>

<p>If width or height is not numeric it is ignored.</p>

##### Parameters:

|Name|Type|Description|
|----|----|-----------|
|`width`|*number*|Width in px|
|`height`|*number*|Height in px|

*Since:*
    - 1.4.1|

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js), [line 780](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js#L780)

##### Returns:

_**Type**_
    *this*

#### dimensions^3(width, height, save) &rarr; {this}

<p>Sets the width and/or height of the editor.</p>

<p>If width or height is not numeric it is ignored.</p>

<p>The save argument specifies if to save the new sizes.
The saved sizes can be used for things like restoring from
maximized state. This should normally be left as true.</p>

##### Parameters:

|Name|Type|Argument|Default|Description|
|----|----|--------|-------|-----------|
|`width`|*number*|  ||Width in px|
|`height`|*number*|  ||Height in px|
|`save`|*boolean*|*optional*  |true|If to store the new sizes|

*Since:*
    - 1.4.1|

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js), [line 793](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js#L793)

##### Returns:

_**Type**_
    *this*

#### execCommand(command, param)

Executes a command on the WYSIWYG editor

##### Parameters:

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`command`|*string*|  ||
|`param`|*string*|*boolean*|*optional*  ||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js), [line 1630](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js#L1630)

#### expandToContent()

Expands or shrinks the editors height to the height of it's content

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js), [line 935](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js#L935)

#### focus() &rarr; {this}

Focuses the editors input area

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js), [line 1954](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js#L1954)

##### Returns:

_**Type**_
    *this*

#### getBody() &rarr; {HTMLElement}

Gets the WYSIWYG editor's iFrame Body.

*Since:*
    - 1.4.3|

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js), [line 1416](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js#L1416)

##### Returns:

_**Type**_
    *HTMLElement*

#### getContentAreaContainer() &rarr; {HTMLElement}

Gets the WYSIWYG editors container area (whole iFrame).

*Since:*
    - 1.4.3|

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js), [line 1427](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js#L1427)

##### Returns:

_**Type**_
    *HTMLElement*

#### getEditorContainer() &rarr; {HTMLElement}

Gets the entire editor's container.

*Since:*
    - 3.0.0|

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js), [line 1405](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js#L1405)

##### Returns:

_**Type**_
    *HTMLElement*

#### getRangeHelper() &rarr; {[RangeHelper](RangeHelper.md)}

Gets the current instance of the rangeHelper class
for the editor.

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js), [line 1271](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js#L1271)

##### Returns:

_**Type**_
    *[RangeHelper](RangeHelper.md)*

#### getWysiwygEditorValue(filter) &rarr; {string}

Gets the WYSIWYG editors HTML value.

If using a plugin that filters the Ht Ml like the BBCode plugin
it will return the result of the filtering (BBCode) unless the
filter param is set to false.

##### Parameters:

|Name|Type|Argument|Default|Description|
|----|----|--------|-------|-----------|
|`filter`|*boolean*|*optional*  |true||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js), [line 1368](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js#L1368)

##### Returns:

_**Type**_
    *string*

#### height() &rarr; {number}

Gets the height of the editor in px

*Since:*
    - 1.3.5|

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js), [line 839](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js#L839)

##### Returns:

_**Type**_
    *number*

#### height^2(height) &rarr; {this}

Sets the height of the editor

##### Parameters:

|Name|Type|Description|
|----|----|-----------|
|`height`|*number*|Height in px|

*Since:*
    - 1.3.5|

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js), [line 848](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js#L848)

##### Returns:

_**Type**_
    *this*

#### height^3(height, saveHeight) &rarr; {this}

Sets the height of the editor

The saveHeight specifies if to save the height.

The stored height can be used for things like
restoring from maximized state.

##### Parameters:

|Name|Type|Argument|Default|Description|
|----|----|--------|-------|-----------|
|`height`|*number*|  ||Height in px|
|`saveHeight`|*boolean*|*optional*  |true|If to store the height|

*Since:*
    - 1.4.1|

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js), [line 858](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js#L858)

##### Returns:

_**Type**_
    *this*

#### insert(start, end, filter, allowMixed) &rarr; {this}

Inserts HTML/BBCode into the editor

If end is supplied any selected text will be placed between
start and end. If there is no selected text start and end
will be concatenated together.

If the filter param is set to true, the HTML/BBCode will be
passed through any plugin filters. If using the BBCode plugin
this will convert any BBCode into HTML.

If the allowMixed param is set to true, HTML any will not be
escaped

##### Parameters:

|Name|Type|Argument|Default|Description|
|----|----|--------|-------|-----------|
|`start`|*string*|  |||
|`end`|*string*|*optional*  |||
|`filter`|*boolean*|*optional*  |true||
|`allowMixed`|*boolean*|*optional*  |false||

*Since:*
    - 1.4.3|

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js), [line 1310](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js#L1310)

##### Returns:

_**Type**_
    *this*

#### insertText(text, endText)

Inserts text into the WYSIWYG or source editor depending on which
mode the editor is in.

If endText is specified any selected text will be placed between
text and endText. If no text is selected text and endText will
just be concatenate together.

##### Parameters:

|Name|Type|Argument|Default|Description|
|----|----|--------|-------|-----------|
|`text`|*string*|  |||
|`endText`|*string*|*optional*  |||

*Since:*
    - 1.3.5|

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js), [line 1195](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js#L1195)

#### isInSourceMode() &rarr; {boolean}

If the editor is in source code mode

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js), [line 1547](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js#L1547)

##### Returns:

_**Type**_
    *boolean*

#### isReadOnly() &rarr; {boolean}

Gets if the editor is read only

*Since:*
    - 3.0.0|

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js), [line 700](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js#L700)

##### Returns:

_**Type**_
    *boolean*

#### maximize() &rarr; {boolean}

Gets if the editor is maximised or not

*Since:*
    - 1.4.1|

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js), [line 884](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js#L884)

##### Returns:

_**Type**_
    *boolean*

#### maximize^2(maximize) &rarr; {this}

Sets if the editor is maximised or not

##### Parameters:

|Name|Type|Description|
|----|----|-----------|
|`maximize`|*boolean*|If to maximise the editor|

*Since:*
    - 1.4.1|

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js), [line 893](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js#L893)

##### Returns:

_**Type**_
    *this*

#### readOnly(readOnly)

Sets if the editor is read only

##### Parameters:

|Name|Type|Description|
|----|----|-----------|
|`readOnly`|*boolean*||

*Since:*
    - 1.3.5|

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js), [line 711](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js#L711)

#### setSourceEditorValue(value)

Sets the text editor value

##### Parameters:

|Name|Type|Description|
|----|----|-----------|
|`value`|*string*||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js), [line 1518](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js#L1518)

#### setValue(value)

Sets the WYSIWYG HTML editor value. Should only be the HTML
contained within the body tags

##### Parameters:

|Name|Type|Description|
|----|----|-----------|
|`value`|*string*||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js), [line 1483](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js#L1483)

#### setWysiwygEditorValue(value)

Sets the WYSIWYG HTML editor value. Should only be the HTML
contained within the body tags

##### Parameters:

|Name|Type|Description|
|----|----|-----------|
|`value`|*string*||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js), [line 1496](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js#L1496)

#### sourceEditorCaret(position) &rarr; {this}

Gets or sets the source editor caret position.

##### Parameters:

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`position`|*object*|*optional*  ||

*Since:*
    - 1.4.5|

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js), [line 1282](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js#L1282)

##### Returns:

_**Type**_
    *this*

#### sourceEditorInsertText(text, endText)

Like wysiwygEditorInsertHtml but inserts text into the
source mode editor instead.

If endText is specified any selected text will be placed between
text and endText. If no text is selected text and endText will
just be concatenate together.

The cursor will be placed after the text param. If endText is
specified the cursor will be placed before endText, so passing:<br />

'[b]', '[/b]'

Would cause the cursor to be placed:<br />

[b]Selected text|[/b]

##### Parameters:

|Name|Type|Argument|Default|Description|
|----|----|--------|-------|-----------|
|`text`|*string*|  |||
|`endText`|*string*|*optional*  |||

*Since:*
    - 1.4.0|

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js), [line 1220](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js#L1220)

#### toggleSourceMode()

Switches between the WYSIWYG and source modes

*Since:*
    - 1.4.0|

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js), [line 1560](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js#L1560)

#### updateOriginal()

Updates the textarea that the editor is replacing
with the value currently inside the editor.

*Since:*
    - 1.4.0|

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js), [line 1533](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js#L1533)

#### val() &rarr; {string}

Gets the value of the editor.

If the editor is in WYSIWYG mode it will return the filtered
HTML from it (converted to BBCode if using the BBCode plugin).
It it's in Source Mode it will return the unfiltered contents
of the source editor (if using the BBCode plugin this will be
BBCode again).

*Since:*
    - 1.3.5|

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js), [line 1438](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js#L1438)

##### Returns:

_**Type**_
    *string*

#### width() &rarr; {number}

Gets the width of the editor in pixels

*Since:*
    - 1.3.5|

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js), [line 727](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js#L727)

##### Returns:

_**Type**_
    *number*

#### width^2(width) &rarr; {this}

Sets the width of the editor

##### Parameters:

|Name|Type|Description|
|----|----|-----------|
|`width`|*number*|Width in pixels|

*Since:*
    - 1.3.5|

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js), [line 736](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js#L736)

##### Returns:

_**Type**_
    *this*

#### width^3(width, saveWidth) &rarr; {this}

Sets the width of the editor

The saveWidth specifies if to save the width. The stored width can be
used for things like restoring from maximized state.

##### Parameters:

|Name|Type|Argument|Default|Description|
|----|----|--------|-------|-----------|
|`width`|*number*|  ||Width in pixels|
|`saveWidth`|*boolean*|*optional*  |true|If to store the width|

*Since:*
    - 1.4.1|

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js), [line 746](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js#L746)

##### Returns:

_**Type**_
    *this*

#### wysiwygEditorInsertHtml(html, endHtml, overrideCodeBlocking)

Inserts HTML into WYSIWYG editor.

If endHtml is specified,  any selected text will be placed
between html and endHtml. If there is no selected text html
and endHtml will just be concatenate together.

##### Parameters:

|Name|Type|Argument|Default|Description|
|----|----|--------|-------|-----------|
|`html`|*string*|  |||
|`endHtml`|*string*|*optional*  |||
|`overrideCodeBlocking`|*boolean*|*optional*  |false|If to insert the html
                                              into code tags, by
                                              default code tags only
                                              support text.|

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js), [line 1119](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js#L1119)

#### wysiwygEditorInsertText(text, endText)

Like wysiwygEditorInsertHtml except it will convert any HTML
into text before inserting it.

##### Parameters:

|Name|Type|Argument|Default|Description|
|----|----|--------|-------|-----------|
|`text`|*string*|  |||
|`endText`|*string*|*optional*  |||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js), [line 1178](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js#L1178)

#### <_inner_> currentStyledBlockNode() &rarr; {HTMLElement}

Gets the first styled block node that contains the cursor

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js), [line 2278](out/C:/Users/John/repos/SCEditor/src/lib/SCEditor.js#L2278)

##### Returns:

_**Type**_
    *HTMLElement*