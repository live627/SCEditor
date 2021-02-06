import * as dom from './dom.js';
import { ie as IE_VER } from './browser.js';
import _tmpl from './templates.js';

// In IE < 11 a BR at the end of a block level element
// causes a line break. In all other browsers it's collapsed.
var IE_BR_FIX = IE_VER && IE_VER < 11;

/**
 * Fixes a bug in FF where it sometimes wraps
 * new lines in their own list item.
 * See issue #359
 */
var fixFirefoxListBug = function (editor)
{
	// Only apply to Firefox as will break other browsers.
	if ('mozHidden' in document)
	{
		var node = editor.getBody();
		var next;

		while (node)
		{
			next = node;

			if (next.firstChild)
				next = next.firstChild;
			else
			{
				while (next && !next.nextSibling)
					next = next.parentNode;

				if (next)
					next = next.nextSibling;
			}

			if (node.nodeType === 3 && /[\n\r\t]+/.test(node.nodeValue))
				// Only remove if newlines are collapsed
				if (!/^pre/.test(dom.css(node.parentNode, 'whiteSpace')))
					dom.remove(node);

			node = next;
		}
	}
};

var createDropDown = function (editor, menuItem, name, content)
{
	editor.dropdown.content(content);
	editor.dropdown.show(menuItem);

	var first = document.querySelector('#tooltip input,textarea');
	if (first)
		first.focus();
};

/**
 * Map of all the commands for SCEditor
 * @type {Object}
 * @name commands
 * @memberOf jQuery.sceditor
 */
var defaultCmds = {
	// START_COMMAND: Bold
	bold: {
		exec: 'bold',
		tooltip: 'Bold',
		shortcut: 'Ctrl+B'
	},
	// END_COMMAND
	// START_COMMAND: Italic
	italic: {
		exec: 'italic',
		tooltip: 'Italic',
		shortcut: 'Ctrl+I'
	},
	// END_COMMAND
	// START_COMMAND: Underline
	underline: {
		exec: 'underline',
		tooltip: 'Underline',
		shortcut: 'Ctrl+U'
	},
	// END_COMMAND
	// START_COMMAND: Strikethrough
	strike: {
		exec: 'strikethrough',
		tooltip: 'Strikethrough'
	},
	// END_COMMAND
	// START_COMMAND: Subscript
	subscript: {
		exec: 'subscript',
		tooltip: 'Subscript'
	},
	// END_COMMAND
	// START_COMMAND: Superscript
	superscript: {
		exec: 'superscript',
		tooltip: 'Superscript'
	},
	// END_COMMAND

	// START_COMMAND: Left
	left: {
		state(editor, node)
		{
			if (node && node.nodeType === 3)
				node = node.parentNode;

			if (node)
			{
				var isLtr = dom.css(node, 'direction') === 'ltr';
				var align = dom.css(node, 'textAlign');

				return align === 'left' || align === (isLtr ? 'start' : 'end');
			}
		},
		exec: 'justifyleft',
		tooltip: 'Align left'
	},
	// END_COMMAND
	// START_COMMAND: Centre
	center: {
		exec: 'justifycenter',
		tooltip: 'Center'
	},
	// END_COMMAND
	// START_COMMAND: Right
	right: {
		state(editor, node)
		{
			if (node && node.nodeType === 3)
				node = node.parentNode;

			if (node)
			{
				var isLtr = dom.css(node, 'direction') === 'ltr';
				var align = dom.css(node, 'textAlign');

				return align === 'right' || align === (isLtr ? 'end' : 'start');
			}
		},
		exec: 'justifyright',
		tooltip: 'Align right'
	},
	// END_COMMAND
	// START_COMMAND: Justify
	justify: {
		exec: 'justifyfull',
		tooltip: 'Justify'
	},
	// END_COMMAND

	// START_COMMAND: Font
	font: {
		_dropDown(editor,  callback)
		{
			var	content = dom.createElement('div');

			dom.on(content, 'click', 'a', function (e)
			{
				callback(dom.data(this, 'font'));
				editor.dropdown.hide();
				editor.focus();
				e.preventDefault();
			});

			editor.opts.fonts.forEach(function (font)
			{
				dom.appendChild(content, _tmpl('fontOpt', {
					font: font
				}, true));
			});

			createDropDown(editor,  'font-picker', content);
		},
		exec()
		{
			var editor = this;

			defaultCmds.font._dropDown(editor,  function (fontName)
			{
				editor.execCommand('fontname', fontName);
			});
		},
		tooltip: 'Font Name'
	},
	// END_COMMAND
	// START_COMMAND: Size
	size: {
		_dropDown(editor,  callback)
		{
			var	content = dom.createElement('div');

			dom.on(content, 'click', 'a', function (e)
			{
				callback(dom.data(this, 'size'));
				editor.dropdown.hide();
				editor.focus();
				e.preventDefault();
			});

			for (var i = 1; i <= 7; i++)
				dom.appendChild(content, _tmpl('sizeOpt', {
					size: i
				}, true));

			createDropDown(editor,  'fontsize-picker', content);
		},
		exec()
		{
			var editor = this;

			defaultCmds.size._dropDown(editor,  function (fontSize)
			{
				editor.execCommand('fontsize', fontSize);
			});
		},
		tooltip: 'Font Size'
	},
	// END_COMMAND
	// START_COMMAND: Colour
	color: {
		_dropDown(editor,  callback)
		{
			var	content = dom.createElement('div'),
				html    = '',
				cmd     = defaultCmds.color;

			if (!cmd._htmlCache)
			{
				for (const column of editor.opts.colors)
				{
					html += '<div class="sceditor-color-column">';

					for (const [color, name] of Object.entries(column))
						html +=
							'<a href="#" class="sceditor-color-option"' +
							' style="background-color: ' + color + '"' +
							' data-color="' + color + '"' +
							' title="' + name + '"></a>';

					html += '</div>';
				}

				cmd._htmlCache = html;
			}

			dom.appendChild(content, dom.parseHTML(cmd._htmlCache));

			dom.on(content, 'click', 'a', function (e)
			{
				callback(dom.data(this, 'color'));
				editor.dropdown.hide();
				editor.focus();
				e.preventDefault();
			});

			createDropDown(editor,  'color-picker', content);
		},
		exec()
		{
			var editor = this;

			defaultCmds.color._dropDown(editor,  function (color)
			{
				editor.execCommand('forecolor', color);
			});
		},
		tooltip: 'Font Color'
	},
	// END_COMMAND
	// START_COMMAND: Remove Format
	removeformat: {
		exec: 'removeformat',
		tooltip: 'Remove Formatting'
	},
	// END_COMMAND

	// START_COMMAND: Cut
	cut: {
		exec: 'cut',
		tooltip: 'Cut',
		errorMessage: 'Your browser does not allow the cut command. ' +
			'Please use the keyboard shortcut Ctrl/Cmd-X'
	},
	// END_COMMAND
	// START_COMMAND: Copy
	copy: {
		exec: 'copy',
		tooltip: 'Copy',
		errorMessage: 'Your browser does not allow the copy command. ' +
			'Please use the keyboard shortcut Ctrl/Cmd-C'
	},
	// END_COMMAND
	// START_COMMAND: Paste
	paste: {
		exec: 'paste',
		tooltip: 'Paste',
		errorMessage: 'Your browser does not allow the paste command. ' +
			'Please use the keyboard shortcut Ctrl/Cmd-V'
	},
	// END_COMMAND
	// START_COMMAND: Paste Text
	pastetext: {
		exec()
		{
			var	val,
				content = dom.createElement('div'),
				editor  = this;

			dom.appendChild(content, _tmpl('pastetext', {
				label: editor._(
					'Paste your text inside the following box:'
				),
				insert: editor._('Insert')
			}, true));

			dom.on(content, 'click', '.button', function (e)
			{
				val = dom.find(content, '#txt')[0].value;

				if (val)
					editor.wysiwygEditorInsertText(val);

				editor.dropdown.hide();
				editor.focus();
				e.preventDefault();
			});

			createDropDown(editor,  'pastetext', content);
		},
		tooltip: 'Paste Text'
	},
	// END_COMMAND
	// START_COMMAND: Bullet List
	bulletlist: {
		exec()
		{
			fixFirefoxListBug(this);
			this.execCommand('insertunorderedlist');
		},
		tooltip: 'Bullet list'
	},
	// END_COMMAND
	// START_COMMAND: Ordered List
	orderedlist: {
		exec()
		{
			fixFirefoxListBug(this);
			this.execCommand('insertorderedlist');
		},
		tooltip: 'Numbered list'
	},
	// END_COMMAND
	// START_COMMAND: Indent
	indent: {
		state(editor, parent, firstBlock)
		{
			// Only works with lists, for now
			var	range, startParent, endParent;

			if (dom.is(firstBlock, 'li'))
				return 0;

			if (dom.is(firstBlock, 'ul,ol,menu'))
			{
				// if the whole list is selected, then this must be
				// invalidated because the browser will place a
				// <blockquote> there
				range = editor.getRangeHelper().selectedRange();

				startParent = range.startContainer.parentNode;
				endParent   = range.endContainer.parentNode;

				// TODO: could use nodeType for this?
				// Maybe just check the firstBlock contains both the start
				//and end containers

				// Select the tag, not the textNode
				// (that's why the parentNode)
				if (startParent !==
					startParent.parentNode.firstElementChild ||
					// work around a bug in FF
					(dom.is(endParent, 'li') && endParent !==
						endParent.parentNode.lastElementChild))
					return 0;
			}

			return -1;
		},
		exec()
		{
			var editor = this,
				block = editor.getRangeHelper().getFirstBlockParent();

			editor.focus();

			// An indent system is quite complicated as there are loads
			// of complications and issues around how to indent text
			// As default, let's just stay with indenting the lists,
			// at least, for now.
			if (dom.closest(block, 'ul,ol,menu'))
				editor.execCommand('indent');

		},
		tooltip: 'Add indent'
	},
	// END_COMMAND
	// START_COMMAND: Outdent
	outdent: {
		state(editor, parents, firstBlock)
		{
			return dom.closest(firstBlock, 'ul,ol,menu') ? 0 : -1;
		},
		exec()
		{
			var	block = this.getRangeHelper().getFirstBlockParent();
			if (dom.closest(block, 'ul,ol,menu'))
				this.execCommand('outdent');

		},
		tooltip: 'Remove one indent'
	},
	// END_COMMAND

	// START_COMMAND: Table
	table: {
		exec()
		{
			var	editor  = this,
				content = dom.createElement('div');

			dom.appendChild(content, _tmpl('table', {
				rows: editor._('Rows:'),
				cols: editor._('Cols:'),
				insert: editor._('Insert')
			}, true));

			dom.on(content, 'click', '.button', function (e)
			{
				var	rows = Number(dom.find(content, '#rows')[0].value),
					cols = Number(dom.find(content, '#cols')[0].value),
					html = '<table>';

				if (rows > 0 && cols > 0)
				{
					html += Array(rows + 1).join(
						'<tr>' +
							Array(cols + 1).join(
								'<td>' + (IE_BR_FIX ? '' : '<br />') + '</td>'
							) +
						'</tr>'
					);

					html += '</table>';

					editor.wysiwygEditorInsertHtml(html);
					editor.dropdown.hide();
					editor.focus();
					e.preventDefault();
				}
			});

			createDropDown(editor,  'inserttable', content);
		},
		tooltip: 'Insert a table'
	},
	// END_COMMAND

	// START_COMMAND: Horizontal Rule
	horizontalrule: {
		exec: 'inserthorizontalrule',
		tooltip: 'Insert a horizontal rule'
	},
	// END_COMMAND

	// START_COMMAND: Code
	code: {
		exec()
		{
			this.wysiwygEditorInsertHtml(
				'<code>',
				(IE_BR_FIX ? '' : '<br />') + '</code>'
			);
		},
		tooltip: 'Code'
	},
	// END_COMMAND

	// START_COMMAND: Image
	image: {
		_dropDown(editor,  selected, cb)
		{
			var	content = dom.createElement('div');

			dom.appendChild(content, _tmpl('image', {
				url: editor._('URL:'),
				width: editor._('Width (optional):'),
				height: editor._('Height (optional):'),
				alt: editor._('ALT text (optional):'),
				insert: editor._('Insert')
			}, true));

			var	urlInput = dom.find(content, '#image')[0];

			urlInput.value = selected;

			dom.on(content, 'click', '.button', function (e)
			{
				if (urlInput.value)
					cb(
						urlInput.value,
						dom.find(content, '#width')[0].value,
						dom.find(content, '#height')[0].value,
						dom.find(content, '#alt')[0].value
					);

				editor.dropdown.hide();
				editor.focus();
				e.preventDefault();
			});

			createDropDown(editor,  'insertimage', content);
		},
		exec()
		{
			var	editor  = this;

			defaultCmds.image._dropDown(
				editor,
				'',
				function (url, width, height, alt)
				{
					var attrs  = '';

					if (width)
						attrs += ' width="' + width + '"';

					if (height)
						attrs += ' height="' + height + '"';

					if (alt)
						attrs += ' alt="' + alt + '"';

					editor.wysiwygEditorInsertHtml(
						'<img' + attrs + ' src="' + url + '" />'
					);
				}
			);
		},
		tooltip: 'Insert an image'
	},
	// END_COMMAND

	// START_COMMAND: E-mail
	email: {
		_dropDown(editor,  cb)
		{
			var	content = dom.createElement('div');

			dom.appendChild(content, _tmpl('email', {
				label: editor._('E-mail:'),
				desc: editor._('Description (optional):'),
				insert: editor._('Insert')
			}, true));

			dom.on(content, 'click', '.button', function (e)
			{
				var email = dom.find(content, '#email')[0].value;

				if (email)
					cb(email, dom.find(content, '#des')[0].value);

				editor.dropdown.hide();
				editor.focus();
				e.preventDefault();
			});

			createDropDown(editor,  'insertemail', content);
		},
		exec()
		{
			var	editor  = this;

			defaultCmds.email._dropDown(
				editor,
				function (email, text)
				{
					// needed for IE to reset the last range
					editor.focus();

					if (!editor.getRangeHelper().selectedHtml() || text)
						editor.wysiwygEditorInsertHtml(
							'<a href="' + 'mailto:' + email + '">' +
								(text || email) +
							'</a>'
						);
					else
						editor.execCommand('createlink', 'mailto:' + email);

				}
			);
		},
		tooltip: 'Insert an email'
	},
	// END_COMMAND

	// START_COMMAND: Link
	link: {
		_dropDown(editor,  cb)
		{
			var content = dom.createElement('div');

			dom.appendChild(content, _tmpl('link', {
				url: editor._('URL:'),
				desc: editor._('Description (optional):'),
				ins: editor._('Insert')
			}, true));

			var linkInput = dom.find(content, '#link')[0];

			function insertUrl(e)
			{
				if (linkInput.value)
					cb(linkInput.value, dom.find(content, '#des')[0].value);

				editor.dropdown.hide();
				editor.focus();
				e.preventDefault();
			}

			dom.on(content, 'click', '.button', insertUrl);
			dom.on(content, 'keypress', function (e)
			{
				// 13 = enter key
				if (e.which === 13 && linkInput.value)
					insertUrl(e);

			}, dom.EVENT_CAPTURE);

			createDropDown(editor,  'insertlink', content);
		},
		exec()
		{
			var editor = this;

			defaultCmds.link._dropDown(editor,  function (url, text)
			{
				// needed for IE to restore the last range
				editor.focus();

				// If there is no selected text then must set the URL as
				// the text. Most browsers do this automatically, sadly
				// IE doesn't.
				if (text || !editor.getRangeHelper().selectedHtml())
				{
					text = text || url;

					editor.wysiwygEditorInsertHtml(
						'<a href="' + url + '">' + text + '</a>'
					);
				}
				else
					editor.execCommand('createlink', url);

			});
		},
		tooltip: 'Insert a link'
	},
	// END_COMMAND

	// START_COMMAND: Unlink
	unlink: {
		state: editor => dom.closest(editor.currentNode(), 'a') ? 0 : -1,
		exec()
		{
			var anchor = dom.closest(this.currentNode(), 'a');

			if (anchor)
			{
				while (anchor.firstChild)
					dom.insertBefore(anchor.firstChild, anchor);

				dom.remove(anchor);
			}
		},
		tooltip: 'Unlink'
	},
	quote: {
		exec( html, author)
		{
			var
				before = '<blockquote>',
				end    = '</blockquote>';

			// if there is HTML passed set end to null so any selected
			// text is replaced
			if (html)
			{
				author = (author ? '<cite>' + author + '</cite>' : '');
				before = before + author + html + end;
				end    = null;
			}
			// if not add a newline to the end of the inserted quote
			else if (this.getRangeHelper().selectedHtml() === '')
				end = (IE_BR_FIX ? '' : '<br />') + end;

			this.wysiwygEditorInsertHtml(before, end);
		},
		tooltip: 'Insert a Quote'
	},
	date: {
		exec()
		{
			var	now   = new Date(),
				year  = now.getYear(),
				month = now.getMonth() + 1,
				day   = now.getDate();

			if (year < 2000)
				year = 1900 + year;

			if (month < 10)
				month = '0' + month;

			if (day < 10)
				day = '0' + day;

			this.insertText(this.opts.dateFormat
				.replace(/year/i, year)
				.replace(/month/i, month)
				.replace(/day/i, day));
		},
		tooltip: 'Insert current date'
	},
	time: {
		exec()
		{
			var	now   = new Date(),
				hours = now.getHours(),
				mins  = now.getMinutes(),
				secs  = now.getSeconds();

			if (hours < 10)
				hours = '0' + hours;

			if (mins < 10)
				mins = '0' + mins;

			if (secs < 10)
				secs = '0' + secs;

			this.insertText(hours + ':' + mins + ':' + secs);
		},
		tooltip: 'Insert current time'
	},
	print: {
		exec: 'print',
		tooltip: 'Print'
	},
	maximize: {
		state: editor => editor.maximize(),
		exec()
		{
			this.maximize(!this.maximize());
		},
		tooltip: 'Maximize',
		shortcut: 'Ctrl+Shift+M'
	},
	source: {
		state: editor => editor.isInSourceMode(),
		exec()
		{
			this.toggleSourceMode();
		},
		tooltip: 'View source',
		shortcut: 'Ctrl+Shift+S'
	}
};

export default defaultCmds;
