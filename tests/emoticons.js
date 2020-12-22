import test from 'ava';
import browserEnv from 'browser-env';
import * as emoticons from '../src/lib/emoticons.js';

browserEnv();
let parsHTML = function (html) {
	var container = document.createElement('div');
	container.innerHTML = '<pre>' + html + '</pre>';

	var pre = container.firstChild;
	while (pre.firstChild) {
		container.appendChild(pre.firstChild);
	}
	container.removeChild(pre);

	return container;
};

test('replace()', function (assert) {
	var codes = {
		':)': '~happy~',
		':angel:': '~angel~'
	};

	var root = parsHTML(':):angel:');

	emoticons.replace(root, codes);

	assert.deepEqual(root, parsHTML('~happy~~angel~'));
});

test('replace() - code blocks', function (assert) {
	var codes = {
		':)': '~happy~'
	};

	var root = parsHTML('<code>:)</code>');

	emoticons.replace(root, codes);

	assert.deepEqual(root, parsHTML('<code>:)</code>'));
});

test('replace() - longest first', function (assert) {
	var codes = {
		':(': '~sad~',
		'>:(': '~angry~',
		'>:': '~grr~'
	};

	var root = parsHTML('>:(');

	emoticons.replace(root, codes);

	assert.deepEqual(root, parsHTML('~angry~'));
});

test('replace() - emoticonsCompat', function (assert) {
	var codes = {
		':)': '~happy~',
		':angel:': '~angel~'
	};

	var root = parsHTML(':) :):) :)t :) t:) test:)test :angel:');

	emoticons.replace(root, codes, true);

	assert.deepEqual(
		root,
		parsHTML('~happy~ :):) :)t ~happy~ t:) test:)test ~angel~')
	);
});

test('replace() - emoticonsCompat regex key', function (assert) {
	var codes = {
		'[^1-9]': '~happy~'
	};

	var root = parsHTML('[^1-9]');

	emoticons.replace(root, codes, true);

	assert.deepEqual(root, parsHTML('~happy~'));
});

test('checkWhitespace() - All have whitespace', function (assert) {
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

	emoticons.checkWhitespace(root, mockRangeHelper);

	assert.deepEqual(root.childNodes, parsHTML(
		'<img data-sceditor-emoticon=":)" /> test ' +
		'<img data-sceditor-emoticon=":)" /> test ' +
		'<img data-sceditor-emoticon=":)" />'
	).childNodes);

	assert.is(mockRange.startContainer, root.childNodes[1]);
	assert.is(mockRange.startOffset, 2);
	assert.false(mockRange.collapseCalled);
	assert.false(mockRangeHelper.selectRangeCalled);
});

test('checkWhitespace() - Remove emoticons without whitespace', function (assert) {
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

	emoticons.checkWhitespace(root, mockRangeHelper);

	assert.deepEqual(root.childNodes, parsHTML(
		'<img data-sceditor-emoticon=":P" /> test ' +
		':)test ' +
		'<img data-sceditor-emoticon=":P" />'
	).childNodes);

	assert.is(mockRange.startContainer, root.childNodes[1]);
	assert.is(mockRange.startOffset, 10);
	assert.true(mockRange.collapseCalled);
	assert.true(mockRangeHelper.selectRangeCalled);
});

test('checkWhitespace() - Remove cursor placed before', function (assert) {
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

	emoticons.checkWhitespace(root, mockRangeHelper);

	assert.deepEqual(root.childNodes, parsHTML(
		'<img data-sceditor-emoticon=":P" /> test' +
		':) test ' +
		'<img data-sceditor-emoticon=":P" />'
	).childNodes);

	assert.is(mockRange.startContainer, root.childNodes[1]);
	assert.is(mockRange.startOffset, 2);
	assert.true(mockRange.collapseCalled);
	assert.true(mockRangeHelper.selectRangeCalled);
});

test('checkWhitespace() - Remove cursor placed after', function (assert) {
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

	emoticons.checkWhitespace(root, mockRangeHelper);

	assert.deepEqual(root.childNodes, parsHTML(
		'<img data-sceditor-emoticon=":P" /> test ' +
		':)test ' +
		'<img data-sceditor-emoticon=":P" />'
	).childNodes);

	assert.is(mockRange.startContainer, root.childNodes[1]);
	assert.is(mockRange.startOffset, 8);
	assert.true(mockRange.collapseCalled);
	assert.true(mockRangeHelper.selectRangeCalled);
});
