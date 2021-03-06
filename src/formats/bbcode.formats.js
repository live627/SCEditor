import { css, attr, is, getStyle as style } from '../lib/dom.js';
import { isDigit, normaliseColour, stripQuotes } from '../lib/utils.js';
import { entities as escapeEntities, uriScheme } from '../lib/escape.js';
import QuoteType from './bbcode.quotetype.js';

var formats = {
	// START_COMMAND: Bold
	b: {
		tags: {
			b: null,
			strong: null
		},
		styles: {
			// 401 is for FF 3.5
			'font-weight': ['bold', 'bolder', '401', '700', '800', '900']
		},
		format: '[b]{0}[/b]',
		html: '<strong>{0}</strong>'
	},
	// END_COMMAND

	// START_COMMAND: Italic
	i: {
		tags: {
			i: null,
			em: null
		},
		styles: {
			'font-style': ['italic', 'oblique']
		},
		format: '[i]{0}[/i]',
		html: '<em>{0}</em>'
	},
	// END_COMMAND

	// START_COMMAND: Underline
	u: {
		tags: {
			u: null
		},
		styles: {
			'text-decoration': ['underline']
		},
		format: '[u]{0}[/u]',
		html: '<u>{0}</u>'
	},
	// END_COMMAND

	// START_COMMAND: Strikethrough
	s: {
		tags: {
			s: null,
			strike: null
		},
		styles: {
			'text-decoration': ['line-through']
		},
		format: '[s]{0}[/s]',
		html: '<s>{0}</s>'
	},
	// END_COMMAND

	// START_COMMAND: Subscript
	sub: {
		tags: {
			sub: null
		},
		format: '[sub]{0}[/sub]',
		html: '<sub>{0}</sub>'
	},
	// END_COMMAND

	// START_COMMAND: Superscript
	sup: {
		tags: {
			sup: null
		},
		format: '[sup]{0}[/sup]',
		html: '<sup>{0}</sup>'
	},
	// END_COMMAND

	// START_COMMAND: Font
	font: {
		tags: {
			font: {
				face: null
			}
		},
		styles: {
			'font-family': null
		},
		quoteType: QuoteType.never,
		format(element, content)
		{
			var font;

			if (!is(element, 'font') || !(font = attr(element, 'face')))
				font = css(element, 'font-family');

			return '[font=' + stripQuotes(font) + ']' +
					content + '[/font]';
		},
		html: '<font face="{defaultattr}">{0}</font>'
	},
	// END_COMMAND

	// START_COMMAND: Size
	size: {
		tags: {
			font: {
				size: null
			}
		},
		styles: {
			'font-size': null
		},
		format(element, content)
		{
			var	fontSize = attr(element, 'size'),
				size     = 2;

			if (!fontSize)
				fontSize = css(element, 'fontSize');

			// Most browsers return px value but IE returns 1-7
			if (fontSize.indexOf('px') > -1)
			{
				// convert size to an int
				fontSize = fontSize.replace('px', '') - 0;

				if (fontSize < 12)
					size = 1;

				if (fontSize > 15)
					size = 3;

				if (fontSize > 17)
					size = 4;

				if (fontSize > 23)
					size = 5;

				if (fontSize > 31)
					size = 6;

				if (fontSize > 47)
					size = 7;

			}
			else
				size = fontSize;

			return '[size=' + size + ']' + content + '[/size]';
		},
		html: '<font size="{defaultattr}">{0}</font>'
	},
	// END_COMMAND

	// START_COMMAND: Color
	color: {
		tags: {
			font: {
				color: null
			}
		},
		styles: {
			color: null
		},
		quoteType: QuoteType.never,
		format(elm, content)
		{
			var	color;

			if (!is(elm, 'font') || !(color = attr(elm, 'color')))
				color = elm.style.color || css(elm, 'color');

			return '[color=' + normaliseColour(color) + ']' +
					content + '[/color]';
		},
		html(token, attrs, content)
		{
			return '<font color="' +
					escapeEntities(normaliseColour(attrs.defaultattr), true) +
					'">' + content + '</font>';
		}
	},
	// END_COMMAND

	// START_COMMAND: Lists
	ul: {
		tags: {
			ul: null
		},
		breakStart: true,
		isInline: false,
		skipLastLineBreak: true,
		format: '[ul]{0}[/ul]',
		html: '<ul>{0}</ul>'
	},
	list: {
		breakStart: true,
		isInline: false,
		skipLastLineBreak: true,
		html: '<ul>{0}</ul>'
	},
	ol: {
		tags: {
			ol: null
		},
		breakStart: true,
		isInline: false,
		skipLastLineBreak: true,
		format: '[ol]{0}[/ol]',
		html: '<ol>{0}</ol>'
	},
	li: {
		tags: {
			li: null
		},
		isInline: false,
		closedBy: ['/ul', '/ol', '/list', '*', 'li'],
		format: '[li]{0}[/li]',
		html: '<li>{0}</li>'
	},
	'*': {
		isInline: false,
		closedBy: ['/ul', '/ol', '/list', '*', 'li'],
		html: '<li>{0}</li>'
	},
	// END_COMMAND

	// START_COMMAND: Table
	table: {
		tags: {
			table: null
		},
		isInline: false,
		isHtmlInline: true,
		skipLastLineBreak: true,
		format: '[table]{0}[/table]',
		html: '<table>{0}</table>'
	},
	tr: {
		tags: {
			tr: null
		},
		isInline: false,
		skipLastLineBreak: true,
		format: '[tr]{0}[/tr]',
		html: '<tr>{0}</tr>'
	},
	th: {
		tags: {
			th: null
		},
		allowsEmpty: true,
		isInline: false,
		format: '[th]{0}[/th]',
		html: '<th>{0}</th>'
	},
	td: {
		tags: {
			td: null
		},
		allowsEmpty: true,
		isInline: false,
		format: '[td]{0}[/td]',
		html: '<td>{0}</td>'
	},
	hr: {
		tags: {
			hr: null
		},
		allowsEmpty: true,
		isSelfClosing: true,
		isInline: false,
		format: '[hr]{0}',
		html: '<hr />'
	},
	img: {
		allowsEmpty: true,
		tags: {
			img: {
				src: null
			}
		},
		allowedChildren: ['#'],
		quoteType: QuoteType.auto,
		format(element)
		{
			var
				attribs = [],
				width = attr(element, 'width') || style('width'),
				height = attr(element, 'height') || style('height'),
				alt = attr(element, 'alt');

			if (width && isDigit(width))
				attribs.push(`width="${width}"`);

			if (height && isDigit(height))
				attribs.push(`height="${height}"`);

			if (alt)
				attribs.push(`alt="${escapeEntities(alt, true)}"`);

			return `[img ${attribs.join(' ')}]${attr(element, 'src')}[/img]`;
		},
		html(token, attrs, content)
		{
			var
				attribs = [`src="${uriScheme(content)}"`],
				width  = attrs.width,
				height = attrs.height,
				alt = attrs.alt;

			if (width && isDigit(width))
				attribs.push(`width="${width}"`);

			if (height && isDigit(height))
				attribs.push(`height="${height}"`);

			if (alt)
				attribs.push(`alt="${escapeEntities(alt, true)}"`);

			return `<img ${attribs.join(' ')} />`;
		}
	},
	// END_COMMAND

	// START_COMMAND: URL
	url: {
		allowsEmpty: true,
		tags: {
			a: {
				href: null
			}
		},
		quoteType: QuoteType.never,
		format(element, content)
		{
			var url = attr(element, 'href');

			// make sure this link is not an e-mail,
			// if it is return e-mail BBCode
			if (url.substr(0, 7) === 'mailto:')
				return '[email="' + url.substr(7) + '"]' +
						content + '[/email]';

			return '[url=' + url + ']' + content + '[/url]';
		},
		html(token, attrs, content)
		{
			attrs.defaultattr =
					escapeEntities(attrs.defaultattr, true) || content;

			return '<a href="' + uriScheme(attrs.defaultattr) + '">' +
					content + '</a>';
		}
	},
	// END_COMMAND

	// START_COMMAND: E-mail
	email: {
		quoteType: QuoteType.never,
		html(token, attrs, content)
		{
			return '<a href="mailto:' +
					(escapeEntities(attrs.defaultattr, true) || content) +
					'">' + content + '</a>';
		}
	},
	// END_COMMAND

	// START_COMMAND: Quote
	quote: {
		tags: {
			blockquote: null
		},
		isInline: false,
		quoteType: QuoteType.never,
		format(element, content)
		{
			var authorAttr = 'data-author';
			var	author = '';
			var cite;
			var children = element.children;

			for (var i = 0; !cite && i < children.length; i++)
				if (is(children[i], 'cite'))
					cite = children[i];


			if (cite || attr(element, authorAttr))
			{
				author = cite && cite.textContent ||
						attr(element, authorAttr);

				attr(element, authorAttr, author);

				if (cite)
					element.removeChild(cite);

				content	= this.elementToBbcode(element);
				author  = '=' + author.replace(/(^\s+|\s+$)/g, '');

				if (cite)
					element.insertBefore(cite, element.firstChild);

			}

			return '[quote' + author + ']' + content + '[/quote]';
		},
		html(token, attrs, content)
		{
			if (attrs.defaultattr)
				content = '<cite>' + attrs.defaultattr +
						'</cite>' + content;

			return '<blockquote>' + content + '</blockquote>';
		}
	},
	code: {
		tags: {
			code: null
		},
		isInline: false,
		allowedChildren: ['#', '#newline'],
		format: '[code]{0}[/code]',
		html: '<code>{0}</code>'
	},
	left: {
		styles: {
			'text-align': [
				'left',
				'-webkit-left',
				'-moz-left',
				'-khtml-left'
			]
		},
		isInline: false,
		allowsEmpty: true,
		format: '[left]{0}[/left]',
		html: '<div align="left">{0}</div>'
	},
	center: {
		styles: {
			'text-align': [
				'center',
				'-webkit-center',
				'-moz-center',
				'-khtml-center'
			]
		},
		isInline: false,
		allowsEmpty: true,
		format: '[center]{0}[/center]',
		html: '<div align="center">{0}</div>'
	},
	right: {
		styles: {
			'text-align': [
				'right',
				'-webkit-right',
				'-moz-right',
				'-khtml-right'
			]
		},
		isInline: false,
		allowsEmpty: true,
		format: '[right]{0}[/right]',
		html: '<div align="right">{0}</div>'
	},
	justify: {
		styles: {
			'text-align': [
				'justify',
				'-webkit-justify',
				'-moz-justify',
				'-khtml-justify'
			]
		},
		isInline: false,
		allowsEmpty: true,
		format: '[justify]{0}[/justify]',
		html: '<div align="justify">{0}</div>'
	}
};

export default formats;
