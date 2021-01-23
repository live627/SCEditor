var plugin = function ()
{
	var dom = sceditor.dom;
	var globalWin  = window;
	var globalDoc  = document;
	var initResize = function (base, editorContainer, options)
	{
		var
			grip        = dom.createElement('div', {
				className: 'sceditor-grip'
			}),
			// Cover is used to cover the editor iframe so document
			// still gets mouse move events
			cover       = dom.createElement('div', {
				className: 'sceditor-resize-cover'
			}),
			moveEvents  = 'touchmove mousemove',
			endEvents   = 'touchcancel touchend mouseup',
			startX      = 0,
			startY      = 0,
			newX        = 0,
			newY        = 0,
			startWidth  = 0,
			startHeight = 0,
			origWidth   = dom.width(editorContainer),
			origHeight  = dom.height(editorContainer),
			isDragging  = false,
			rtl         = dom.attr(globalDoc.body, 'dir') === 'rtl',
			minHeight = options.resizeMinHeight || origHeight / 1.5,
			maxHeight = options.resizeMaxHeight || origHeight * 2.5,
			minWidth  = options.resizeMinWidth  || origWidth  / 1.25,
			maxWidth  = options.resizeMaxWidth  || origWidth  * 1.25,
			mouseMoveFunc = function (e)
			{
				// iOS uses window.event
				if (e.type === 'touchmove')
				{
					e    = globalWin.event;
					newX = e.changedTouches[0].pageX;
					newY = e.changedTouches[0].pageY;
				}
				else
				{
					newX = e.pageX;
					newY = e.pageY;
				}

				var	newHeight = startHeight + (newY - startY),
					newWidth  = rtl ?
						startWidth - (newX - startX) :
						startWidth + (newX - startX);

				if (maxWidth > 0 && newWidth > maxWidth)
					newWidth = maxWidth;

				if (minWidth > 0 && newWidth < minWidth)
					newWidth = minWidth;

				if (!options.resizeWidth)
					newWidth = false;

				if (maxHeight > 0 && newHeight > maxHeight)
					newHeight = maxHeight;

				if (minHeight > 0 && newHeight < minHeight)
					newHeight = minHeight;

				if (!options.resizeHeight)
					newHeight = false;

				if (newWidth || newHeight)
					base.dimensions(newWidth, newHeight);

				e.preventDefault();
			},
			mouseUpFunc = function (e)
			{
				if (!isDragging)
					return;

				isDragging = false;

				dom.hide(cover);
				dom.removeClass(editorContainer, 'resizing');
				dom.off(globalDoc, moveEvents, mouseMoveFunc);
				dom.off(globalDoc, endEvents, mouseUpFunc);

				e.preventDefault();
			};
		var
			n = 'http://www.w3.org/2000/svg',
			svg = document.createElementNS(n,'svg'),
			p = document.createElementNS(n,'path');
		svg.setAttribute('viewBox', '0 0 16 16');
		// eslint-disable-next-line max-len
		p.setAttribute('d', 'M14.656 5.156l-10 10 .688.688 10-10-.688-.688zm0 3l-7 7 .688.688 7-7-.688-.688zm0 3l-4 4 .688.688 4-4-.688-.688z');
		svg.appendChild(p);
		dom.appendChild(grip, svg);
		dom.appendChild(editorContainer, grip);
		dom.appendChild(editorContainer, cover);
		dom.hide(cover);

		dom.on(grip, 'touchstart mousedown', function (e)
		{
			// iOS uses window.event
			if (e.type === 'touchstart')
			{
				e      = globalWin.event;
				startX = e.touches[0].pageX;
				startY = e.touches[0].pageY;
			}
			else
			{
				startX = e.pageX;
				startY = e.pageY;
			}

			startWidth  = dom.width(editorContainer);
			startHeight = dom.height(editorContainer);
			isDragging  = true;

			dom.addClass(editorContainer, 'resizing');
			dom.show(cover);
			dom.on(globalDoc, moveEvents, mouseMoveFunc);
			dom.on(globalDoc, endEvents, mouseUpFunc);

			e.preventDefault();
		});
	};

	this.init = function ()
	{
		initResize(this, this.getEditorContainer(), this.opts);
	};
};

export default plugin;
