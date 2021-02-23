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
		code()
		{
			var editor = this;

			editor.command.get('font')._dropDown(
				editor,
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
		code()
		{
			var editor = this;

			editor.command.get('size')._dropDown(
				editor,
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
		code()
		{
			var editor = this;

			editor.command.get('color')._dropDown(
				editor,
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
		code(selected)
		{
			this.insertText(
				'[ul]\n[li]' +
				selected.split(/\r?\n/).join('[/li]\n[li]') +
				'[/li]\n[/ul]'
			);
		}
	},
	orderedlist: {
		code(selected)
		{
			this.insertText(
				'[ol]\n[li]' +
				selected.split(/\r?\n/).join('[/li]\n[li]') +
				'[/li]\n[/ol]'
			);
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
		code(selected)
		{
			var	editor  = this;

			editor.command.get('image')._dropDown(
				editor,
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
		code(selected)
		{
			var	editor  = this;

			editor.command.get('email')._dropDown(
				editor,
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
		code(selected)
		{
			var	editor  = this;

			editor.command.get('link')._dropDown(
				editor,
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
	}
};

export default commands;
