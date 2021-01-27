var plugin = function ()
{
	var
		YOUTUBE_DATA_ID = 'data-youtube-id',
		YOUTUBE_DATA_START = 'data-youtube-start',
		matchURL = x => x.match(/(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed)(?:\.php)?(?:\?.*?v=|\/))([a-zA-Z0-9\_-]+)(?:.*t=(?:(?:(\d+)h)?(\d+)m?(\d+)s|([0-9]+)))?/),
		n = x => Number(x || 0),
		getTime = x => ((n(x[2]) * 3600) + (n(x[3]) * 60) + n(x[4])) || n(x[5]),
		getFormat = () => ({
			allowsEmpty: true,
			isInline: false,
			skipLastLineBreak: true,
			tags: {
				div: {
					[YOUTUBE_DATA_ID]: null,
					[YOUTUBE_DATA_START]: null
				}
			},
			format(el)
			{
				var time = el.getAttribute(YOUTUBE_DATA_START);

				return `[youtube${time > 0 ? '=' + time : ''}]${el.getAttribute(YOUTUBE_DATA_ID)}[/youtube]`;
			},
			html(token, attrs, id)
			{
				var time = 0;

				if (attrs.defaultattr)
					time = attrs.defaultattr;

				return `<div ${YOUTUBE_DATA_ID}="${id}" ${YOUTUBE_DATA_START}="${time}"><iframe src="https://www.youtube.com/embed/${id}?start=${time}&wmode=opaque"></iframe></div>`;
			}
		}),
		popup = function (editor, callback)
		{
			var
				dom = sceditor.dom,
				content = dom.createElement('div'),
				div = dom.createElement('div'),
				lbl = dom.createElement('label', {
					for: 'link',
					textContent: editor._('Video URL:')
				}),
				inp = dom.createElement('input', {
					type: 'url',
					id: 'link'
				}),
				div1 = dom.createElement('div'),
				btn = dom.createElement('input', {
					type: 'button',
					class: 'button',
					value: editor._('Insert')
				});
			dom.appendChild(div,lbl);
			dom.appendChild(div,inp);
			dom.appendChild(content,div);
			dom.appendChild(div1,btn);
			dom.appendChild(content,div1);
			inp.focus();

			dom.on(btn, 'click', function (e)
			{
				var
					match = matchURL(inp.value),
					time = 0;

				if (match[2])
					for (var t of match[2].split(/[hms]/))
						if (t !== '')
							time = (time * 60) + Number(t);

				if (match[1])
					callback(match[1], time);

				editor.popup.hide();
				editor.focus();
				e.preventDefault();
			});

			editor.popup.content(content);
			editor.popup.show();
		};

	var init = function ()
	{
		var editor = this;

		editor.commands.youtube = {
			exec()
			{
				popup(editor, function (id, time)
				{
					editor.insert(
						`<div ${YOUTUBE_DATA_ID}="${id}" ${YOUTUBE_DATA_START}="${time}"><iframe src="https://www.youtube.com/embed/${id}?start=${time}&wmode=opaque"></iframe></div>`,
						false,
						false
					);
				});
			},
			code()
			{
				popup(editor, function (id, time)
				{
					editor.insertText(`[youtube${time > 0 ? '=' + time : ''}]${id}[/youtube]`);
				});
			},
			tooltip: 'Insert a YouTube video'
		};
		if (editor.opts.format.set)
			editor.opts.format.set('youtube', getFormat());
	};

	return {matchURL, getTime, getFormat, init};
};

export default plugin;
