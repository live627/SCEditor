import icons from './famfamfam-icons.js';

export default function ()
{
	var colorPath;

	return {
		icons: icons,
		name: 'famfamfam',
		create: command =>
		{
			var
				n = 'http://www.w3.org/2000/svg',
				svg = document.createElementNS(n,'svg'),
				i = document.createElementNS(n,'image');
			if (command in icons)
			{
				i.setAttribute('href', 'data:image/png;base64,' + icons[command]);
				i.setAttribute('width', 16);
				i.setAttribute('height', 16);
				svg.appendChild(i);
				if (command === 'color')
				{
					i.setAttribute('x', 1);
					i.setAttribute('height', 14);
					colorPath = document.createElementNS(n,'path');
					colorPath.setAttribute('d', 'M2 13h12v2H2z');
					svg.appendChild(colorPath);
				}
			}

			return svg;
		},
		update: (isSourceMode, currentNode) =>
		{
			if (colorPath)
			{
				var color = 'inherit';

				if (!isSourceMode && currentNode)
					color = currentNode.ownerDocument.queryCommandValue('forecolor');

				colorPath.setAttribute('fill', color);
			}
		}
	};
};
