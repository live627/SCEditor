import * as dom from './dom.js';

/**
 * Checks all emoticons are surrounded by whitespace and
 * replaces any that aren't with with their emoticon code.
 *
 * @param {HTMLElement} node
 * @param {rangeHelper} rangeHelper
 * @return {void}
 */
export function checkWhitespace(node, rangeHelper) {
	var noneWsRegex = /[^\s\xA0\u2002\u2003\u2009\u00a0]+/;
	var emoticons = node && dom.find(node, 'img[data-sceditor-emoticon]');

	if (!node || !emoticons.length)
		return;


	for (var i = 0; i < emoticons.length; i++) {
		var emoticon = emoticons[i];
		var parent = emoticon.parentNode;
		var prev = emoticon.previousSibling;
		var next = emoticon.nextSibling;

		if ((!prev || !noneWsRegex.test(prev.nodeValue.slice(-1))) &&
			(!next || !noneWsRegex.test((next.nodeValue || '')[0])))
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
		if (rangeStart > -1) {
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
 * @param {HTMLElement} root
 * @param {Object<string, string>} emoticons
 * @param {boolean} emoticonsCompat
 * @return {void}
 */
export function replace(root, emoticons, emoticonsCompat) {
	var	doc           = root.ownerDocument;

	// TODO: Make this tag configurable.
	if (dom.parent(root, 'code'))
		return;


	(function convert(node) {
		node = node.firstChild;

		while (node) {
			// TODO: Make this tag configurable.
			if (node.nodeType === dom.ELEMENT_NODE && !dom.is(node, 'code'))
				convert(node);


			if (node.nodeType === dom.TEXT_NODE)
				// Loop emoticons in reverse so that shorter codes won't
				// partially match longer ones (they already got sorted)
				for (var i = emoticons.length - 1; i >= 0; i--) {
					var text  = node.nodeValue;
					var key   = emoticons[i][0];
					var index = emoticonsCompat ?
						text.search(emoticons[i][2]) :
						text.indexOf(key);

					if (index > -1) {
						// When emoticonsCompat is enabled this will be the
						// position after any white space
						var startIndex = text.indexOf(key, index);
						var fragment   = dom.parseHTML(emoticons[i][1], doc);
						var after      = text.substr(startIndex + key.length);

						fragment.appendChild(doc.createTextNode(after));

						node.nodeValue = text.substr(0, startIndex);
						node.parentNode
							.insertBefore(fragment, node.nextSibling);
					}
				}


			node = node.nextSibling;
		}
	}(root));
};
