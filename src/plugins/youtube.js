var plugin = function ()
{
	var
		YOUTUBE_DATA_ID = 'data-youtube-id',
		YOUTUBE_DATA_START = 'data-youtube-start',
		matchURL = x => x.match(/(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed)(?:\.php)?(?:\?.*?v=|\/))([a-zA-Z0-9\_-]+)(?:.*t=(?:(?:(\d+)h)?(\d+)m?(\d+)s|([0-9]+)))?/),
		n = x => Number(x || 0),
		getTime = x => ((n(x[2]) * 3600) + (n(x[3]) * 60) + n(x[4])) || n(x[5]),
		f = Math.floor,
		g = n => ('00' + n).slice(-2),
		formatSeconds = s => `${f(s / 3600)}:${g(f(s / 60) % 60)}:${g(s % 60)}`,
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
				createElement = sceditor.dom.createElement,
				appendChild = sceditor.dom.appendChild,
				on = sceditor.dom.on,
				content = createElement('div'),
				tr = createElement('tr'),
				tr1 = createElement('tr'),
				table = createElement('table'),
				td = createElement('td'),
				td1 = createElement('td'),
				lbl = createElement('label', {
					textContent: editor._('Video URL:')
				}),
				inp = createElement('input', {
					type: 'text'
				}),
				err = createElement('div', {
					class: 'error'
				}),
				btn = createElement('button', {
					class: 'button',
					textContent: editor._('Insert')
				});
			appendChild(content,lbl);
			appendChild(lbl,inp);
			appendChild(lbl,err);
			appendChild(content,btn);
			appendChild(tr,createElement('td', {
				textContent: editor._('Video ID:')
			}));
			appendChild(tr,td);
			appendChild(tr1,createElement('td', {
				textContent: editor._('Timestamp:')
			}));
			appendChild(tr1,td1);
			appendChild(table,tr);
			appendChild(table,tr1);
			appendChild(content,table);

			on(inp, 'input', function ()
			{
				var match = matchURL(inp.value);

				if (match)
				{
					td.textContent = match[1];
					td1.textContent = formatSeconds(getTime(match));
					err.textContent = '';
					err.className = 'error';
					inp.className = ' ';
				}
				else
				{
					td.textContent = '';
					td1.textContent = '';
					err.textContent = editor._('You need to enter a YouTube video URL.');
					err.className = 'error active';
					inp.className = 'invalid';
				}
			});
			on(btn, 'click', function ()
			{
				var match = matchURL(inp.value);

				if (match)
					callback(match[1], getTime(match));

				editor.popup.hide();
				editor.focus();
			});

			editor.popup.content(content);
			editor.popup.show();
			inp.focus();
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

	return {matchURL, getTime, formatSeconds, getFormat, init};
};

export default plugin;
