/**
 * @param editorContainer
 */
export default function (editorContainer)
{
	var
		cover = document.createElement('div'),
		root = document.createElement('div'),

		content = function (content)
		{
			while (root.children.length > 1)
				root.removeChild(root.lastChild);

			root.appendChild(content);
		},
		show = function ()
		{
			cover.classList.add('show');
		},
		hide = function ()
		{
			cover.classList.remove('show');
		},
		click = function (e)
		{
			if (e.target.id === 'popup')
				hide();

		},
		esc = function (e)
		{
			if (e.keyCode === 27)
				hide();

		},
		destroy = function ()
		{
			document.removeEventListener('keydown', esc);
		},
		a = document.createElement('button');

	root.appendChild(a);
	cover.appendChild(root);
	editorContainer.appendChild(cover);
	root.id = 'popup-container';
	cover.id = 'popup';
	a.id = 'close';
	cover.addEventListener('click', click);
	a.addEventListener('click', hide);
	document.addEventListener('keydown', esc);

	// Expose methods
	this.show = show;
	this.hide = hide;
	this.content = content;
	this.destroy = destroy;
};
