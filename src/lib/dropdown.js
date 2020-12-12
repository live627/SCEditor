export default function (editorContainer) {
	var
		root = document.createElement('div'),

		content = function (content) {
			root.innerHTML = '';
			root.appendChild(content);
		},
		click = function (e) {
			if (e.button == 1) {
				hide();
			}
		},
		show = function (target) {
			reposition(target);
			root.classList.add('show');
			document.addEventListener('click', click);
			document.addEventListener('keydown', esc);
		},
		reposition = function (target) {
			var
				tgtWidth = target.offsetWidth / 2,
				posLeft = target.offsetLeft + tgtWidth - (root.offsetWidth / 2),
				posTop  = target.offsetTop - root.offsetHeight - 20,
				cls = [];

			if (posLeft < 0) {
				posLeft = target.offsetLeft + tgtWidth - 20;
				cls[cls.length] = 'left';
			}
			if (posLeft + root.offsetWidth > window.innerWidth) {
				posLeft = target.offsetLeft - root.offsetWidth + tgtWidth + 20;
				cls[cls.length] = 'right';
			}
			if (posTop < 0) {
				posTop  = target.offsetTop + target.offsetHeight;
				cls[cls.length] = 'top';
			}
			root.style.left = posLeft + 'px';
			root.style.top = posTop + 'px';
			root.className = cls.join(' ');
		},
		hide = function () {
			root.classList.remove('show');
			document.removeEventListener('click', click);
			document.removeEventListener('keydown', esc);
		},
		esc = function (e) {
			if (e.keyCode == 27) {
				hide();
			}
		};
	editorContainer.appendChild(root);
	root.addEventListener('click', function (e) {
		// stop clicks within the dropdown from being handled
		e.stopPropagation();
	});
	root.id = 'tooltip';

	// Expose methods
	this.show = show;
	this.hide = hide;
	this.content = content;
};
