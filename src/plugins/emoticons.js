var plugin = function (dom)
{
	dom = dom || sceditor.dom;

	var EMOTICON_DATA_ATTR = 'data-sceditor-emoticon';

	/**
	 * Checks all emoticons are surrounded by whitespace and
	 * replaces any that aren't with with their emoticon code.
	 *
	 * @param {HTMLElement} node
	 * @param {rangeHelper} rangeHelper
	 * @return {void}
	 */
	var checkWS = function (node, rangeHelper)
	{
		var nonWsRegex = /[^\s\xA0\u2002\u2003\u2009\u00a0]+/;
		var emoticons = node && dom.find(node, 'img[data-sceditor-emoticon]');

		if (!node || !emoticons.length)
			return;

		for (var i = 0; i < emoticons.length; i++)
		{
			var emoticon = emoticons[i];
			var parent = emoticon.parentNode;
			var prev = emoticon.previousSibling;
			var next = emoticon.nextSibling;

			if ((!prev || !nonWsRegex.test(prev.nodeValue.slice(-1))) &&
			(!next || !nonWsRegex.test((next.nodeValue || '')[0])))
				continue;

			var range = rangeHelper.cloneSelected();
			var rangeStart = -1;
			var rangeStartContainer = range.startContainer;
			var previousText = prev.nodeValue;

			// For IE's HTMLPhraseElement
			if (previousText === null)
				previousText = prev.innerText || '';

			previousText += dom.data(emoticon, 'sceditor-emoticon');

			// If the cursor is after the removed emoticon, add
			// the length of the newly added text to it
			if (rangeStartContainer === next)
				rangeStart = previousText.length + range.startOffset;

			// If the cursor is set before the next node, set it to
			// the end of the new text node
			if (rangeStartContainer === node &&
			node.childNodes[range.startOffset] === next)
				rangeStart = previousText.length;

			// If the cursor is set before the removed emoticon,
			// just keep it at that position
			if (rangeStartContainer === prev)
				rangeStart = range.startOffset;

			if (!next || next.nodeType !== dom.TEXT_NODE)
				next = parent.insertBefore(
					parent.ownerDocument.createTextNode(''), next
				);

			next.insertData(0, previousText);
			dom.remove(prev);
			dom.remove(emoticon);

			// Need to update the range starting position if it's been modified
			if (rangeStart > -1)
			{
				range.setStart(next, rangeStart);
				range.collapse(true);
				rangeHelper.selectRange(range);
			}
		}
	};

	/**
	 * Replaces any emoticons inside the root node with images.
	 *
	 * emoticons should be an object where the key is the emoticon
	 * code and the value is the HTML to replace it with.
	 *
	 * Assumes that the keywords array is sorted shortest to longest
	 *
	 * @param {HTMLElement} root
	 * @param {Array<string, string, RegExp>} emoticons
	 * @param {boolean} emoticonsCompat
	 * @return {void}
	 */
	var replace = function (root, emoticons, emoticonsCompat = false)
	{
		var	doc = root.ownerDocument;

		// TODO: Make this tag configurable.
		if (dom.parent(root, 'code'))
			return;

		var convert = function (node)
		{
			node = node.firstChild;

			while (node)
			{
				// TODO: Make this tag configurable.
				if (node.nodeType === dom.ELEMENT_NODE && !dom.is(node, 'code'))
					convert(node);

				if (node.nodeType === dom.TEXT_NODE)
					// Loop emoticons in reverse so that shorter codes won't
					// partially match longer ones (they already got sorted)
					for (var i = emoticons.length - 1; i >= 0; i--)
					{
						var text  = node.nodeValue;
						var key   = emoticons[i][0];
						var index = emoticonsCompat && emoticons[i][2] ?
							text.search(emoticons[i][2]) :
							text.indexOf(key);

						if (index > -1)
						{
							// When emoticonsCompat is enabled this will be the
							// position after any white space
							var startIndex = text.indexOf(key, index);
							var fragment  = dom.parseHTML(emoticons[i][1], doc);

							fragment.appendChild(
								doc.createTextNode(
									text.substr(startIndex + key.length)
								)
							);
							node.nodeValue = text.substr(0, startIndex);
							node.parentNode.insertBefore(
								fragment,
								node.nextSibling
							);
						}
					}

				node = node.nextSibling;
			}
		};

		convert(root);
	};

	var init = function ()
	{
		var editor      = this;
		var options     = editor.opts;
		var rangeHelper = editor.getRangeHelper();
		var emoticons   = options.emoticons;
		var compat      = options.emoticonsCompat;
		var root        = options.emoticonsRoot || '';
		var cache       = [];
		var space       = '(^|\\s|\xA0|\u2002|\u2003|\u2009|$)';

		var replaceEmoticons = () =>
		{
			replace(editor.getBody(), cache, compat);
		};
		var emoticonsKeyPress = e =>
		{
			// TODO: Make configurable
			if (dom.closest(editor.currentBlockNode(), 'code'))
				return;

			if (rangeHelper.replaceKeyword(
				cache,
				true,
				compat,
				e.key
			) && (!compat || !/^\s$/.test(e.key)))
				e.preventDefault();
		};

		if (emoticons)
		{
			cache = emoticons.map(x => [x.code,
				`<img src="${root + x.path}" ${EMOTICON_DATA_ATTR}="${x.code}" alt="${x.code}" title="${x.tooltip || x.code}">`,
				new RegExp(space + sceditor.regexEscape(x.code) + space)
			]);
			cache.sort((a, b) => a[0].length - b[0].length);

			if (compat && window.getSelection)
				dom.on(
					editor.getBody(),
					'keyup',
					checkWS.bind(null, editor.currentBlockNode(), rangeHelper)
				);

			dom.on(editor.getBody(), 'keypress', emoticonsKeyPress);
			editor.events.on('inserthtml', replaceEmoticons);

			editor.commands.emoticon = {
				exec()
				{
					var
						text = b => rangeHelper.getOuterText(b, 1),
						startSpace = compat && text(true, 1) !== ' ' ? ' ' : '',
						endSpace   = compat && text(false, 1) !== ' ' ? ' ' : '',
						content    = dom.createElement('div', {id: 'emoticons-container'});

					for (var emoticon of emoticons)
					{
						var img = dom.createElement('img', {
							src: root + emoticon.path,
							alt: emoticon.code,
							title: emoticon.tooltip || emoticon.code
						});
						dom.on(img, 'click', function (e)
						{
							editor.insert(startSpace + dom.attr(this, 'alt') + endSpace,
								null, false);
							editor.popup.hide();
							editor.focus();

							e.preventDefault();
						});
						dom.appendChild(content,img);
					}
					editor.popup.content(content);
					editor.popup.show();
				},
				tooltip: 'Insert an emoticon'
			};
			if (editor.opts.format.set)
			{
				editor.opts.format.set(
					'emoticon',
					{
						allowsEmpty: true,
						tags: {
							img: {
								src: null,
								[EMOTICON_DATA_ATTR]: null
							}
						},
						format: el => el.getAttribute(EMOTICON_DATA_ATTR),
						html: '{0}'
					}
				);
				editor.opts.format.set(
					'img',
					{
						tags: {
							img: {
								[EMOTICON_DATA_ATTR]: false
							}
						}
					}
				);
			}
		}
	};

	return {checkWS, replace, init};
};

export default plugin;
