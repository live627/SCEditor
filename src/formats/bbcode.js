import {
	css, attr, is, hasStyling, getStyle,
	isInline, traverse, removeWhiteSpace
} from '../lib/dom.js';
import { each, extend, isFunction, stripQuotes, replaceVars,
	format as formatString } from '../lib/utils.js';
import { entities as escapeEntities } from '../lib/escape.js';
import { ie as IE_VER } from '../lib/ie.js';
import bbcodeHandlers from './bbcode.formats.js';
import bbcodeDefaults from './bbcode.defaults.js';
import bbcodeCommands from './bbcode.commands.js';
import QuoteType from './bbcode.quotetype.js';

// In IE < 11 a BR at the end of a block level element
// causes a line break. In all other browsers it's collapsed.
var IE_BR_FIX = IE_VER && IE_VER < 11;

var EMOTICON_DATA_ATTR = 'data-sceditor-emoticon';

/**
 * Removes the first and last divs from the HTML.
 *
 * This is needed for pasting
 * @param  {string} html
 * @return {string}
 * @private
 */
function removeFirstLastDiv(html)
{
	var	node, next, removeDiv,
		output = document.createElement('div');

	removeDiv = function (node, isFirst)
	{
		// Don't remove divs that have styling
		if (hasStyling(node))
			return;

		if (IE_BR_FIX || (node.childNodes.length !== 1 ||
			!is(node.firstChild, 'br')))
			while ((next = node.firstChild))
				output.insertBefore(next, node);


		if (isFirst)
		{
			var lastChild = output.lastChild;

			if (node !== lastChild && is(lastChild, 'div') &&
				node.nextSibling === lastChild)
				output.insertBefore(document.createElement('br'), node);

		}

		output.removeChild(node);
	};

	css(output, 'display', 'none');
	output.innerHTML = html.replace(/<\/div>\n/g, '</div>');

	if ((node = output.firstChild) && is(node, 'div'))
		removeDiv(node, true);

	if ((node = output.lastChild) && is(node, 'div'))
		removeDiv(node);

	return output.innerHTML;
}

var TOKEN_OPEN = 'open';
var TOKEN_CONTENT = 'content';
var TOKEN_NEWLINE = 'newline';
var TOKEN_CLOSE = 'close';

/*
 * @typedef {Object} TokenizeToken
 * @property {string} type
 * @property {string} name
 * @property {string} val
 * @property {Object.<string, string>} attrs
 * @property {array} children
 * @property {TokenizeToken} closing
 */

/**
 * Tokenize token object
 *
 * @param  {string} type The type of token this is,
 *                       should be one of tokenType
 * @param  {string} name The name of this token
 * @param  {string} val The originally matched string
 * @param  {array} attrs Any attributes. Only set on
 *                       TOKEN_TYPE_OPEN tokens
 * @param  {array} children Any children of this token
 * @param  {TokenizeToken} closing This tokens closing tag.
 *                                 Only set on TOKEN_TYPE_OPEN tokens
 * @class {TokenizeToken}
 * @name {TokenizeToken}
 * @memberOf BBCodeParser.prototype
 */
// eslint-disable-next-line max-params
function TokenizeToken(type, name, val, attrs, children, closing)
{
	var base      = this;

	base.type     = type;
	base.name     = name;
	base.val      = val;
	base.attrs    = attrs || {};
	base.children = children || [];
	base.closing  = closing || null;
};

TokenizeToken.prototype = {
	/**
	* Clones this token
	*
	* @return {TokenizeToken}
	*/
	clone()
	{
		var base = this;

		return new TokenizeToken(
			base.type,
			base.name,
			base.val,
			extend({}, base.attrs),
			[],
			base.closing ? base.closing.clone() : null
		);
	},
	/**
	* Splits this token at the specified child
	*
	* @param  {TokenizeToken} splitAt The child to split at
	* @return {TokenizeToken} The right half of the split token or
	*                         empty clone if invalid splitAt lcoation
	*/
	splitAt(splitAt)
	{
		var offsetLength;
		var base         = this;
		var	clone        = base.clone();
		var offset       = base.children.indexOf(splitAt);

		if (offset > -1)
		{
			// Work out how many items are on the right side of the split
			// to pass to splice()
			offsetLength   = base.children.length - offset;
			clone.children = base.children.splice(offset, offsetLength);
		}

		return clone;
	}
};

/**
 * SCEditor BBCode parser class
 *
 * @param {Object} options
 * @class BBCodeParser
 * @name BBCodeParser
 * @since v1.4.0
 */
function BBCodeParser(options)
{
	var base = this;
	base.opts = options;

	/**
	* Takes a BBCode string and splits it into open,
	* content and close tags.
	*
	* It does no checking to verify a tag has a matching open
	* or closing tag or if the tag is valid child of any tag
	* before it. For that the tokens should be passed to the
	* parse function.
	*
	* @param {string} str
	* @return {array}
	* @memberOf BBCodeParser.prototype
	*/
	base.tokenize = function (str)
	{
		var	matches, i;
		var tokens = [];
		// The token types in reverse order of precedence
		// (they're looped in reverse)
		var tokenTypes = [
			{
				type: TOKEN_CONTENT,
				regex: /^([^\[\r\n]+|\[)/
			},
			{
				type: TOKEN_NEWLINE,
				regex: /^(\r\n|\r|\n)/
			},
			{
				type: TOKEN_OPEN,
				regex: /^\[[^\[\]]+\]/
			},
			// Close must come before open as they are
			// the same except close has a / at the start.
			{
				type: TOKEN_CLOSE,
				regex: /^\[\/[^\[\]]+\]/
			}
		];

		strloop:
		while (str.length)
		{
			i = tokenTypes.length;
			while (i--)
			{
				// Check if the string matches any of the tokens
				if (!(matches = str.match(tokenTypes[i].regex)) ||
					!matches[0])
					continue;

				// Add the match to the tokens list
				tokens.push(tokenizeTag(tokenTypes[i].type, matches[0]));

				// Remove the match from the string
				str = str.substr(matches[0].length);

				// The token has been added so start again
				continue strloop;
			}

			// If there is anything left in the string which doesn't match
			// any of the tokens then just assume it's content and add it.
			if (str.length)
				tokens.push(tokenizeTag(TOKEN_CONTENT, str));

			str = '';
		}

		return tokens;
	};

	/**
	* Extracts the name an params from a tag
	*
	* @param {string} type
	* @param {string} val
	* @return {Object}
	* @private
	*/
	function tokenizeTag(type, val)
	{
		var matches, attrs, name,
			openRegex  = /\[([^\]\s=]+)(?:([^\]]+))?\]/,
			closeRegex = /\[\/([^\[\]]+)\]/;

		// Extract the name and attributes from opening tags and
		// just the name from closing tags.
		if (type === TOKEN_OPEN && (matches = val.match(openRegex)))
		{
			name = lower(matches[1]);

			if (matches[2] && (matches[2] = matches[2].trim()))
				attrs = tokenizeAttrs(matches[2]);
		}

		if (type === TOKEN_CLOSE &&
			(matches = val.match(closeRegex)))
			name = lower(matches[1]);

		if (type === TOKEN_NEWLINE)
			name = '#newline';

		// Treat all tokens without a name and
		// all unknown BBCodes as content
		if (!name || ((type === TOKEN_OPEN || type === TOKEN_CLOSE) &&
			!bbcodeHandlers[name]))
		{
			type = TOKEN_CONTENT;
			name = '#';
		}

		return new TokenizeToken(type, name, val, attrs);
	}

	/**
	* Extracts the individual attributes from a string containing
	* all the attributes.
	*
	* @param {string} attrs
	* @return {Object} Assoc array of attributes
	* @private
	*/
	function tokenizeAttrs(attrs)
	{
		var	matches,
			/*
			([^\s=]+)				Anything that's not a space or equals
			=						Equals sign =
			(?:
				(?:
					(["'])					The opening quote
					(
						(?:\\\2|[^\2])*?	Anything that isn't the
											unescaped opening quote
					)
					\2						The opening quote again which
											will close the string
				)
					|				If not a quoted string then match
				(
					(?:.(?!\s\S+=))*.?		Anything that isn't part of
											[space][non-space][=] which
											would be a new attribute
				)
			)
			*/
			attrRegex = /([^\s=]+)=(?:(?:(["'])((?:\\\2|[^\2])*?)\2)|((?:.(?!\s\S+=))*.))/g,
			ret       = {};

		// if only one attribute then remove the = from the start and
		// strip any quotes
		if (attrs.charAt(0) === '=' && attrs.indexOf('=', 1) < 0)
			ret.defaultattr = escapeEntities(stripQuotes(attrs.substr(1)));
		else
		{
			if (attrs.charAt(0) === '=')
				attrs = 'defaultattr' + attrs;

			while ((matches = attrRegex.exec(attrs)))
				ret[lower(matches[1])] =
					escapeEntities(matches[3] || matches[4], false);
		}

		return ret;
	}

	/**
	* Parses a string into an array of BBCodes
	*
	* @param  {string}  str
	* @param  {boolean} preserveNewLines If to preserve all new lines, not
	*                                    strip any based on the passed
	*                                    formatting options
	* @return {array}                    Array of BBCode objects
	* @memberOf BBCodeParser.prototype
	*/
	base.parse = function (str, preserveNewLines)
	{
		var ret  = parseTokens(base.tokenize(str));
		var opts = base.opts;

		if (opts.fixInvalidNesting)
			fixNesting(ret);

		normaliseNewLines(ret, null, preserveNewLines);

		if (opts.removeEmptyTags)
			removeEmpty(ret);

		return ret;
	};

	/**
	* Checks if an array of TokenizeToken's contains the
	* specified token.
	*
	* Checks the tokens name and type match another tokens
	* name and type in the array.
	*
	* @param  {string}    name
	* @param  {string} type
	* @param  {array}     arr
	* @return {Boolean}
	* @private
	*/
	function hasTag(name, type, arr)
	{
		var i = arr.length;

		while (i--)
			if (arr[i].type === type && arr[i].name === name)
				return true;

		return false;
	}

	/**
	* Checks if the child tag is allowed as one
	* of the parent tags children.
	*
	* @param  {TokenizeToken}  parent
	* @param  {TokenizeToken}  child
	* @return {Boolean}
	* @private
	*/
	function isChildAllowed(parent, child)
	{
		var
			parentBBCode    = parent ? bbcodeHandlers[parent.name] : {},
			allowedChildren = parentBBCode.allowedChildren;

		if (base.opts.fixInvalidChildren && allowedChildren)
			return allowedChildren.indexOf(child.name || '#') > -1;

		return true;
	}

	// TODO: Tidy this parseTokens() function up a bit.
	/**
	* Parses an array of tokens created by tokenize()
	*
	* @param  {array} toks
	* @return {array} Parsed tokens
	* @see tokenize()
	* @private
	*/
	function parseTokens(toks)
	{
		var
			token, bbcode, curTok, clone, i, next,
			cloned     = [],
			output     = [],
			openTags   = [],
			/**
			* Returns the currently open tag or undefined
			* @return {TokenizeToken}
			*/
			currentTag = () => last(openTags),
			/**
			* Adds a tag to either the current tags children
			* or to the output array.
			* @param {TokenizeToken} token
			* @private
			*/
			addTag = function (token)
			{
				if (currentTag())
					currentTag().children.push(token);
				else
					output.push(token);
			},
			/**
			* Checks if this tag closes the current tag
			* @param  {string} name
			* @return {Void}
			*/
			closesCurrentTag = name => currentTag() &&
					(bbcode = bbcodeHandlers[currentTag().name]) &&
					bbcode.closedBy &&
					bbcode.closedBy.indexOf(name) > -1;

		while ((token = toks.shift()))
		{
			next = toks[0];

			/*
			* Fixes any invalid children.
			*
			* If it is an element which isn't allowed as a child of it's
			* parent then it will be converted to content of the parent
			* element. i.e.
			*     [code]Code [b]only[/b] allows text.[/code]
			* Will become:
			*     <code>Code [b]only[/b] allows text.</code>
			* Instead of:
			*     <code>Code <b>only</b> allows text.</code>
			*/
			// Ignore tags that can't be children
			if (!isChildAllowed(currentTag(), token))
				// exclude closing tags of current tag
				if (token.type !== TOKEN_CLOSE || !currentTag() ||
						token.name !== currentTag().name)
				{
					token.name = '#';
					token.type = TOKEN_CONTENT;
				}

			switch (token.type)
			{
				case TOKEN_OPEN:
					// Check it this closes a parent,
					// e.g. for lists [*]one [*]two
					if (closesCurrentTag(token.name))
						openTags.pop();

					addTag(token);
					bbcode = bbcodeHandlers[token.name];

					// If this tag is not self closing and it has a closing
					// tag then it is open and has children so add it to the
					// list of open tags. If has the closedBy property then
					// it is closed by other tags so include everything as
					// it's children until one of those tags is reached.
					if (bbcode && !bbcode.isSelfClosing &&
						(bbcode.closedBy ||
							hasTag(token.name, TOKEN_CLOSE, toks)))
						openTags.push(token);
					else if (!bbcode || !bbcode.isSelfClosing)
						token.type = TOKEN_CONTENT;

					break;

				case TOKEN_CLOSE:
					// check if this closes the current tag,
					// e.g. [/list] would close an open [*]
					if (currentTag() && token.name !== currentTag().name &&
						closesCurrentTag('/' + token.name))

						openTags.pop();

					// If this is closing the currently open tag just pop
					// the close tag off the open tags array
					if (currentTag() && token.name === currentTag().name)
					{
						currentTag().closing = token;
						openTags.pop();

					// If this is closing an open tag that is the parent of
					// the current tag then clone all the tags including the
					// current one until reaching the parent that is being
					// closed. Close the parent and then add the clones back
					// in.
					}
					else if (hasTag(token.name, TOKEN_OPEN, openTags))
					{
						// Remove the tag from the open tags
						while ((curTok = openTags.pop()))
						{
							// If it's the tag that is being closed then
							// discard it and break the loop.
							if (curTok.name === token.name)
							{
								curTok.closing = token;
								break;
							}

							// Otherwise clone this tag and then add any
							// previously cloned tags as it's children
							clone = curTok.clone();

							if (cloned.length)
								clone.children.push(last(cloned));

							cloned.push(clone);
						}

						// Place block linebreak before cloned tags
						if (next && next.type === TOKEN_NEWLINE)
						{
							bbcode = bbcodeHandlers[token.name];
							if (bbcode && bbcode.isInline === false)
							{
								addTag(next);
								toks.shift();
							}
						}

						// Add the last cloned child to the now current tag
						// (the parent of the tag which was being closed)
						addTag(last(cloned));

						// Add all the cloned tags to the open tags list
						i = cloned.length;
						while (i--)
							openTags.push(cloned[i]);

						cloned.length = 0;

					// This tag is closing nothing so treat it as content
					}
					else
					{
						token.type = TOKEN_CONTENT;
						addTag(token);
					}
					break;

				case TOKEN_NEWLINE:
					// handle things like
					//     [*]list\nitem\n[*]list1
					// where it should come out as
					//     [*]list\nitem[/*]\n[*]list1[/*]
					// instead of
					//     [*]list\nitem\n[/*][*]list1[/*]
					if (currentTag() && next && closesCurrentTag(
						(next.type === TOKEN_CLOSE ? '/' : '') +
						next.name
					))
						// skip if the next tag is the closing tag for
						// the option tag, i.e. [/*]
						if (!(next.type === TOKEN_CLOSE &&
							next.name === currentTag().name))
						{
							bbcode = bbcodeHandlers[currentTag().name];

							if (bbcode && bbcode.breakAfter)
								openTags.pop();
							else if (bbcode &&
								bbcode.isInline === false &&
								base.opts.breakAfterBlock &&
								bbcode.breakAfter !== false)
								openTags.pop();
						}

					addTag(token);
					break;

				default: // content
					addTag(token);
					break;
			}
		}

		return output;
	}

	/**
	* Normalise all new lines
	*
	* Removes any formatting new lines from the BBCode
	* leaving only content ones. I.e. for a list:
	*
	* [list]
	* [*] list item one
	* with a line break
	* [*] list item two
	* [/list]
	*
	* would become
	*
	* [list] [*] list item one
	* with a line break [*] list item two [/list]
	*
	* Which makes it easier to convert to HTML or add
	* the formatting new lines back in when converting
	* back to BBCode
	*
	* @param  {array} children
	* @param  {TokenizeToken} parent
	* @param  {boolean} onlyRemoveBreakAfter
	* @return {void}
	*/
	function normaliseNewLines(children, parent, onlyRemoveBreakAfter)
	{
		var	token, left, right, parentBBCode, bbcode,
			removedBreakEnd, removedBreakBefore, remove;
		var childrenLength = children.length;
		// TODO: this function really needs tidying up
		if (parent)
			parentBBCode = bbcodeHandlers[parent.name];

		var i = childrenLength;
		while (i--)
		{
			if (!(token = children[i]))
				continue;

			if (token.type === TOKEN_NEWLINE)
			{
				left   = i > 0 ? children[i - 1] : null;
				right  = i < childrenLength - 1 ? children[i + 1] : null;
				remove = false;

				// Handle the start and end new lines
				// e.g. [tag]\n and \n[/tag]
				if (!onlyRemoveBreakAfter && parentBBCode &&
					parentBBCode.isSelfClosing !== true)
					// First child of parent so must be opening line break
					// (breakStartBlock, breakStart) e.g. [tag]\n
					if (!left)
					{
						if (parentBBCode.isInline === false &&
							base.opts.breakStartBlock &&
							parentBBCode.breakStart !== false)
							remove = true;

						if (parentBBCode.breakStart)
							remove = true;
					}
					// Last child of parent so must be end line break
					// (breakEndBlock, breakEnd)
					// e.g. \n[/tag]
					// remove last line break (breakEndBlock, breakEnd)
					else if (!removedBreakEnd && !right)
					{
						if (parentBBCode.isInline === false &&
							base.opts.breakEndBlock &&
							parentBBCode.breakEnd !== false)
							remove = true;

						if (parentBBCode.breakEnd)
							remove = true;

						removedBreakEnd = remove;
					}

				if (left && left.type === TOKEN_OPEN)
					if ((bbcode = bbcodeHandlers[left.name]))
						if (!onlyRemoveBreakAfter)
						{
							if (bbcode.isInline === false &&
								base.opts.breakAfterBlock &&
								bbcode.breakAfter !== false)
								remove = true;

							if (bbcode.breakAfter)
								remove = true;

						}
						else if (bbcode.isInline === false)
							remove = true;



				if (!onlyRemoveBreakAfter && !removedBreakBefore &&
					right && right.type === TOKEN_OPEN)

					if ((bbcode = bbcodeHandlers[right.name]))
					{
						if (bbcode.isInline === false &&
							base.opts.breakBeforeBlock &&
							bbcode.breakBefore !== false)
							remove = true;

						if (bbcode.breakBefore)
							remove = true;

						removedBreakBefore = remove;

						if (remove)
						{
							children.splice(i, 1);
							continue;
						}
					}

				if (remove)
					children.splice(i, 1);

				// reset double removedBreakBefore removal protection.
				// This is needed for cases like \n\n[\tag] where
				// only 1 \n should be removed but without this they both
				// would be.
				removedBreakBefore = false;
			}
			else if (token.type === TOKEN_OPEN)
				normaliseNewLines(
					token.children,
					token,
					onlyRemoveBreakAfter
				);
		}
	}

	/**
	* Fixes any invalid nesting.
	*
	* If it is a block level element inside 1 or more inline elements
	* then those inline elements will be split at the point where the
	* block level is and the block level element placed between the split
	* parts. i.e.
	*     [inline]A[blocklevel]B[/blocklevel]C[/inline]
	* Will become:
	*     [inline]A[/inline][blocklevel]B[/blocklevel][inline]C[/inline]
	*
	* @param {array} children
	* @param {array} [parents] Null if there is no parents
	* @param {boolea} [insideInline] If inside an inline element
	* @param {array} [rootArr] Root array if there is one
	* @return {array}
	* @private
	*/
	function fixNesting(children, parents, insideInline, rootArr)
	{
		var	token, i, parent, parentIndex, parentParentChildren, right;

		var isInline = function (token)
		{
			var bbcode = bbcodeHandlers[token.name];

			return !bbcode || bbcode.isInline !== false;
		};

		parents = parents || [];
		rootArr = rootArr || children;

		// This must check the length each time as it can change when
		// tokens are moved to fix the nesting.
		for (i = 0; i < children.length; i++)
		{
			if (!(token = children[i]) || token.type !== TOKEN_OPEN)
				continue;

			if (insideInline && !isInline(token))
			{
				// if this is a blocklevel element inside an inline one then
				// split the parent at the block level element
				parent = last(parents);
				right  = parent.splitAt(token);

				parentParentChildren = parents.length > 1 ?
					parents[parents.length - 2].children : rootArr;

				// If parent inline is allowed inside this tag, clone it and
				// wrap this tags children in it.
				if (isChildAllowed(token, parent))
				{
					var clone = parent.clone();
					clone.children = token.children;
					token.children = [clone];
				}

				parentIndex = parentParentChildren.indexOf(parent);
				if (parentIndex > -1)
				{
					// remove the block level token from the right side of
					// the split inline element
					right.children.splice(0, 1);

					// insert the block level token and the right side after
					// the left side of the inline token
					parentParentChildren.splice(
						parentIndex + 1, 0, token, right
					);

					// If token is a block and is followed by a newline,
					// then move the newline along with it to the new parent
					var next = right.children[0];
					if (next && next.type === TOKEN_NEWLINE)
						if (!isInline(token))
						{
							right.children.splice(0, 1);
							parentParentChildren.splice(
								parentIndex + 2, 0, next
							);
						}

					// return to parents loop as the
					// children have now increased
					return;
				}
			}

			parents.push(token);

			fixNesting(
				token.children,
				parents,
				insideInline || isInline(token),
				rootArr
			);

			parents.pop();
		}
	}

	/**
	* Removes any empty BBCodes which are not allowed to be empty.
	*
	* @param {array} tokens
	* @private
	*/
	function removeEmpty(tokens)
	{
		var	token, bbcode;

		/**
		* Checks if all children are whitespace or not
		* @private
		*/
		var isTokenWhiteSpace = function (children)
		{
			var j = children.length;

			while (j--)
			{
				var type = children[j].type;

				if (type === TOKEN_OPEN || type === TOKEN_CLOSE)
					return false;

				if (type === TOKEN_CONTENT &&
					/\S|\u00A0/.test(children[j].val))
					return false;
			}

			return true;
		};

		var i = tokens.length;
		while (i--)
		{
			// So skip anything that isn't a tag since only tags can be
			// empty, content can't
			if (!(token = tokens[i]) || token.type !== TOKEN_OPEN)
				continue;

			bbcode = bbcodeHandlers[token.name];

			// Remove any empty children of this tag first so that if they
			// are all removed this one doesn't think it's not empty.
			removeEmpty(token.children);

			if (isTokenWhiteSpace(token.children) && bbcode &&
				!bbcode.isSelfClosing && !bbcode.allowsEmpty)
				tokens.splice.apply(tokens, [i, 1].concat(token.children));
		}
	}

	/**
	* Converts a BBCode string to HTML
	*
	* @param {string} str
	* @param {boolean}   preserveNewLines If to preserve all new lines, not
	*                                  strip any based on the passed
	*                                  formatting options
	* @return {string}
	* @memberOf BBCodeParser.prototype
	*/
	base.toHTML = function (str, preserveNewLines)
	{
		return convertToHTML(base.parse(str, preserveNewLines), true);
	};

	/**
	* @private
	*/
	function convertToHTML(tokens, isRoot)
	{
		var
			undef, token, bbcode, content, html, needsBlockWrap,
			blockWrapOpen, isInline, lastChild,
			ret = [];

		isInline = function (bbcode)
		{
			return (!bbcode || (bbcode.isHtmlInline !== undef ?
				bbcode.isHtmlInline : bbcode.isInline)) !== false;
		};

		while (tokens.length > 0)
		{
			if (!(token = tokens.shift()))
				continue;

			if (token.type === TOKEN_OPEN)
			{
				lastChild = token.children[token.children.length - 1] || {};
				bbcode = bbcodeHandlers[token.name];
				needsBlockWrap = isRoot && isInline(bbcode);
				content = convertToHTML(token.children, false);

				if (bbcode && bbcode.html)
				{
					// Only add a line break to the end if this is
					// blocklevel and the last child wasn't block-level
					if (!isInline(bbcode) &&
						isInline(bbcodeHandlers[lastChild.name]) &&
						!bbcode.isPreFormatted &&
						!bbcode.skipLastLineBreak)
						// Add placeholder br to end of block level elements
						content += '<br />';

					if (!isFunction(bbcode.html))
					{
						token.attrs['0'] = content;
						html = replaceVars(
							bbcode.html,
							token.attrs
						);
					}
					else
						html = bbcode.html.call(
							base,
							token,
							token.attrs,
							content
						);
				}
				else
					html = token.val + content +
						(token.closing ? token.closing.val : '');
			}
			else if (token.type === TOKEN_NEWLINE)
			{
				if (!isRoot)
				{
					ret.push('<br />');
					continue;
				}

				// If not already in a block wrap then start a new block
				if (!blockWrapOpen)
					ret.push('<div>');

				// Putting BR in a div in IE causes it
				// to do a double line break.
				if (!IE_BR_FIX)
					ret.push('<br />');

				// Normally the div acts as a line-break with by moving
				// whatever comes after onto a new line.
				// If this is the last token, add an extra line-break so it
				// shows as there will be nothing after it.
				if (!tokens.length)
					ret.push('<br />');

				ret.push('</div>\n');
				blockWrapOpen = false;
				continue;
			}
			// content
			else
			{
				needsBlockWrap = isRoot;
				html           = escapeEntities(token.val, true);
			}

			if (needsBlockWrap && !blockWrapOpen)
			{
				ret.push('<div>');
				blockWrapOpen = true;
			}
			else if (!needsBlockWrap && blockWrapOpen)
			{
				ret.push('</div>\n');
				blockWrapOpen = false;
			}

			ret.push(html);
		}

		if (blockWrapOpen)
			ret.push('</div>\n');

		return ret.join('');
	}

	/**
	* Takes a BBCode string, parses it then converts it back to BBCode.
	*
	* This will auto fix the BBCode and format it with the specified
	* options.
	*
	* @param {string} str
	* @param {boolean} preserveNewLines If to preserve all new lines, not
	*                                strip any based on the passed
	*                                formatting options
	* @return {string}
	* @memberOf BBCodeParser.prototype
	*/
	base.toBBCode = function (str, preserveNewLines)
	{
		return convertToBBCode(base.parse(str, preserveNewLines));
	};

	/**
	* Converts parsed tokens back into BBCode with the
	* formatting specified in the options and with any
	* fixes specified.
	*
	* @param  {array} toks Array of parsed tokens from base.parse()
	* @return {string}
	* @private
	*/
	function convertToBBCode(toks)
	{
		var	token, attr, bbcode, isBlock, isSelfClosing, quoteType,
			breakBefore, breakStart, breakEnd, breakAfter,
			// Create an array of strings which are joined together
			// before being returned as this is faster in slow browsers.
			// (Old versions of IE).
			ret = [];

		while (toks.length > 0)
		{
			if (!(token = toks.shift()))
				continue;

			// TODO: tidy this
			bbcode        = bbcodeHandlers[token.name];
			isBlock       = !(!bbcode || bbcode.isInline !== false);
			isSelfClosing = bbcode && bbcode.isSelfClosing;

			breakBefore = (isBlock && base.opts.breakBeforeBlock &&
					bbcode.breakBefore !== false) ||
				(bbcode && bbcode.breakBefore);

			breakStart = (isBlock && !isSelfClosing &&
					base.opts.breakStartBlock &&
					bbcode.breakStart !== false) ||
				(bbcode && bbcode.breakStart);

			breakEnd = (isBlock && base.opts.breakEndBlock &&
					bbcode.breakEnd !== false) ||
				(bbcode && bbcode.breakEnd);

			breakAfter = (isBlock && base.opts.breakAfterBlock &&
					bbcode.breakAfter !== false) ||
				(bbcode && bbcode.breakAfter);

			quoteType = (bbcode ? bbcode.quoteType : null) ||
				base.opts.quoteType || QuoteType.auto;

			if (!bbcode && token.type === TOKEN_OPEN)
			{
				ret.push(token.val);

				if (token.children)
					ret.push(convertToBBCode(token.children));

				if (token.closing)
					ret.push(token.closing.val);

			}
			else if (token.type === TOKEN_OPEN)
			{
				if (breakBefore)
					ret.push('\n');

				// Convert the tag and it's attributes to BBCode
				ret.push('[' + token.name);
				if (token.attrs)
				{
					if (token.attrs.defaultattr)
					{
						ret.push('=', quote(
							token.attrs.defaultattr,
							quoteType,
							'defaultattr'
						));

						delete token.attrs.defaultattr;
					}

					for (attr in token.attrs)
						if (token.attrs.hasOwnProperty(attr))
							ret.push(' ', attr, '=',
								quote(token.attrs[attr], quoteType, attr));

				}
				ret.push(']');

				if (breakStart)
					ret.push('\n');

				// Convert the tags children to BBCode
				if (token.children)
					ret.push(convertToBBCode(token.children));

				// add closing tag if not self closing
				if (!isSelfClosing && !bbcode.excludeClosing)
				{
					if (breakEnd)
						ret.push('\n');

					ret.push('[/' + token.name + ']');
				}

				if (breakAfter)
					ret.push('\n');

				// preserve whatever was recognized as the
				// closing tag if it is a self closing tag
				if (token.closing && isSelfClosing)
					ret.push(token.closing.val);

			}
			else
				ret.push(token.val);

		}

		return ret.join('');
	}

	/**
	* Quotes an attribute
	*
	* @param {string} str
	* @param {QuoteType} quoteType
	* @param {string} name
	* @return {string}
	* @private
	*/
	function quote(str, quoteType, name)
	{
		var	needsQuotes = /\s|=/.test(str);

		if (isFunction(quoteType))
			return quoteType(str, name);

		if (quoteType === QuoteType.never ||
			(quoteType === QuoteType.auto && !needsQuotes))
			return str;

		return '"' + str.replace('\\', '\\\\').replace('"', '\\"') + '"';
	}

	/**
	* Returns the last element of an array or null
	*
	* @param {array} arr
	* @return {Object} Last element
	* @private
	*/
	function last(arr)
	{
		if (arr.length)
			return arr[arr.length - 1];

		return null;
	}

	/**
	* Converts a string to lowercase.
	*
	* @param {string} str
	* @return {string} Lowercase version of str
	* @private
	*/
	function lower(str)
	{
		return str.toLowerCase();
	}
};

/**
 * SCEditor BBCode format
 * @since 2.0.0
 */
function bbcodeFormat(options)
{
	var base = this;
	base.opts = extend(bbcodeDefaults, options);

	/**
	* cache of all the tags pointing to their bbcodes to enable
	* faster lookup of which bbcode a tag should have
	* @private
	*/
	var tagsToBBCodes = {};

	/**
	* Same as tagsToBBCodes but instead of HTML tags it's styles
	* @private
	*/
	var stylesToBBCodes = {};

	/**
	* Allowed children of specific HTML tags. Empty array if no
	* children other than text nodes are allowed
	* @private
	*/
	var validChildren = {
		ul: ['li', 'ol', 'ul'],
		ol: ['li', 'ol', 'ul'],
		table: ['tr'],
		tr: ['td', 'th'],
		code: ['br', 'p', 'div']
	};

	/**
	* Populates tagsToBBCodes and stylesToBBCodes to enable faster lookups
	*
	* @private
	*/
	function buildBbcodeCache()
	{
		each(bbcodeHandlers, function (bbcode)
		{
			var	isBlock,
				tags   = bbcodeHandlers[bbcode].tags,
				styles = bbcodeHandlers[bbcode].styles;

			if (tags)
				each(tags, function (tag, values)
				{
					isBlock = bbcodeHandlers[bbcode].isInline === false;

					tagsToBBCodes[tag] = tagsToBBCodes[tag] || {};

					tagsToBBCodes[tag][isBlock] =
						tagsToBBCodes[tag][isBlock] || {};

					tagsToBBCodes[tag][isBlock][bbcode] = values;
				});

			if (styles)
				each(styles, function (style, values)
				{
					isBlock = bbcodeHandlers[bbcode].isInline === false;

					stylesToBBCodes[isBlock] =
						stylesToBBCodes[isBlock] || {};

					stylesToBBCodes[isBlock][style] =
						stylesToBBCodes[isBlock][style] || {};

					stylesToBBCodes[isBlock][style][bbcode] = values;
				});

		});
	};

	/**
	* Checks if any bbcode styles match the elements styles
	*
	* @param {!HTMLElement} element
	* @param {string} content
	* @param {boolean} [blockLevel=false]
	* @return {string} Content with any matching
	*                bbcode tags wrapped around it.
	* @private
	*/
	function handleStyles(element, content, blockLevel)
	{
		var	styleValue, format;

		// convert blockLevel to boolean
		blockLevel = !!blockLevel;

		if (!stylesToBBCodes[blockLevel])
			return content;

		each(stylesToBBCodes[blockLevel], function (property, bbcodes)
		{
			styleValue = getStyle(element, property);

			// if the parent has the same style use that instead of this one
			// so you don't end up with [i]parent[i]child[/i][/i]
			if (!styleValue ||
				getStyle(element.parentNode, property) === styleValue)
				return;

			each(bbcodes, function (bbcode, values)
			{
				if (!values || values.indexOf(styleValue.toString()) > -1)
				{
					format = bbcodeHandlers[bbcode].format;

					if (isFunction(format))
						content = format.call(base, element, content);
					else
						content = formatString(format, content);

				}
			});
		});

		return content;
	}

	/**
	* Handles adding newlines after block level elements
	*
	* @param {HTMLElement} element The element to convert
	* @param {string} content  The tags text content
	* @return {string}
	* @private
	*/
	function handleBlockNewlines(element, content)
	{
		var	tag = element.nodeName.toLowerCase();

		if (!isInline(element, true) || tag === 'br')
		{
			var	isLastBlockChild, parent, parentLastChild,
				previousSibling = element.previousSibling;

			// Skips selection makers and ignored elements
			// Skip empty inline elements
			while (previousSibling &&
					previousSibling.nodeType === 1 &&
					!is(previousSibling, 'br') &&
					isInline(previousSibling, true) &&
					!previousSibling.firstChild)
				previousSibling = previousSibling.previousSibling;

			// If it's the last block of an inline that is the last
			// child of a block then it shouldn't cause a line break
			// except in IE < 11
			// <block><inline><br></inline></block>
			do
			{
				parent          = element.parentNode;
				parentLastChild = parent && parent.lastChild;

				isLastBlockChild = parentLastChild === element;
				element = parent;
			} while (parent && isLastBlockChild && isInline(parent, true));

			// If this block is:
			//	* Not the last child of a block level element
			//	* Is a <li> tag (lists are blocks)
			//	* Is IE < 11 and the tag is BR. IE < 11 never collapses BR
			//	tags.
			if (!isLastBlockChild || tag === 'li' ||
				(tag === 'br' && IE_BR_FIX))
				content += '\n';

			// Check for:
			// <block>text<block>text</block></block>
			//
			// The second opening <block> opening tag should cause a
			// line break because the previous sibing is inline.
			if (tag !== 'br' && previousSibling &&
				!is(previousSibling, 'br') &&
				isInline(previousSibling, true))
				content = '\n' + content;

		}

		return content;
	}

	/**
	* Handles a HTML tag and finds any matching bbcodes
	*
	* @param {HTMLElement} element The element to convert
	* @param {string} content  The Tags text content
	* @param {boolean} [blockLevel=false] If to convert block level tags
	* @return {string} Content with any matching bbcode tags
	*                  wrapped around it.
	* @private
	*/
	function handleTags(element, content, blockLevel)
	{
		blockLevel = !!blockLevel;
		var
			convertBBCode, format,
			tag     = element.nodeName.toLowerCase(),
			thisTag = tagsToBBCodes[tag];

		if (thisTag && thisTag[blockLevel])
			// loop all bbcodes for this tag
			each(thisTag[blockLevel], function (bbcode, bbcodeAttribs)
			{
				// if the bbcode requires any attributes then check this has
				// all needed
				if (bbcodeAttribs)
				{
					convertBBCode = false;

					// loop all the bbcode attribs
					each(bbcodeAttribs, function (attrib, values)
					{
						// Skip if the element doesn't have the attibue or
						// the attribute doesn't match one of the require
						// values
						if (!attr(element, attrib) || (values &&
							values.indexOf(attr(element, attrib)) < 0))
							return;

						if (attr(element, attrib) && values === false)
						{
							convertBBCode = false;

							// break this loop as we have matched this bbcode
							return;
						}

						convertBBCode = true;
						return;
					});

					if (!convertBBCode)
						return;
				}

				format = bbcodeHandlers[bbcode].format;

				if (isFunction(format))
					content = format.call(base, element, content);
				else
					content = formatString(format, content);
			});

		return content;
	}

	/**
	* Converts a HTML dom element to BBCode starting from
	* the innermost element and working backwards
	*
	* @private
	* @param {HTMLElement}	element
	* @return {string} BBCode
	* @memberOf SCEditor.plugins.bbcode.prototype
	*/
	function elementToBbcode(element)
	{
		var toBBCode = function (node, vChildren)
		{
			var ret = '';

			traverse(node, function (node)
			{
				var
					curTag       = '',
					nodeType     = node.nodeType,
					tag          = node.nodeName.toLowerCase(),
					vChild       = validChildren[tag],
					firstChild   = node.firstChild,
					isValidChild = true;

				if (typeof vChildren === 'object')
				{
					isValidChild = vChildren.indexOf(tag) > -1;

					// Emoticons should always be converted
					if (is(node, 'img') && attr(node, EMOTICON_DATA_ATTR))
						isValidChild = true;

					// if this tag is one of the parents allowed children
					// then set this tags allowed children to whatever it
					// allows, otherwise set to what the parent allows
					if (!isValidChild)
						vChild = vChildren;
				}

				// 3 = text and 1 = element
				if (nodeType !== 3 && nodeType !== 1)
					return;

				if (nodeType === 1)
				{
					// skip empty nlf elements (new lines automatically
					// added after block level elements like quotes)
					if (is(node, '.sceditor-nlf'))
						if (!firstChild || (!IE_BR_FIX &&
							node.childNodes.length === 1 &&
							/br/i.test(firstChild.nodeName)))
							return;

					// don't convert iframe contents
					if (tag !== 'iframe')
						curTag = toBBCode(node, vChild);

					// TODO: isValidChild is no longer needed. Should use
					// valid children bbcodes instead by creating BBCode
					// tokens like the parser.
					if (isValidChild)
					{
						// code tags should skip most styles
						if (tag !== 'code')
						{
							// handle inline bbcodes
							curTag = handleStyles(node, curTag);
							curTag = handleTags(node, curTag);

							// handle blocklevel bbcodes
							curTag = handleStyles(node, curTag, true);
						}

						curTag = handleTags(node, curTag, true);
						ret += handleBlockNewlines(node, curTag);
					}
					else
						ret += curTag;
				}
				else
					ret += node.nodeValue;
			}, false, true);

			return ret;
		};

		return toBBCode(element);
	};

	base.buildBbcodeCache = buildBbcodeCache;

	/**
	* Initializer
	* @private
	*/
	base.init = function ()
	{
		base.elementToBbcode = elementToBbcode;

		// build the BBCode cache
		buildBbcodeCache();

		this.commands = extend(true, {}, bbcodeCommands, this.commands);

		// Add BBCode helper methods
		this.toBBCode   = base.toSource;
		this.fromBBCode = base.toHtml;
	};

	/**
	* Converts BBCode into HTML
	*
	* @param {boolean} asFragment
	* @param {string} source
	* @param {boolean} [legacyAsFragment] Used by fromBBCode() method
	*/
	function toHtml(asFragment, source, legacyAsFragment)
	{
		var	parser = new BBCodeParser(base.opts);
		var html = parser.toHTML(
			base.opts.bbcodeTrim ? source.trim() : source
		);

		return (asFragment || legacyAsFragment) ?
			removeFirstLastDiv(html) : html;
	}

	/**
	* Converts HTML into BBCode
	*
	* @param {boolean} asFragment
	* @param {string}	html
	* @param {!Document} [context]
	* @param {!HTMLElement} [parent]
	* @return {string}
	* @private
	*/
	function toSource(asFragment, html, context, parent)
	{
		context = context || document;

		var	bbcode, elements;
		var containerParent = context.createElement('div');
		var container = context.createElement('div');
		var parser = new BBCodeParser(base.opts);

		container.innerHTML = html;
		css(containerParent, 'visibility', 'hidden');
		containerParent.appendChild(container);
		context.body.appendChild(containerParent);

		if (asFragment)
		{
			// Add text before and after so removeWhiteSpace doesn't remove
			// leading and trailing whitespace
			containerParent.insertBefore(
				context.createTextNode('#'),
				containerParent.firstChild
			);
			containerParent.appendChild(context.createTextNode('#'));
		}

		// Match parents white-space handling
		if (parent)
			css(container, 'whiteSpace', css(parent, 'whiteSpace'));

		// Remove all nodes with sceditor-ignore class
		elements = container.getElementsByClassName('sceditor-ignore');
		while (elements.length)
			elements[0].parentNode.removeChild(elements[0]);

		removeWhiteSpace(containerParent);

		bbcode = elementToBbcode(container);

		context.body.removeChild(containerParent);

		bbcode = parser.toBBCode(bbcode, true);

		if (base.opts.bbcodeTrim)
			bbcode = bbcode.trim();

		return bbcode;
	};

	base.toHtml = toHtml.bind(null, false);
	base.fragmentToHtml = toHtml.bind(null, true);
	base.toSource = toSource.bind(null, false);
	base.fragmentToSource = toSource.bind(null, true);

	/**
	 * Gets a BBCode
	 *
	 * @param {string} name
	 * @return {Object|null}
	 * @since 2.0.0
	 */
	base.get = function (name)
	{
		return bbcodeHandlers[name] || null;
	};

	/**
	 * Adds a BBCode to the parser or updates an existing
	 * BBCode if a BBCode with the specified name already exists.
	 *
	 * @param {string} name
	 * @param {Object} bbcode
	 * @return {this}
	 * @since 2.0.0
	 */
	base.set = function (name, bbcode)
	{
		if (name && bbcode)
		{
			// merge any existing command properties
			bbcode = extend(bbcodeHandlers[name] || {}, bbcode);

			bbcodeHandlers[name] = bbcode;
		}

		return this;
	};

	/**
	 * Renames a BBCode
	 *
	 * This does not change the format or HTML handling, those must be
	 * changed manually.
	 *
	 * @param  {string} name    [description]
	 * @param  {string} newName [description]
	 * @return {this|false}
	 * @since 2.0.0
	 */
	base.rename = function (name, newName)
	{
		if (name in bbcodeHandlers)
		{
			bbcodeHandlers[newName] = bbcodeHandlers[name];

			delete bbcodeHandlers[name];
		}

		return this;
	};

	/**
	 * Removes a BBCode
	 *
	 * @param {string} name
	 * @return {this}
	 * @since 2.0.0
	 */
	base.remove = function (name)
	{
		if (name in bbcodeHandlers)
			delete bbcodeHandlers[name];

		return this;
	};
};

export default bbcodeFormat;
