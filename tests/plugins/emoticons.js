import test from 'ava';
import browserEnv from 'browser-env';
import * as dom from '../../src/lib/dom.js';
import Plugin from '../../src/plugins/emoticons.js';
var emoticons = new Plugin(dom);
browserEnv();
let parsHTML = function (html)
{
	var container = document.createElement('div');
	container.innerHTML = '<pre>' + html + '</pre>';

	var pre = container.firstChild;
	while (pre.firstChild)
		container.appendChild(pre.firstChild);

	container.removeChild(pre);

	return container;
};

test('replace()',t =>
{
	var codes = [
		[':)', '~happy~', ''],
		[':angel:', '~angel~', '']
	];

	var root = parsHTML(':):angel:');

	emoticons.replace(root, codes);

	t.is(root.textContent, '~happy~~angel~');
});

test('replace() - code blocks',t =>
{
	var codes = [
		[':)', '~happy~', '']
	];

	var root = parsHTML('<code>:)</code>');
	emoticons.replace(root, codes);

	t.is(root.innerHTML, '<code>:)</code>');
});

test('replace() - longest first',t =>
{
	var codes = [
		[':(', '~sad~', ''],
		['>:', '~grr~', ''],
		['>:(', '~angry~', '']
	];

	var root = parsHTML('>:(');

	emoticons.replace(root, codes);

	t.is(root.textContent, '~angry~');
});

test('replace() - emoticonsCompat',t =>
{
	var space = '(^|\\s|\xA0|\u2002|\u2003|\u2009|$)';
	var codes = [
		[':)', '~happy~', new RegExp(space + '\:\\)' + space)],
		[':angel:', '~angel~', new RegExp(space + '\:angel\:' + space)]
	];

	var root = parsHTML(':) :):) :)t :) t:) test:)test :angel:');

	emoticons.replace(root, codes, true);

	t.is(
		root.textContent,
		'~happy~ :):) :)t ~happy~ t:) test:)test ~angel~'
	);
});

test('checkWS() - All have whitespace',t =>
{
	var root = parsHTML(
		'<img data-sceditor-emoticon=":)"> test ' +
		'<img data-sceditor-emoticon=":)"> test ' +
		'<img data-sceditor-emoticon=":)">'
	);

	var mockRange = {
		startContainer: root.childNodes[1],
		startOffset: 2,
		collapseCalled: false,
		setStart: function (container, offset)
		{
			this.startContainer = container;
			this.startOffset = offset;
		},
		collapse: function ()
		{
			this.collapseCalled = true;
		}
	};

	var mockRangeHelper = {
		selectedRange: mockRange,
		selectRangeCalled: false,
		cloneSelected: () => mockRange,
		selectRange: function (range)
		{
			this.selectedRange = range;
			this.selectRangeCalled = true;
		}
	};

	emoticons.checkWS(root, mockRangeHelper);

	t.is(
		root.innerHTML,
		'<img data-sceditor-emoticon=":)"> test ' +
		'<img data-sceditor-emoticon=":)"> test ' +
		'<img data-sceditor-emoticon=":)">'
	);

	t.is(mockRange.startContainer, root.childNodes[1]);
	t.is(mockRange.startOffset, 2);
	t.false(mockRange.collapseCalled);
	t.false(mockRangeHelper.selectRangeCalled);
});

test('checkWS() - Remove emoticons without whitespace',t =>
{
	var root = parsHTML(
		'<img data-sceditor-emoticon=":P"> test ' +
		'<img data-sceditor-emoticon=":)">test ' +
		'<img data-sceditor-emoticon=":P">'
	);

	var mockRange = {
		startContainer: root.childNodes[3],
		startOffset: 2,
		collapseCalled: false,
		setStart: function (container, offset)
		{
			this.startContainer = container;
			this.startOffset = offset;
		},
		collapse: function ()
		{
			this.collapseCalled = true;
		}
	};

	var mockRangeHelper = {
		selectedRange: mockRange,
		selectRangeCalled: false,
		cloneSelected: () => mockRange,
		selectRange: function (range)
		{
			this.selectedRange = range;
			this.selectRangeCalled = true;
		}
	};

	emoticons.checkWS(root, mockRangeHelper);

	t.is(
		root.innerHTML,
		'<img data-sceditor-emoticon=":P"> test ' +
		':)test ' +
		'<img data-sceditor-emoticon=":P">'
	);

	t.is(mockRange.startContainer, root.childNodes[1]);
	t.is(mockRange.startOffset, 10);
	t.true(mockRange.collapseCalled);
	t.true(mockRangeHelper.selectRangeCalled);
});

test('checkWS() - Remove cursor placed before',t =>
{
	var root = parsHTML(
		'<img data-sceditor-emoticon=":P"> test' +
		'<img data-sceditor-emoticon=":)"> test ' +
		'<img data-sceditor-emoticon=":P">'
	);

	var mockRange = {
		startContainer: root.childNodes[1],
		startOffset: 2,
		collapseCalled: false,
		setStart: function (container, offset)
		{
			this.startContainer = container;
			this.startOffset = offset;
		},
		collapse: function ()
		{
			this.collapseCalled = true;
		}
	};

	var mockRangeHelper = {
		selectedRange: mockRange,
		selectRangeCalled: false,
		cloneSelected: () => mockRange,
		selectRange: function (range)
		{
			this.selectedRange = range;
			this.selectRangeCalled = true;
		}
	};

	emoticons.checkWS(root, mockRangeHelper);

	t.is(
		root.innerHTML,
		'<img data-sceditor-emoticon=":P"> test' +
		':) test ' +
		'<img data-sceditor-emoticon=":P">'
	);

	t.is(mockRange.startContainer, root.childNodes[1]);
	t.is(mockRange.startOffset, 2);
	t.true(mockRange.collapseCalled);
	t.true(mockRangeHelper.selectRangeCalled);
});

test('checkWS() - Remove cursor placed after',t =>
{
	var root = parsHTML(
		'<img data-sceditor-emoticon=":P"> test ' +
		'<img data-sceditor-emoticon=":)">test ' +
		'<img data-sceditor-emoticon=":P">'
	);

	var mockRange = {
		startContainer: root,
		startOffset: 3,
		collapseCalled: false,
		setStart: function (container, offset)
		{
			this.startContainer = container;
			this.startOffset = offset;
		},
		collapse: function ()
		{
			this.collapseCalled = true;
		}
	};

	var mockRangeHelper = {
		selectedRange: mockRange,
		selectRangeCalled: false,
		cloneSelected: () => mockRange,
		selectRange: function (range)
		{
			this.selectedRange = range;
			this.selectRangeCalled = true;
		}
	};

	emoticons.checkWS(root, mockRangeHelper);

	t.is(
		root.innerHTML,
		'<img data-sceditor-emoticon=":P"> test ' +
		':)test ' +
		'<img data-sceditor-emoticon=":P">'
	);

	t.is(mockRange.startContainer, root.childNodes[1]);
	t.is(mockRange.startOffset, 8);
	t.true(mockRange.collapseCalled);
	t.true(mockRangeHelper.selectRangeCalled);
});
