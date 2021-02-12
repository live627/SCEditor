---
layout: default
group: func
navtitle: Module: dom
title: Module: dom
---
* auto-gen TOC:
{:toc}# Module: dom

## dom

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/dom.js](out/C:/Users/John/repos/SCEditor/src/lib/dom.js), [line 15](out/C:/Users/John/repos/SCEditor/src/lib/dom.js#L15)

---------------

### Members

#### <_static_> blockLevelList :string

List of block level elements separated by bars (|)

##### Type:
_*string*_

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/dom.js](out/C:/Users/John/repos/SCEditor/src/lib/dom.js), [line 769](out/C:/Users/John/repos/SCEditor/src/lib/dom.js#L769)

#### <_static_> COMMENT_NODE :number

Node type constant for comment nodes

##### Type:
_*number*_

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/dom.js](out/C:/Users/John/repos/SCEditor/src/lib/dom.js), [line 38](out/C:/Users/John/repos/SCEditor/src/lib/dom.js#L38)

#### <_static_> DOCUMENT_FRAGMENT_NODE :number

Node type constant for document fragments

##### Type:
_*number*_

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/dom.js](out/C:/Users/John/repos/SCEditor/src/lib/dom.js), [line 52](out/C:/Users/John/repos/SCEditor/src/lib/dom.js#L52)

#### <_static_> DOCUMENT_NODE :number

Node type document nodes

##### Type:
_*number*_

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/dom.js](out/C:/Users/John/repos/SCEditor/src/lib/dom.js), [line 45](out/C:/Users/John/repos/SCEditor/src/lib/dom.js#L45)

#### <_static_> ELEMENT_NODE :number

Node type constant for element nodes

##### Type:
_*number*_

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/dom.js](out/C:/Users/John/repos/SCEditor/src/lib/dom.js), [line 24](out/C:/Users/John/repos/SCEditor/src/lib/dom.js#L24)

#### <_static_> EVENT_BUBBLE :boolean

For on() and off() if to add/remove the event
to the bubble phase

##### Type:
_*boolean*_

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/dom.js](out/C:/Users/John/repos/SCEditor/src/lib/dom.js), [line 192](out/C:/Users/John/repos/SCEditor/src/lib/dom.js#L192)

#### <_static_> EVENT_CAPTURE :boolean

For on() and off() if to add/remove the event
to the capture phase

##### Type:
_*boolean*_

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/dom.js](out/C:/Users/John/repos/SCEditor/src/lib/dom.js), [line 184](out/C:/Users/John/repos/SCEditor/src/lib/dom.js#L184)

#### <_static_> TEXT_NODE :number

Node type constant for text nodes

##### Type:
_*number*_

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/dom.js](out/C:/Users/John/repos/SCEditor/src/lib/dom.js), [line 31](out/C:/Users/John/repos/SCEditor/src/lib/dom.js#L31)

### Methods

#### <_static_> addClass(node, className)

##### Parameters:

|Name|Type|Description|
|----|----|-----------|
|`node`|*HTMLElement*||
|`className`|*string*||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/dom.js](out/C:/Users/John/repos/SCEditor/src/lib/dom.js), [line 495](out/C:/Users/John/repos/SCEditor/src/lib/dom.js#L495)

#### <_static_> appendChild(node, child)

Appends child to parent node

##### Parameters:

|Name|Type|Description|
|----|----|-----------|
|`node`|*HTMLElement*||
|`child`|*HTMLElement*||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/dom.js](out/C:/Users/John/repos/SCEditor/src/lib/dom.js), [line 161](out/C:/Users/John/repos/SCEditor/src/lib/dom.js#L161)

#### <_static_> attr(node, attr, value)

If only attr param is specified it will get
the value of the attr param.

If value is specified but null the attribute
will be removed otherwise the attr value will
be set to the passed value.

##### Parameters:

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`node`|*HTMLElement*|  ||
|`attr`|*string*|  ||
|`value`|*string*|*optional* *nullable* ||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/dom.js](out/C:/Users/John/repos/SCEditor/src/lib/dom.js), [line 286](out/C:/Users/John/repos/SCEditor/src/lib/dom.js#L286)

#### <_static_> canHaveChildren(node) &rarr; {boolean}

List of elements that do not allow children separated by bars (|)

##### Parameters:

|Name|Type|Description|
|----|----|-----------|
|`node`|*Node*||

*Since:*
    - 1.4.5|

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/dom.js](out/C:/Users/John/repos/SCEditor/src/lib/dom.js), [line 779](out/C:/Users/John/repos/SCEditor/src/lib/dom.js#L779)

##### Returns:

_**Type**_
    *boolean*

#### <_static_> closest(node, selector) &rarr; {HTMLElement|undefined}

Checks the passed node and all parents and
returns the first matching node if any.

##### Parameters:

|Name|Type|Description|
|----|----|-----------|
|`node`|*HTMLElement*||
|`selector`|*string*||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/dom.js](out/C:/Users/John/repos/SCEditor/src/lib/dom.js), [line 138](out/C:/Users/John/repos/SCEditor/src/lib/dom.js#L138)

##### Returns:

_**Type**_
    *HTMLElement*|*undefined*

#### <_static_> contains(node, child) &rarr; {boolean}

Returns true if node contains child otherwise false.

This differs from the DOM contains() method in that
if node and child are equal this will return false.

##### Parameters:

|Name|Type|Description|
|----|----|-----------|
|`node`|*Node*||
|`child`|*HTMLElement*||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/dom.js](out/C:/Users/John/repos/SCEditor/src/lib/dom.js), [line 442](out/C:/Users/John/repos/SCEditor/src/lib/dom.js#L442)

##### Returns:

_**Type**_
    *boolean*

#### <_static_> convertElement(element, toTagName) &rarr; {HTMLElement}

Converts an element from one type to another.

For example it can convert the element <b> to <strong>

##### Parameters:

|Name|Type|Description|
|----|----|-----------|
|`element`|*HTMLElement*||
|`toTagName`|*string*||

*Since:*
    - 1.4.4|

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/dom.js](out/C:/Users/John/repos/SCEditor/src/lib/dom.js), [line 739](out/C:/Users/John/repos/SCEditor/src/lib/dom.js#L739)

##### Returns:

_**Type**_
    *HTMLElement*

#### <_static_> copyCSS(from, to)

Copy the CSS from 1 node to another.

Only copies CSS defined on the element e.g. style attr.

##### Parameters:

|Name|Type|Description|
|----|----|-----------|
|`from`|*HTMLElement*||
|`to`|*HTMLElement*||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/dom.js](out/C:/Users/John/repos/SCEditor/src/lib/dom.js), [line 826](out/C:/Users/John/repos/SCEditor/src/lib/dom.js#L826)

#### <_static_> createElement(tag, attributes, context) &rarr; {HTMLElement}

Creates an element with the specified attributes

Will create it in the current document unless context
is specified.

##### Parameters:

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`tag`|*string*|  ||
|`attributes`|*object.&lt;string, string>*|*optional*  ||
|`context`|*Document*|*optional*  ||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/dom.js](out/C:/Users/John/repos/SCEditor/src/lib/dom.js), [line 75](out/C:/Users/John/repos/SCEditor/src/lib/dom.js#L75)

##### Returns:

_**Type**_
    *HTMLElement*

#### <_static_> css(node, rule, value) &rarr; {string|number|undefined}

Gets a computed CSS values or sets an inline CSS value

Rules should be in camelCase format and not
hyphenated like CSS properties.

##### Parameters:

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`node`|*HTMLElement*|  ||
|`rule`|*object*|*string*|  ||
|`value`|*string*|*number*|*optional*  ||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/dom.js](out/C:/Users/John/repos/SCEditor/src/lib/dom.js), [line 355](out/C:/Users/John/repos/SCEditor/src/lib/dom.js#L355)

##### Returns:

_**Type**_
    *string*|*number*|*undefined*

#### <_static_> data(node, key, value) &rarr; {object|undefined}

Gets or sets the data attributes on a node

Unlike the jQuery version this only stores data
in the DOM attributes which means only strings
can be stored.

##### Parameters:

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`node`|*Node*|  ||
|`key`|*string*|*optional*  ||
|`value`|*string*|*optional*  ||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/dom.js](out/C:/Users/John/repos/SCEditor/src/lib/dom.js), [line 388](out/C:/Users/John/repos/SCEditor/src/lib/dom.js#L388)

##### Returns:

_**Type**_
    *object*|*undefined*

#### <_static_> extractContents(startNode, endNode) &rarr; {DocumentFragment}

Extracts all the nodes between the start and end nodes

##### Parameters:

|Name|Type|Description|
|----|----|-----------|
|`startNode`|*HTMLElement*|The node to start extracting at|
|`endNode`|*HTMLElement*|The node to stop extracting at|

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/dom.js](out/C:/Users/John/repos/SCEditor/src/lib/dom.js), [line 1012](out/C:/Users/John/repos/SCEditor/src/lib/dom.js#L1012)

##### Returns:

_**Type**_
    *DocumentFragment*

#### <_static_> find(node, selector) &rarr; {NodeList}

Finds any child nodes that match the selector

##### Parameters:

|Name|Type|Description|
|----|----|-----------|
|`node`|*HTMLElement*||
|`selector`|*string*||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/dom.js](out/C:/Users/John/repos/SCEditor/src/lib/dom.js), [line 173](out/C:/Users/John/repos/SCEditor/src/lib/dom.js#L173)

##### Returns:

_**Type**_
    *NodeList*

#### <_static_> findCommonAncestor(node1, node2) &rarr; {HTMLElement}

Finds the common parent of two nodes

##### Parameters:

|Name|Type|Description|
|----|----|-----------|
|`node1`|*HTMLElement*||
|`node2`|*HTMLElement*||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/dom.js](out/C:/Users/John/repos/SCEditor/src/lib/dom.js), [line 892](out/C:/Users/John/repos/SCEditor/src/lib/dom.js#L892)

##### Returns:

_**Type**_
    *HTMLElement*

#### <_static_> fixNesting(node)

Fixes block level elements inside in inline elements.

Also fixes invalid list nesting by placing nested lists
inside the previous li tag or wrapping them in an li tag.

##### Parameters:

|Name|Type|Description|
|----|----|-----------|
|`node`|*HTMLElement*||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/dom.js](out/C:/Users/John/repos/SCEditor/src/lib/dom.js), [line 839](out/C:/Users/John/repos/SCEditor/src/lib/dom.js#L839)

#### <_static_> getOffset(node) &rarr; {object}

Gets the offset position of an element

##### Parameters:

|Name|Type|Description|
|----|----|-----------|
|`node`|*HTMLElement*||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/dom.js](out/C:/Users/John/repos/SCEditor/src/lib/dom.js), [line 1028](out/C:/Users/John/repos/SCEditor/src/lib/dom.js#L1028)

##### Returns:

An object with left and top properties

_**Type**_
    *object*

#### <_static_> getSibling(node, node, previous) &rarr; {Node}

##### Parameters:

|Name|Type|Argument|Default|Description|
|----|----|--------|-------|-----------|
|`node`|*Node*| *nullable* |||
|`node`||  |||
|`previous`|*boolean*|*optional*  |false||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/dom.js](out/C:/Users/John/repos/SCEditor/src/lib/dom.js), [line 906](out/C:/Users/John/repos/SCEditor/src/lib/dom.js#L906)

##### Returns:

_**Type**_
    *Node*

#### <_static_> getStyle(elm, property) &rarr; {string}

Gets the value of a CSS property from the elements style attribute

##### Parameters:

|Name|Type|Description|
|----|----|-----------|
|`elm`|*HTMLElement*||
|`property`|*string*||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/dom.js](out/C:/Users/John/repos/SCEditor/src/lib/dom.js), [line 1053](out/C:/Users/John/repos/SCEditor/src/lib/dom.js#L1053)

##### Returns:

_**Type**_
    *string*

#### <_static_> hasClass(node, className) &rarr; {boolean}

##### Parameters:

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`node`|*HTMLElement*| *nullable* ||
|`className`|*string*|  ||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/dom.js](out/C:/Users/John/repos/SCEditor/src/lib/dom.js), [line 486](out/C:/Users/John/repos/SCEditor/src/lib/dom.js#L486)

##### Returns:

_**Type**_
    *boolean*

#### <_static_> hasStyle(elm, property, values) &rarr; {boolean}

Tests if an element has a style.

If values are specified it will check that the styles value
matches one of the values

##### Parameters:

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`elm`|*HTMLElement*|  ||
|`property`|*string*|  ||
|`values`|*string*|*Array*|*optional*  ||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/dom.js](out/C:/Users/John/repos/SCEditor/src/lib/dom.js), [line 1096](out/C:/Users/John/repos/SCEditor/src/lib/dom.js#L1096)

##### Returns:

_**Type**_
    *boolean*

#### <_static_> hasStyling(elm, node) &rarr; {boolean}

Checks if an element has any styling.

It has styling if it is not a plain <div> or <p> or
if it has a class, style attribute or data.

##### Parameters:

|Name|Type|Description|
|----|----|-----------|
|`elm`|*HTMLElement*||
|`node`|||

*Since:*
    - 1.4.4|

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/dom.js](out/C:/Users/John/repos/SCEditor/src/lib/dom.js), [line 723](out/C:/Users/John/repos/SCEditor/src/lib/dom.js#L723)

##### Returns:

_**Type**_
    *boolean*

#### <_static_> height(node, value) &rarr; {number|undefined}

Gets or sets the height of the passed node.

##### Parameters:

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`node`|*HTMLElement*|  ||
|`value`|*number*|*string*|*optional*  ||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/dom.js](out/C:/Users/John/repos/SCEditor/src/lib/dom.js), [line 570](out/C:/Users/John/repos/SCEditor/src/lib/dom.js#L570)

##### Returns:

_**Type**_
    *number*|*undefined*

#### <_static_> hide(node)

Sets the passed elements display to none

##### Parameters:

|Name|Type|Description|
|----|----|-----------|
|`node`|*HTMLElement*||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/dom.js](out/C:/Users/John/repos/SCEditor/src/lib/dom.js), [line 315](out/C:/Users/John/repos/SCEditor/src/lib/dom.js#L315)

#### <_static_> insertBefore(node, refNode) &rarr; {Node}

##### Parameters:

|Name|Type|Description|
|----|----|-----------|
|`node`|*Node*||
|`refNode`|*Node*||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/dom.js](out/C:/Users/John/repos/SCEditor/src/lib/dom.js), [line 467](out/C:/Users/John/repos/SCEditor/src/lib/dom.js#L467)

##### Returns:

_**Type**_
    *Node*

#### <_static_> is(node, selector) &rarr; {boolean}

Checks if node matches the given selector.

##### Parameters:

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`node`|*HTMLElement*| *nullable* ||
|`selector`|*string*|  ||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/dom.js](out/C:/Users/John/repos/SCEditor/src/lib/dom.js), [line 421](out/C:/Users/John/repos/SCEditor/src/lib/dom.js#L421)

##### Returns:

_**Type**_
    *boolean*

#### <_static_> isInline(elm, includeCodeAsBlock) &rarr; {boolean}

Checks if an element is inline

##### Parameters:

|Name|Type|Argument|Default|Description|
|----|----|--------|-------|-----------|
|`elm`|*HTMLElement*|  |||
|`includeCodeAsBlock`|*boolean*|*optional*  |false||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/dom.js](out/C:/Users/John/repos/SCEditor/src/lib/dom.js), [line 802](out/C:/Users/John/repos/SCEditor/src/lib/dom.js#L802)

##### Returns:

_**Type**_
    *boolean*

#### <_static_> isVisible(node, node) &rarr; {boolean}

Returns if a node is visible.

##### Parameters:

|Name|Type|Description|
|----|----|-----------|
|`node`|*HTMLElement*||
|`node`|||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/dom.js](out/C:/Users/John/repos/SCEditor/src/lib/dom.js), [line 618](out/C:/Users/John/repos/SCEditor/src/lib/dom.js#L618)

##### Returns:

_**Type**_
    *boolean*

#### <_static_> off(node, events, selector, fn, capture)

Removes an event listener for the specified events.

##### Parameters:

|Name|Type|Argument|Default|Description|
|----|----|--------|-------|-----------|
|`node`|*Node*|  |||
|`events`|*string*|  |||
|`selector`|*string*|*optional*  |||
|`fn`|*function*|  |||
|`capture`|*boolean*|*optional*  |false||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/dom.js](out/C:/Users/John/repos/SCEditor/src/lib/dom.js), [line 256](out/C:/Users/John/repos/SCEditor/src/lib/dom.js#L256)

*See:*

    - on()
|

#### <_static_> on(node, events, selector, fn, capture)

Adds an event listener for the specified events.

Events should be a space separated list of events.

If selector is specified the handler will only be
called when the event target matches the selector.

##### Parameters:

|Name|Type|Argument|Default|Description|
|----|----|--------|-------|-----------|
|`node`|*Node*|  |||
|`events`|*string*|  |||
|`selector`|*string*|*optional*  |||
|`fn`|*function*|  |||
|`capture`|*boolean*|*optional*  |false||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/dom.js](out/C:/Users/John/repos/SCEditor/src/lib/dom.js), [line 210](out/C:/Users/John/repos/SCEditor/src/lib/dom.js#L210)

*See:*

    - off()
|

#### <_static_> parent(node, selector) &rarr; {HTMLElement|undefined}

Gets the first parent node that matches the selector

##### Parameters:

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`node`|*HTMLElement*|  ||
|`selector`|*string*|*optional*  ||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/dom.js](out/C:/Users/John/repos/SCEditor/src/lib/dom.js), [line 120](out/C:/Users/John/repos/SCEditor/src/lib/dom.js#L120)

##### Returns:

_**Type**_
    *HTMLElement*|*undefined*

#### <_static_> parents(node, selector) &rarr; {Array.&lt;HTMLElement>}

Returns an array of parents that matches the selector

##### Parameters:

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`node`|*HTMLElement*|  ||
|`selector`|*string*|*optional*  ||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/dom.js](out/C:/Users/John/repos/SCEditor/src/lib/dom.js), [line 100](out/C:/Users/John/repos/SCEditor/src/lib/dom.js#L100)

##### Returns:

_**Type**_
    *Array.&lt;HTMLElement>*

#### <_static_> parseHTML(html, context) &rarr; {DocumentFragment}

Parses HTML into a document fragment

##### Parameters:

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`html`|*string*|  ||
|`context`|*Document*|*optional*  ||

*Since:*
    - 1.4.4|

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/dom.js](out/C:/Users/John/repos/SCEditor/src/lib/dom.js), [line 697](out/C:/Users/John/repos/SCEditor/src/lib/dom.js#L697)

##### Returns:

_**Type**_
    *DocumentFragment*

#### <_static_> previousElementSibling(node, selector) &rarr; {HTMLElement}

##### Parameters:

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`node`|*Node*|  ||
|`selector`|*string*|*optional*  ||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/dom.js](out/C:/Users/John/repos/SCEditor/src/lib/dom.js), [line 452](out/C:/Users/John/repos/SCEditor/src/lib/dom.js#L452)

##### Returns:

_**Type**_
    *HTMLElement*

#### <_static_> remove(node)

Removes the node from the DOM

##### Parameters:

|Name|Type|Description|
|----|----|-----------|
|`node`|*HTMLElement*||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/dom.js](out/C:/Users/John/repos/SCEditor/src/lib/dom.js), [line 148](out/C:/Users/John/repos/SCEditor/src/lib/dom.js#L148)

#### <_static_> removeAttr(node, attr)

Removes the specified attribute

##### Parameters:

|Name|Type|Description|
|----|----|-----------|
|`node`|*HTMLElement*||
|`attr`|*string*||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/dom.js](out/C:/Users/John/repos/SCEditor/src/lib/dom.js), [line 305](out/C:/Users/John/repos/SCEditor/src/lib/dom.js#L305)

#### <_static_> removeClass(node, className)

##### Parameters:

|Name|Type|Description|
|----|----|-----------|
|`node`|*HTMLElement*||
|`className`|*string*||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/dom.js](out/C:/Users/John/repos/SCEditor/src/lib/dom.js), [line 509](out/C:/Users/John/repos/SCEditor/src/lib/dom.js#L509)

#### <_static_> removeWhiteSpace(root)

Removes unused whitespace from the root and all it's children.

##### Parameters:

|Name|Type|Description|
|----|----|-----------|
|`root`|*HTMLElement*||

*Since:*
    - 1.4.3|

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/dom.js](out/C:/Users/John/repos/SCEditor/src/lib/dom.js), [line 921](out/C:/Users/John/repos/SCEditor/src/lib/dom.js#L921)

#### <_static_> rTraverse(node, func, innermostFirst, siblingsOnly)

Like traverse but loops in reverse

##### Parameters:

|Name|Type|Description|
|----|----|-----------|
|`node`|||
|`func`|||
|`innermostFirst`|||
|`siblingsOnly`|||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/dom.js](out/C:/Users/John/repos/SCEditor/src/lib/dom.js), [line 684](out/C:/Users/John/repos/SCEditor/src/lib/dom.js#L684)

*See:*

    - traverse
|

#### <_static_> show(node)

Sets the passed elements display to default

##### Parameters:

|Name|Type|Description|
|----|----|-----------|
|`node`|*HTMLElement*||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/dom.js](out/C:/Users/John/repos/SCEditor/src/lib/dom.js), [line 325](out/C:/Users/John/repos/SCEditor/src/lib/dom.js#L325)

#### <_static_> toggle(node)

Toggles an elements visibility

##### Parameters:

|Name|Type|Description|
|----|----|-----------|
|`node`|*HTMLElement*||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/dom.js](out/C:/Users/John/repos/SCEditor/src/lib/dom.js), [line 335](out/C:/Users/John/repos/SCEditor/src/lib/dom.js#L335)

#### <_static_> toggleClass(node, className, state)

Toggles a class on node.

If state is specified and is truthy it will add
the class.

If state is specified and is falsey it will remove
the class.

##### Parameters:

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`node`|*HTMLElement*|  ||
|`className`|*string*|  ||
|`state`|*boolean*|*optional*  ||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/dom.js](out/C:/Users/John/repos/SCEditor/src/lib/dom.js), [line 531](out/C:/Users/John/repos/SCEditor/src/lib/dom.js#L531)

#### <_static_> traverse(node, func, innermostFirst, siblingsOnly, reverse)

Loop all child nodes of the passed node

The function should accept 1 parameter being the node.
If the function returns false the loop will be exited.

##### Parameters:

|Name|Type|Argument|Default|Description|
|----|----|--------|-------|-----------|
|`node`|*HTMLElement*|  |||
|`func`|*function*|  ||Callback which is called with every
                                  child node as the first argument.|
|`innermostFirst`|*boolean*|  ||If the innermost node should be passed
                                  to the function before it's parents.|
|`siblingsOnly`|*boolean*|  ||If to only traverse the nodes siblings|
|`reverse`|*boolean*|*optional*  |false|If to traverse the nodes in reverse|

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/dom.js](out/C:/Users/John/repos/SCEditor/src/lib/dom.js), [line 654](out/C:/Users/John/repos/SCEditor/src/lib/dom.js#L654)

#### <_static_> trigger(node, eventName, data)

Triggers a custom event with the specified name and
sets the detail property to the data object passed.

##### Parameters:

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`node`|*HTMLElement*|  ||
|`eventName`|*string*|  ||
|`data`|*object*|*optional*  ||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/dom.js](out/C:/Users/John/repos/SCEditor/src/lib/dom.js), [line 592](out/C:/Users/John/repos/SCEditor/src/lib/dom.js#L592)

#### <_static_> width(node, value) &rarr; {number|undefined}

Gets or sets the width of the passed node.

##### Parameters:

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`node`|*HTMLElement*|  ||
|`value`|*number*|*string*|*optional*  ||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/dom.js](out/C:/Users/John/repos/SCEditor/src/lib/dom.js), [line 549](out/C:/Users/John/repos/SCEditor/src/lib/dom.js#L549)

##### Returns:

_**Type**_
    *number*|*undefined*

#### <_inner_> camelCase(string) &rarr; {string}

Convert CSS property names into camel case

##### Parameters:

|Name|Type|Description|
|----|----|-----------|
|`string`|*string*||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/dom.js](out/C:/Users/John/repos/SCEditor/src/lib/dom.js), [line 629](out/C:/Users/John/repos/SCEditor/src/lib/dom.js#L629)

##### Returns:

_**Type**_
    *string*

#### <_inner_> classes(node) &rarr; {Array.&lt;string>}

##### Parameters:

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`node`|*HTMLElement*| *nullable* ||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/dom.js](out/C:/Users/John/repos/SCEditor/src/lib/dom.js), [line 476](out/C:/Users/John/repos/SCEditor/src/lib/dom.js#L476)

##### Returns:

_**Type**_
    *Array.&lt;string>*

#### <_inner_> toFloat(value)

##### Parameters:

|Name|Type|Description|
|----|----|-----------|
|`value`|||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/lib/dom.js](out/C:/Users/John/repos/SCEditor/src/lib/dom.js), [line 57](out/C:/Users/John/repos/SCEditor/src/lib/dom.js#L57)