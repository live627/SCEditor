---
layout: default
group: func
navtitle: Class: xhtml
title: Class: xhtml
---
* auto-gen TOC:
{:toc}# Class: xhtml

## xhtml

#### new xhtml()

SCEditor XHTML plugin

*Since:*
    - v1.4.1|

*Source:*
[out/C:/Users/John/repos/SCEditor/src/formats/xhtml.js](out/C:/Users/John/repos/SCEditor/src/formats/xhtml.js), [line 342](out/C:/Users/John/repos/SCEditor/src/formats/xhtml.js#L342)

---------------

### Members

#### <_static_> allowedAttribs :object

Allowed attributes map.

To allow an attribute for all tags use * as the tag name.

Leave empty or null to allow all attributes. (the disallow
list will be used to filter them instead)

##### Type:
_*object*_

*Since:*
    - v1.4.1|

*Source:*
[out/C:/Users/John/repos/SCEditor/src/formats/xhtml.js](out/C:/Users/John/repos/SCEditor/src/formats/xhtml.js), [line 760](out/C:/Users/John/repos/SCEditor/src/formats/xhtml.js#L760)

#### <_static_> allowedEmptyTags :Array

Array containing tags which should not be removed when empty.

##### Type:
_*Array*_

*Since:*
    - v2.0.0|

*Source:*
[out/C:/Users/John/repos/SCEditor/src/formats/xhtml.js](out/C:/Users/John/repos/SCEditor/src/formats/xhtml.js), [line 807](out/C:/Users/John/repos/SCEditor/src/formats/xhtml.js#L807)

#### <_static_> allowedTags :Array

Array containing all the allowed tags.

If null or empty all tags will be allowed.

##### Type:
_*Array*_

*Since:*
    - v1.4.1|

*Source:*
[out/C:/Users/John/repos/SCEditor/src/formats/xhtml.js](out/C:/Users/John/repos/SCEditor/src/formats/xhtml.js), [line 785](out/C:/Users/John/repos/SCEditor/src/formats/xhtml.js#L785)

#### <_static_> converters :Array

Tag conveters, a converter is applied to all
tags that match the criteria.

##### Type:
_*Array*_

*Since:*
    - v1.4.1|

*Source:*
[out/C:/Users/John/repos/SCEditor/src/formats/xhtml.converters.js](out/C:/Users/John/repos/SCEditor/src/formats/xhtml.converters.js), [line 7](out/C:/Users/John/repos/SCEditor/src/formats/xhtml.converters.js#L7)

#### <_static_> disallowedAttribs :object

Attributes that are not allowed.

Only used if allowed attributes is null or empty.

##### Type:
_*object*_

*Since:*
    - v1.4.1|

*Source:*
[out/C:/Users/John/repos/SCEditor/src/formats/xhtml.js](out/C:/Users/John/repos/SCEditor/src/formats/xhtml.js), [line 774](out/C:/Users/John/repos/SCEditor/src/formats/xhtml.js#L774)

#### <_static_> disallowedTags :Array

Array containing all the disallowed tags.

Only used if allowed tags is null or empty.

##### Type:
_*Array*_

*Since:*
    - v1.4.1|

*Source:*
[out/C:/Users/John/repos/SCEditor/src/formats/xhtml.js](out/C:/Users/John/repos/SCEditor/src/formats/xhtml.js), [line 796](out/C:/Users/John/repos/SCEditor/src/formats/xhtml.js#L796)

### Methods

#### toSource(isFragment, html, context, parent) &rarr; {string}

Converts the WYSIWYG content to XHTML

##### Parameters:

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`isFragment`|*boolean*|  ||
|`html`|*string*|  ||
|`context`|*Document*|  ||
|`parent`|*HTMLElement*|*optional*  ||

*Source:*
[out/C:/Users/John/repos/SCEditor/src/formats/xhtml.js](out/C:/Users/John/repos/SCEditor/src/formats/xhtml.js), [line 405](out/C:/Users/John/repos/SCEditor/src/formats/xhtml.js#L405)

##### Returns:

_**Type**_
    *string*