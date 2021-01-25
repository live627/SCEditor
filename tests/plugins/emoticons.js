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

test('replace()', function (assert)
{
	var codes = [
		[':)', '~happy~', ''],
		[':angel:', '~angel~', '']
	];

	var root = parsHTML(':):angel:');

	emoticons.replace(root, codes);

	assert.is(root.textContent, '~happy~~angel~');
});

test('replace() - code blocks', function (assert)
{
	var codes = [
		[':)', '~happy~', '']
	];

	var root = parsHTML('<code>:)</code>');
	emoticons.replace(root, codes);

	assert.is(root.innerHTML, '<code>:)</code>');
});

test('replace() - longest first', function (assert)
{
	var codes = [
		[':(', '~sad~', ''],
		['>:', '~grr~', ''],
		['>:(', '~angry~', '']
	];

	var root = parsHTML('>:(');

	emoticons.replace(root, codes);

	assert.is(root.textContent, '~angry~');
});

test('replace() - emoticonsCompat', function (assert)
{
	var space = '(^|\\s|\xA0|\u2002|\u2003|\u2009|$)';
	var codes = [
		[':)', '~happy~', new RegExp(space + '\:\\)' + space)],
		[':angel:', '~angel~', new RegExp(space + '\:angel\:' + space)]
	];

	var root = parsHTML(':) :):) :)t :) t:) test:)test :angel:');

	emoticons.replace(root, codes, true);

	assert.is(
		root.textContent,
		'~happy~ :):) :)t ~happy~ t:) test:)test ~angel~'
	);
});

test('checkWS() - All have whitespace', function (assert) {
	var root = parsHTML(
		'<img data-sceditor-emoticon=":)" /> test ' +
		'<img data-sceditor-emoticon=":)" /> test ' +
		'<img data-sceditor-emoticon=":)" />'
	);

	var mockRange = {
		startContainer: root.childNodes[1],
		startOffset: 2,
		collapseCalled: false,
		setStart: function (container, offset) {
			this.startContainer = container;
			this.startOffset = offset;
		},
		collapse: function () {
			this.collapseCalled = true;
		}
	};

	var mockRangeHelper = {
		selectedRange: mockRange,
		selectRangeCalled: false,
		cloneSelected: () => mockRange,
		selectRange: function (range) {
			this.selectedRange = range;
			this.selectRangeCalled = true;
		}
	};

	emoticons.checkWS(root, mockRangeHelper);

	assert.is(
		root.innerHTML,
		'<img data-sceditor-emoticon=":)"> test ' +
		'<img data-sceditor-emoticon=":)"> test ' +
		'<img data-sceditor-emoticon=":)">'
	 );

	assert.is(mockRange.startContainer, root.childNodes[1]);
	assert.is(mockRange.startOffset, 2);
	assert.false(mockRange.collapseCalled);
	assert.false(mockRangeHelper.selectRangeCalled);
});

test('checkWS() - Remove emoticons without whitespace', function (assert) {
	var root = parsHTML(
		'<img data-sceditor-emoticon=":P" /> test ' +
		'<img data-sceditor-emoticon=":)" />test ' +
		'<img data-sceditor-emoticon=":P" />'
	);

	var mockRange = {
		startContainer: root.childNodes[3],
		startOffset: 2,
		collapseCalled: false,
		setStart: function (container, offset) {
			this.startContainer = container;
			this.startOffset = offset;
		},
		collapse: function () {
			this.collapseCalled = true;
		}
	};

	var mockRangeHelper = {
		selectedRange: mockRange,
		selectRangeCalled: false,
		cloneSelected: () => mockRange,
		selectRange: function (range) {
			this.selectedRange = range;
			this.selectRangeCalled = true;
		}
	};

	emoticons.checkWS(root, mockRangeHelper);

	assert.is(
		root.innerHTML,
		'<img data-sceditor-emoticon=":P"> test ' +
		':)test ' +
		'<img data-sceditor-emoticon=":P">'
	);

	assert.is(mockRange.startContainer, root.childNodes[1]);
	assert.is(mockRange.startOffset, 10);
	assert.true(mockRange.collapseCalled);
	assert.true(mockRangeHelper.selectRangeCalled);
});

test('checkWS() - Remove cursor placed before', function (assert) {
	var root = parsHTML(
		'<img data-sceditor-emoticon=":P" /> test' +
		'<img data-sceditor-emoticon=":)" /> test ' +
		'<img data-sceditor-emoticon=":P" />'
	);

	var mockRange = {
		startContainer: root.childNodes[1],
		startOffset: 2,
		collapseCalled: false,
		setStart: function (container, offset) {
			this.startContainer = container;
			this.startOffset = offset;
		},
		collapse: function () {
			this.collapseCalled = true;
		}
	};

	var mockRangeHelper = {
		selectedRange: mockRange,
		selectRangeCalled: false,
		cloneSelected: () => mockRange,
		selectRange: function (range) {
			this.selectedRange = range;
			this.selectRangeCalled = true;
		}
	};

	emoticons.checkWS(root, mockRangeHelper);

	assert.is(
		root.innerHTML,
		'<img data-sceditor-emoticon=":P"> test' +
		':) test ' +
		'<img data-sceditor-emoticon=":P">'
	);

	assert.is(mockRange.startContainer, root.childNodes[1]);
	assert.is(mockRange.startOffset, 2);
	assert.true(mockRange.collapseCalled);
	assert.true(mockRangeHelper.selectRangeCalled);
});

test('checkWS() - Remove cursor placed after', function (assert) {
	var root = parsHTML(
		'<img data-sceditor-emoticon=":P" /> test ' +
		'<img data-sceditor-emoticon=":)" />test ' +
		'<img data-sceditor-emoticon=":P" />'
	);

	var mockRange = {
		startContainer: root,
		startOffset: 3,
		collapseCalled: false,
		setStart: function (container, offset) {
			this.startContainer = container;
			this.startOffset = offset;
		},
		collapse: function () {
			this.collapseCalled = true;
		}
	};

	var mockRangeHelper = {
		selectedRange: mockRange,
		selectRangeCalled: false,
		cloneSelected: () => mockRange,
		selectRange: function (range) {
			this.selectedRange = range;
			this.selectRangeCalled = true;
		}
	};

	emoticons.checkWS(root, mockRangeHelper);

	assert.is(
		root.innerHTML,
		'<img data-sceditor-emoticon=":P"> test ' +
		':)test ' +
		'<img data-sceditor-emoticon=":P">'
	);

	assert.is(mockRange.startContainer, root.childNodes[1]);
	assert.is(mockRange.startOffset, 8);
	assert.true(mockRange.collapseCalled);
	assert.true(mockRangeHelper.selectRangeCalled);
});
