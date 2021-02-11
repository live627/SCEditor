import QuoteType from './bbcode.quotetype.js';

var defaults = {
	/**
	 * If to add a new line before block level elements
	 *
	 * @type {boolean}
	 */
	breakBeforeBlock: false,

	/**
	 * If to add a new line after the start of block level elements
	 *
	 * @type {boolean}
	 */
	breakStartBlock: false,

	/**
	 * If to add a new line before the end of block level elements
	 *
	 * @type {boolean}
	 */
	breakEndBlock: false,

	/**
	 * If to add a new line after block level elements
	 *
	 * @type {boolean}
	 */
	breakAfterBlock: true,

	/**
	 * If to remove empty tags
	 *
	 * @type {boolean}
	 */
	removeEmptyTags: true,

	/**
	 * If to fix invalid nesting,
	 * i.e. block level elements inside inline elements.
	 *
	 * @type {boolean}
	 */
	fixInvalidNesting: true,

	/**
	 * If to fix invalid children.
	 * i.e. A tag which is inside a parent that doesn't
	 * allow that type of tag.
	 *
	 * @type {boolean}
	 */
	fixInvalidChildren: true,

	/**
	 * Attribute quote type
	 *
	 * @type {QuoteType}
	 * @since 1.4.1
	 */
	quoteType: QuoteType.auto
};

export default defaults;
