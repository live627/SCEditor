var getEditorCommand = sceditor.command.get;

var commands = {
	bold: {
		txtExec: ['<strong>', '</strong>']
	},
	italic: {
		txtExec: ['<em>', '</em>']
	},
	underline: {
		txtExec: ['<span style="text-decoration:underline;">', '</span>']
	},
	strike: {
		txtExec: ['<span style="text-decoration:line-through;">', '</span>']
	},
	subscript: {
		txtExec: ['<sub>', '</sub>']
	},
	superscript: {
		txtExec: ['<sup>', '</sup>']
	},
	left: {
		txtExec: ['<div style="text-align:left;">', '</div>']
	},
	center: {
		txtExec: ['<div style="text-align:center;">', '</div>']
	},
	right: {
		txtExec: ['<div style="text-align:right;">', '</div>']
	},
	justify: {
		txtExec: ['<div style="text-align:justify;">', '</div>']
	},
	font: {
		txtExec: function (caller)
		{
			var editor = this;

			getEditorCommand('font')._dropDown(
				editor,
				caller,
				function (font)
				{
					editor.insertText('<span style="font-family:' +
							font + ';">', '</span>');
				}
			);
		}
	},
	size: {
		txtExec: function (caller)
		{
			var editor = this;

			getEditorCommand('size')._dropDown(
				editor,
				caller,
				function (size)
				{
					editor.insertText('<span style="font-size:' +
							size + ';">', '</span>');
				}
			);
		}
	},
	color: {
		txtExec: function (caller)
		{
			var editor = this;

			getEditorCommand('color')._dropDown(
				editor,
				caller,
				function (color)
				{
					editor.insertText('<span style="color:' +
							color + ';">', '</span>');
				}
			);
		}
	},
	bulletlist: {
		txtExec: ['<ul><li>', '</li></ul>']
	},
	orderedlist: {
		txtExec: ['<ol><li>', '</li></ol>']
	},
	table: {
		txtExec: ['<table><tr><td>', '</td></tr></table>']
	},
	horizontalrule: {
		txtExec: ['<hr />']
	},
	code: {
		txtExec: ['<code>', '</code>']
	},
	image: {
		txtExec: function (caller, selected)
		{
			var	editor  = this;

			getEditorCommand('image')._dropDown(
				editor,
				caller,
				selected,
				function (url, width, height, alt)
				{
					var attrs  = '';

					if (width)
						attrs += ' width="' + width + '"';

					if (height)
						attrs += ' height="' + height + '"';

					if (alt)
						attrs += ' alt="' + alt + '"';

					editor.insertText(
						'<img' + attrs + ' src="' + url + '" />'
					);
				}
			);
		}
	},
	email: {
		txtExec: function (caller, selected)
		{
			var	editor  = this;

			getEditorCommand('email')._dropDown(
				editor,
				caller,
				function (url, text)
				{
					editor.insertText(
						'<a href="mailto:' + url + '">' +
								(text || selected || url) +
							'</a>'
					);
				}
			);
		}
	},
	link: {
		txtExec: function (caller, selected)
		{
			var	editor  = this;

			getEditorCommand('link')._dropDown(
				editor,
				caller,
				function (url, text)
				{
					editor.insertText(
						'<a href="' + url + '">' +
								(text || selected || url) +
							'</a>'
					);
				}
			);
		}
	},
	quote: {
		txtExec: ['<blockquote>', '</blockquote>']
	},
	youtube: {
		txtExec: function (caller)
		{
			var editor = this;
			var pOpts = editor.opts.parserOptions;

			getEditorCommand('youtube')._dropDown(
				editor,
				caller,
				function (id, start)
				{
					editor.insertText(
						'<iframe ' + pOpts.youtubeParameters + ' ' +
							'src="https://www.youtube.com/embed/' + id +
							'?start=' + start +
							'&wmode=opaque" ' +
							'data-youtube-id="' + id + '" ' +
							'data-youtube-start="' + start + '">' +
							'</iframe>'
					);
				}
			);
		}
	},
	rtl: {
		txtExec: ['<div stlye="direction:rtl;">', '</div>']
	},
	ltr: {
		txtExec: ['<div stlye="direction:ltr;">', '</div>']
	}
};

export default commands;
