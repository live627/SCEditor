import { entities as escapeEntities } from '../lib/escape.js';

var commands = {
	bold: {
		code: ['[b]', '[/b]']
	},
	italic: {
		code: ['[i]', '[/i]']
	},
	underline: {
		code: ['[u]', '[/u]']
	},
	strike: {
		code: ['[s]', '[/s]']
	},
	subscript: {
		code: ['[sub]', '[/sub]']
	},
	superscript: {
		code: ['[sup]', '[/sup]']
	},
	left: {
		code: ['[left]', '[/left]']
	},
	center: {
		code: ['[center]', '[/center]']
	},
	right: {
		code: ['[right]', '[/right]']
	},
	justify: {
		code: ['[justify]', '[/justify]']
	},
	font: {
		code: function (caller)
		{
			var editor = this;

			editor.command.get('font')._dropDown(
				editor,
				caller,
				function (fontName)
				{
					editor.insertText(
						'[font=' + fontName + ']',
						'[/font]'
					);
				}
			);
		}
	},
	size: {
		code: function (caller)
		{
			var editor = this;

			editor.command.get('size')._dropDown(
				editor,
				caller,
				function (fontSize)
				{
					editor.insertText(
						'[size=' + fontSize + ']',
						'[/size]'
					);
				}
			);
		}
	},
	color: {
		code: function (caller)
		{
			var editor = this;

			editor.command.get('color')._dropDown(
				editor,
				caller,
				function (color)
				{
					editor.insertText(
						'[color=' + color + ']',
						'[/color]'
					);
				}
			);
		}
	},
	bulletlist: {
		code: function (caller, selected)
		{
			var content = '';

			for (const line of selected.split(/\r?\n/))
				content += (content ? '\n' : '') +
							'[li]' + line + '[/li]';

			this.insertText('[ul]\n' + content + '\n[/ul]');
		}
	},
	orderedlist: {
		code: function (caller, selected)
		{
			var content = '';

			for (const line of selected.split(/\r?\n/))
				content += (content ? '\n' : '') +
							'[li]' + line + '[/li]';

			this.insertText('[ol]\n' + content + '\n[/ol]');
		}
	},
	table: {
		code: ['[table][tr][td]', '[/td][/tr][/table]']
	},
	horizontalrule: {
		code: ['[hr]']
	},
	code: {
		code: ['[code]', '[/code]']
	},
	image: {
		code: function (caller, selected)
		{
			var	editor  = this;

			editor.command.get('image')._dropDown(
				editor,
				caller,
				selected,
				function (url, width, height, alt)
				{
					var attrs  = '';

					if (width)
						attrs += ' width="' +
									escapeEntities(width, true) + '"';

					if (height)
						attrs += ' height="' +
									escapeEntities(height, true) + '"';

					if (alt)
						attrs += ' alt="' +
									escapeEntities(alt, true) + '"';

					editor.insertText(
						'[img' + attrs + ']' + url + '[/img]'
					);
				}
			);
		}
	},
	email: {
		code: function (caller, selected)
		{
			var	editor  = this;

			editor.command.get('email')._dropDown(
				editor,
				caller,
				function (url, text)
				{
					editor.insertText(
						'[email=' + url + ']' +
									(text || selected || url) +
								'[/email]'
					);
				}
			);
		}
	},
	link: {
		code: function (caller, selected)
		{
			var	editor  = this;

			editor.command.get('link')._dropDown(
				editor,
				caller,
				function (url, text)
				{
					editor.insertText(
						'[url=' + url + ']' +
									(text || selected || url) +
								'[/url]'
					);
				}
			);
		}
	},
	quote: {
		code: ['[quote]', '[/quote]']
	},
	youtube: {
		code: function (caller)
		{
			var editor = this;

			editor.command.get('youtube')._dropDown(
				editor,
				caller,
				function (id)
				{
					editor.insertText('[youtube]' + id + '[/youtube]');
				}
			);
		}
	},
	rtl: {
		code: ['[rtl]', '[/rtl]']
	},
	ltr: {
		code: ['[ltr]', '[/ltr]']
	}
};

export default commands;
