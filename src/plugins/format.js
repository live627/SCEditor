var plugin = function ()
{
	/**
		* Default tags
		* @type {Object}
		* @private
		*/
	var tags = {
		p: 'Paragraph',
		h1: 'Heading 1',
		h2: 'Heading 2',
		h3: 'Heading 3',
		h4: 'Heading 4',
		h5: 'Heading 5',
		h6: 'Heading 6',
		address: 'Address',
		pre: 'Preformatted Text'
	};

	/**
		* Inserts the specified tag into the editor
		*
		* @param  {sceditor} editor
		* @param  {string} tag
		* @private
		*/
	var	insertTag = function (editor, tag)
	{
		if (editor.sourceMode())
			editor.insert('<' + tag + '>', '</' + tag + '>');
		else
			editor.execCommand('formatblock', '<' + tag + '>');
	};

	/**
		* Function for the exec and txtExec properties
		*
		* @private
		*/
	var	formatCmd = function ()
	{
		var
			editor   = this,
			content = document.createElement('div');

		sceditor.utils.each(tags, function (tag, val)
		{
			var link = document.createElement('a');
			link.className = 'sceditor-option';
			link.textContent = val.name || val;
			link.addEventListener('click', function (e)
			{
				editor.dropdown.hide();
				editor.focus();

				if (val.exec)
					val.exec(editor);
				else
					insertTag(editor, tag);

				e.preventDefault();
			});

			content.appendChild(link);
		});

		editor.dropdown.content(content);
		editor.dropdown.show();
	};

	this.init = function ()
	{
		var
			opts  = this.opts,
			pOpts = opts.paragraphformat;

		// Don't enable if the BBCode plugin is enabled.
		if (opts.format && opts.format === 'bbcode')
			return;

		if (pOpts)
		{
			if (pOpts.tags)
				tags = pOpts.tags;

			if (pOpts.excludeTags)
				pOpts.excludeTags.forEach(function (val)
				{
					delete tags[val];
				});
		}

		if (!this.commands.format)
			this.commands.format = {
				exec: formatCmd,
				tooltip: 'Format Paragraph'
			};

		if (opts.toolbar === sceditor.defaultOptions.toolbar)
			opts.toolbar = opts.toolbar.replace(',color,',
				',color,format,');
	};
};

export default plugin;
