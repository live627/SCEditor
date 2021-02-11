import * as dom from './dom.js';
import * as escape from './escape.js';
import { ie as IE_VER } from './browser.js';

// In IE < 11 a BR at the end of a block level element
// causes a line break. In all other browsers it's collapsed.
var IE_BR_FIX = IE_VER && IE_VER < 11;

/**
 * Gets the text, start/end node and offset for
 * length chars left or right of the passed node
 * at the specified offset.
 *
 * @param  {Node}  node
 * @param  {number}  offset
 * @param range
 * @param  {boolean} isLeft
 * @param  {number}  length
 * @returns {object}
 * @private
 */
var outerText = function (range, isLeft, length)
{
	var nodeValue, remaining, start, end, node,
		text = '',
		next = range.startContainer,
		offset = range.startOffset;

	// Handle cases where node is a paragraph and offset
	// refers to the index of a text node.
	// 3 = text node
	if (next && next.nodeType !== 3)
	{
		next = next.childNodes[offset];
		offset = 0;
	}

	start = end = offset;

	while (length > text.length && next && next.nodeType === 3)
	{
		nodeValue = next.nodeValue;
		remaining = length - text.length;

		// If not the first node, start and end should be at their
		// max values as will be updated when getting the text
		if (node)
		{
			end = nodeValue.length;
			start = 0;
		}

		node = next;

		if (isLeft)
		{
			start = Math.max(end - remaining, 0);
			offset = start;

			text = nodeValue.substr(start, end - start) + text;
			next = node.previousSibling;
		}
		else
		{
			end = Math.min(remaining, nodeValue.length);
			offset = start + end;

			text += nodeValue.substr(start, end);
			next = node.nextSibling;
		}
	}

	return {
		node: node || next,
		offset: offset,
		text: text
	};
};

/**
 * Range helper
 *
 * @param win
 * @param d
 * @class RangeHelper
 * @name RangeHelper
 */
export default function RangeHelper(win, d)
{
	var	_createMarker, _prepareInput,
		doc          = d || win.contentDocument || win.document,
		startMarker  = 'sceditor-start-marker',
		endMarker    = 'sceditor-end-marker',
		base         = this;

	/**
	 * Inserts HTML into the current range replacing any selected
	 * text.
	 *
	 * If endHTML is specified the selected contents will be put between
	 * html and endHTML. If there is nothing selected html and endHTML are
	 * just concatenate together.
	 *
	 * @param {string} html
	 * @param {string} [endHTML]
	 * @returns False on fail
	 * @function
	 * @name insertHTML
	 */
	base.insertHTML = function (html, endHTML)
	{
		var	node, div,
			range = base.selectedRange();

		if (!range)
			return false;

		if (endHTML)
			html += base.selectedHtml() + endHTML;

		div           = dom.createElement('p', {}, doc);
		node          = doc.createDocumentFragment();
		div.innerHTML = html;

		while (div.firstChild)
			dom.appendChild(node, div.firstChild);

		base.insertNode(node);
	};

	/**
	 * Prepares HTML to be inserted by adding a zero width space
	 * if the last child is empty and adding the range start/end
	 * markers to the last child.
	 *
	 * @param  {Node|string} node
	 * @param  {Node|string} [endNode]
	 * @param  {boolean} [returnHtml]
	 * @returns {Node|string}
	 * @private
	 */
	_prepareInput = function (node, endNode, returnHtml)
	{
		var lastChild,
			frag = doc.createDocumentFragment();

		if (typeof node === 'string')
		{
			if (endNode)
				node += base.selectedHtml() + endNode;

			frag = dom.parseHTML(node);
		}
		else
		{
			dom.appendChild(frag, node);

			if (endNode)
			{
				dom.appendChild(frag, base.selectedRange().extractContents());
				dom.appendChild(frag, endNode);
			}
		}

		if (!(lastChild = frag.lastChild))
			return;

		while (!dom.isInline(lastChild.lastChild, true))
			lastChild = lastChild.lastChild;

		if (dom.canHaveChildren(lastChild))
		{
			// Webkit won't allow the cursor to be placed inside an
			// empty tag, so add a zero width space to it.
			if (!lastChild.lastChild)
				dom.appendChild(lastChild, document.createTextNode('\u200B'));

		}
		else
			lastChild = frag;

		base.removeMarkers();

		// Append marks to last child so when restored cursor will be in
		// the right place
		dom.appendChild(lastChild, _createMarker(startMarker));
		dom.appendChild(lastChild, _createMarker(endMarker));

		if (returnHtml)
		{
			var div = dom.createElement('div');
			dom.appendChild(div, frag);

			return div.innerHTML;
		}

		return frag;
	};

	/**
	 * The same as insertHTML except with DOM nodes instead
	 *
	 * <strong>Warning:</strong> the nodes must belong to the
	 * document they are being inserted into. Some browsers
	 * will throw exceptions if they don't.
	 *
	 * Returns boolean false on fail
	 *
	 * @param {Node} node
	 * @param {Node} endNode
	 * @returns {false|undefined}
	 * @function
	 * @name insertNode
	 */
	base.insertNode = function (node, endNode)
	{
		var	input  = _prepareInput(node, endNode),
			range  = base.selectedRange(),
			parent = range.commonAncestorContainer;

		if (!input)
			return false;

		range.deleteContents();

		// FF allows <br /> to be selected but inserting a node
		// into <br /> will cause it not to be displayed so must
		// insert before the <br /> in FF.
		// 3 = TextNode
		if (parent && parent.nodeType !== 3 && !dom.canHaveChildren(parent))
			dom.insertBefore(input, parent);
		else
			range.insertNode(input);

		base.restoreRange();
	};

	/**
	 * Clones the selected Range
	 *
	 * @returns {Range}
	 * @function
	 * @name cloneSelected
	 */
	base.cloneSelected = function ()
	{
		var range = base.selectedRange();

		if (range)
			return range.cloneRange();

	};

	/**
	 * Gets the selected Range
	 *
	 * @returns {Range}
	 * @function
	 * @name selectedRange
	 */
	base.selectedRange = function ()
	{
		var	range, firstChild,
			sel = win.getSelection();

		if (!sel)
			return;

		// When creating a new range, set the start to the first child
		// element of the body element to avoid errors in FF.
		if (sel.rangeCount <= 0)
		{
			firstChild = doc.body;
			while (firstChild.firstChild)
				firstChild = firstChild.firstChild;

			range = doc.createRange();
			// Must be setStartBefore otherwise it can cause infinite
			// loops with lists in WebKit. See issue 442
			range.setStartBefore(firstChild);

			sel.addRange(range);
		}

		if (sel.rangeCount > 0)
			range = sel.getRangeAt(0);

		return range;
	};

	/**
	 * Gets if there is currently a selection
	 *
	 * @returns {boolean}
	 * @function
	 * @name hasSelection
	 * @since 1.4.4
	 */
	base.hasSelection = function ()
	{
		var	sel = win.getSelection();

		return sel && sel.rangeCount > 0;
	};

	/**
	 * Gets the currently selected HTML
	 *
	 * @returns {string}
	 * @function
	 * @name selectedHtml
	 */
	base.selectedHtml = function ()
	{
		var	div,
			range = base.selectedRange();

		if (range)
		{
			div = dom.createElement('p', {}, doc);
			dom.appendChild(div, range.cloneContents());

			return div.innerHTML;
		}

		return '';
	};

	/**
	 * Gets the parent node of the selected contents in the range
	 *
	 * @returns {HTMLElement}
	 * @function
	 * @name parentNode
	 */
	base.parentNode = function ()
	{
		var range = base.selectedRange();

		if (range)
			return range.commonAncestorContainer;

	};

	/**
	 * Gets the first block level parent of the selected
	 * contents of the range.
	 *
	 * @returns {HTMLElement}
	 * @function
	 * @name getFirstBlockParent
	 */
	/**
	 * Gets the first block level parent of the selected
	 * contents of the range.
	 *
	 * @param {Node} [n] The element to get the first block level parent from
	 * @param node
	 * @returns {HTMLElement}
	 * @function
	 * @name getFirstBlockParent^2
	 * @since 1.4.1
	 */
	base.getFirstBlockParent = function (node)
	{
		var func = function (elm)
		{
			if (!dom.isInline(elm, true))
				return elm;

			elm = elm ? elm.parentNode : null;

			return elm ? func(elm) : elm;
		};

		return func(node || base.parentNode());
	};

	/**
	 * Inserts a node at either the start or end of the current selection
	 *
	 * @param {Bool} start
	 * @param {Node} node
	 * @function
	 * @name insertNodeAt
	 */
	base.insertNodeAt = function (start, node)
	{
		var	currentRange = base.selectedRange(),
			range        = base.cloneSelected();

		if (!range)
			return false;

		range.collapse(start);
		range.insertNode(node);

		// Reselect the current range.
		// Fixes issue with Chrome losing the selection. Issue#82
		base.selectRange(currentRange);
	};

	/**
	 * Creates a marker node
	 *
	 * @param {string} id
	 * @returns {HTMLSpanElement}
	 * @private
	 */
	_createMarker = function (id)
	{
		base.removeMarker(id);

		var marker  = dom.createElement('span', {
			id: id,
			className: 'sceditor-selection sceditor-ignore',
			style: 'display:none;line-height:0'
		}, doc);

		marker.innerHTML = ' ';

		return marker;
	};

	/**
	 * Inserts start/end markers for the current selection
	 * which can be used by restoreRange to re-select the
	 * range.
	 *
	 * @function
	 * @name insertMarkers
	 */
	base.insertMarkers = function ()
	{
		var	currentRange = base.selectedRange();
		var startNode = _createMarker(startMarker);

		base.removeMarkers();
		base.insertNodeAt(true, startNode);

		// Fixes issue with end marker sometimes being placed before
		// the start marker when the range is collapsed.
		if (currentRange && currentRange.collapsed)
			startNode.parentNode.insertBefore(
				_createMarker(endMarker), startNode.nextSibling);
		else
			base.insertNodeAt(false, _createMarker(endMarker));

	};

	/**
	 * Gets the marker with the specified ID
	 *
	 * @param {string} id
	 * @returns {Node}
	 * @function
	 * @name getMarker
	 */
	base.getMarker = function (id)
	{
		return doc.getElementById(id);
	};

	/**
	 * Removes the marker with the specified ID
	 *
	 * @param {string} id
	 * @function
	 * @name removeMarker
	 */
	base.removeMarker = function (id)
	{
		var marker = base.getMarker(id);

		if (marker)
			dom.remove(marker);

	};

	/**
	 * Removes the start/end markers
	 *
	 * @function
	 * @name removeMarkers
	 */
	base.removeMarkers = function ()
	{
		base.removeMarker(startMarker);
		base.removeMarker(endMarker);
	};

	/**
	 * Saves the current range location. Alias of insertMarkers()
	 *
	 * @function
	 * @name saveRage
	 */
	base.saveRange = function ()
	{
		base.insertMarkers();
	};

	/**
	 * Select the specified range
	 *
	 * @param {Range} range
	 * @function
	 * @name selectRange
	 */
	base.selectRange = function (range)
	{
		var lastChild;
		var sel = win.getSelection();
		var container = range.endContainer;

		// Check if cursor is set after a BR when the BR is the only
		// child of the parent. In Firefox this causes a line break
		// to occur when something is typed. See issue #321
		if (!IE_BR_FIX && range.collapsed && container &&
			!dom.isInline(container, true))
		{

			lastChild = container.lastChild;
			while (lastChild && dom.is(lastChild, '.sceditor-ignore'))
				lastChild = lastChild.previousSibling;

			if (dom.is(lastChild, 'br'))
			{
				var rng = doc.createRange();
				rng.setEndAfter(lastChild);
				rng.collapse(false);

				if (base.compare(range, rng))
				{
					range.setStartBefore(lastChild);
					range.collapse(true);
				}
			}
		}

		if (sel)
		{
			base.clear();
			sel.addRange(range);
		}
	};

	/**
	 * Restores the last range saved by saveRange() or insertMarkers()
	 *
	 * @function
	 * @name restoreRange
	 */
	base.restoreRange = function ()
	{
		var	isCollapsed,
			range = base.selectedRange(),
			start = base.getMarker(startMarker),
			end   = base.getMarker(endMarker);

		if (!start || !end || !range)
			return false;

		isCollapsed = start.nextSibling === end;

		range = doc.createRange();
		range.setStartBefore(start);
		range.setEndAfter(end);

		if (isCollapsed)
			range.collapse(true);

		base.selectRange(range);
		base.removeMarkers();
	};

	/**
	 * Selects the text left and right of the current selection
	 *
	 * @param {number} left
	 * @param {number} right
	 * @since 1.4.3
	 * @function
	 * @name selectOuterText
	 */
	base.selectOuterText = function (left, right)
	{
		var start, end,
			range = base.cloneSelected();

		if (!range)
			return false;

		range.collapse(false);

		start = outerText(range, true, left);
		end = outerText(range, false, right);

		range.setStart(start.node, start.offset);
		range.setEnd(end.node, end.offset);

		base.selectRange(range);
	};

	/**
	 * Gets the text left or right of the current selection
	 *
	 * @param {boolean} before
	 * @param {number} length
	 * @returns {string}
	 * @since 1.4.3
	 * @function
	 * @name selectOuterText
	 */
	base.getOuterText = function (before, length)
	{
		var	range = base.cloneSelected();

		if (!range)
			return '';

		range.collapse(!before);

		return outerText(range, before, length).text;
	};

	/**
	 * Replaces keywords with values based on the current caret position
	 *
	 * Assumes that the keywords array is sorted shortest to longest
	 *
	 * @param {Array<string, string, RegExp>}   keywords
	 * @param {boolean} includeAfter      If to include the text after the
	 *                                    current caret position or just
	 *                                    text before
	 * @param {boolean} requireWhitespace If the key must be surrounded
	 *                                    by whitespace
	 * @param {string}  keypressChar      If this is being called from
	 *                                    a keypress event, this should be
	 *                                    set to the pressed character
	 * @returns {boolean}
	 * @function
	 * @name replaceKeyword
	 */
	// eslint-disable-next-line max-params
	base.replaceKeyword = function (
		keywords,
		includeAfter,
		requireWhitespace,
		keypressChar
	)
	{
		var outerText, match, matchPos, startIndex,
			leftLen, charsLeft, keyword, keywordLen,
			whitespaceRegex = '(^|[\\s\xA0\u2002\u2003\u2009])',
			keywordIdx      = keywords.length,
			whitespaceLen   = requireWhitespace ? 1 : 0,
			maxKeyLen       = keywords[keywordIdx - 1][0].length;

		if (requireWhitespace)
			maxKeyLen++;

		keypressChar = keypressChar || '';
		outerText    = base.getOuterText(true, maxKeyLen);
		leftLen      = outerText.length;
		outerText   += keypressChar;

		if (includeAfter)
			outerText += base.getOuterText(false, maxKeyLen);

		while (keywordIdx--)
		{
			keyword    = keywords[keywordIdx][0];
			keywordLen = keyword.length;
			startIndex = Math.max(0, leftLen - keywordLen - whitespaceLen);
			matchPos   = -1;

			if (requireWhitespace)
			{
				match = outerText
					.substr(startIndex)
					.match(new RegExp(whitespaceRegex +
						escape.regex(keyword) + whitespaceRegex));

				if (match)
					// Add the length of the text that was removed by
					// substr() and also add 1 for the whitespace
					matchPos = match.index + startIndex + match[1].length;

			}
			else
				matchPos = outerText.indexOf(keyword, startIndex);

			if (matchPos > -1)
				// Make sure the match is between before and
				// after, not just entirely in one side or the other
				if (matchPos <= leftLen &&
					matchPos + keywordLen + whitespaceLen >= leftLen)
				{
					charsLeft = leftLen - matchPos;

					// If the keypress char is white space then it should
					// not be replaced, only chars that are part of the
					// key should be replaced.
					base.selectOuterText(
						charsLeft,
						keywordLen - charsLeft -
							(/^\S/.test(keypressChar) ? 1 : 0)
					);

					base.insertHTML(keywords[keywordIdx][1]);
					return true;
				}

		}

		return false;
	};

	/**
	 * Compares two ranges.
	 *
	 * If rangeB is undefined it will be set to
	 * the current selected range
	 *
	 * @param  {Range} rngA
	 * @param  {Range} [rngB]
	 * @returns {boolean}
	 * @function
	 * @name compare
	 */
	base.compare = function (rngA, rngB)
	{
		if (!rngB)
			rngB = base.selectedRange();

		if (!rngA || !rngB)
			return !rngA && !rngB;

		return rngA.compareBoundaryPoints(Range.END_TO_END, rngB) === 0 &&
			rngA.compareBoundaryPoints(Range.START_TO_START, rngB) === 0;
	};

	/**
	 * Removes any current selection
	 *
	 * @since 1.4.6
	 * @function
	 * @name clear
	 */
	base.clear = function ()
	{
		var sel = win.getSelection();

		if (sel)
			if (sel.removeAllRanges)
				sel.removeAllRanges();
			else if (sel.empty)
				sel.empty();

	};
};
