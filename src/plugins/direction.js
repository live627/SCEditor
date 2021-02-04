var plugin = function ()
{
	this.init = function ()
	{
		var
			editor = this,
			dom = sceditor.dom;

		editor.commands.ltr = {
			state(editor, parents, firstBlock)
			{
				return firstBlock && firstBlock.style.direction === 'ltr';
			},
			exec()
			{
				var
					rangeHelper = editor.getRangeHelper(),
					node = rangeHelper.getFirstBlockParent();

				editor.focus();

				if (!node || dom.is(node, 'body'))
				{
					editor.execCommand('formatBlock', 'p');

					node  = rangeHelper.getFirstBlockParent();

					if (!node || dom.is(node, 'body'))
						return;
				}

				var toggleValue = dom.css(node, 'direction') === 'ltr' ? '' : 'ltr';
				dom.css(node, 'direction', toggleValue);
			},
			code: ['[ltr]', '[/ltr]'],
			tooltip: 'Left-to-Right'
		};
		editor.commands.rtl = {
			state(editor, parents, firstBlock)
			{
				return firstBlock && firstBlock.style.direction === 'rtl';
			},
			exec()
			{
				var
					rangeHelper = editor.getRangeHelper(),
					node = rangeHelper.getFirstBlockParent();

				editor.focus();

				if (!node || dom.is(node, 'body'))
				{
					editor.execCommand('formatBlock', 'p');

					node = rangeHelper.getFirstBlockParent();

					if (!node || dom.is(node, 'body'))
						return;
				}

				var toggleValue = dom.css(node, 'direction') === 'rtl' ? '' : 'rtl';
				dom.css(node, 'direction', toggleValue);
			},
			code: ['[rtl]', '[/rtl]'],
			tooltip: 'Right-to-Left'
		};
		if (editor.opts.format.set)
		{
			editor.opts.format.set(
				'ltr',
				{
					styles: {
						direction: ['ltr']
					},
					isInline: false,
					format: '[ltr]{0}[/ltr]',
					html: '<div style="direction: ltr">{0}</div>'
				}
			);
			editor.opts.format.set(
				'rtl',
				{
					styles: {
						direction: ['rtl']
					},
					isInline: false,
					format: '[rtl]{0}[/rtl]',
					html: '<div style="direction: rtl">{0}</div>'
				}
			);
		}
	};
};

export default plugin;
