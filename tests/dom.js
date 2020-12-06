import test from 'ava';
import browserEnv from 'browser-env';
import * as dom from '../src/lib/dom.js';

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
let parseHTMLFragment = function (html) {
	var container = parsHTML(html);
	var frag      = document.createDocumentFragment();

	while (container.firstChild) {
		frag.appendChild(container.firstChild);
	}

	return frag;
};
browserEnv();
Object.defineProperties(window.HTMLElement.prototype, {
  offsetLeft: {
    get: function() { return parseFloat(window.getComputedStyle(this).marginLeft) || 0; }
  },
  offsetTop: {
    get: function() { return parseFloat(window.getComputedStyle(this).marginTop) || 0; }
  },
  offsetHeight: {
    get: function() { return parseFloat(window.getComputedStyle(this).height) || 0; }
  },
  offsetWidth: {
    get: function() { return parseFloat(window.getComputedStyle(this).width) || 0; }
  }
});
window.Element.prototype.getClientRects = function() {
    var node = this;
    while(node) {
        if(node === document) {
            break;
        }
        // don't know why but style is sometimes undefined
        if (!node.style || node.style.display === 'none' || node.style.visibility === 'hidden') {
            return [];
        }
        node = node.parentNode;
    }
    return [{width: this.offsetWidth, height: this.offsetHeight}];
};
var obj = {
	startNode: null,
	endNode: null,
  };
  global.document.createRange = () => Object.create({
    setStart: () => {},
    setEnd: () => {},
    setStartBefore: node => obj.startNode = node,
    setEndAfter: node => obj.endNode = node,
    commonAncestorContainer: {
      nodeName: 'BODY',
      ownerDocument: document,
    },
    extractContents: () => {
  var frag = document.createDocumentFragment();
    var node = obj.startNode;
    while(node) {
  frag.appendChild(node);
        node = node.nextSibling;
        if(node === obj.endNode)
            break;
    }
    return frag;
    },
  });

test('createElement() - Simple', function (assert) {
	var node = dom.createElement('div');
	assert.truthy(node, 'Is defined');
	assert.is(node.tagName.toLowerCase(), 'div', 'TagName');
});

test('createElement() - Attributes', function (assert) {
	var node = dom.createElement('div', {
		contentEditable: true,
		'data-test': 'value'
	});

	assert.truthy(node, 'Is defined');
	//~ assert.true(node.isContentEditable, 'Is contentEditable');
	assert.true(node.hasAttribute('data-test'), 'Has attribute');
	assert.is(node.getAttribute('data-test'), 'value', 'Attribute value');
});

test('createElement() - Style', function (assert) {
	var node = dom.createElement('div', {
		style: 'font-size: 100px; font-weight: bold'
	});

	assert.truthy(node, 'Is defined');
	assert.is(node.style.fontSize, '100px', 'Font size');
	assert.is(node.style.fontWeight, 'bold', 'Font weight');
});

test('parents()', function (assert) {
	var div = document.createElement('div');
	var p = document.createElement('p');
	var a = document.createElement('a');

	div.appendChild(p);
	p.appendChild(a);

	assert.deepEqual(dom.parents(a), [p, div], 'No selector');
	assert.deepEqual(dom.parents(a, 'p'), [p], 'Simple selector');
	assert.deepEqual(dom.parents(a, 'p,div,em'), [p, div], 'Complex selector');
});

test('parent()', function (assert) {
	var div = document.createElement('div');
	var p = document.createElement('p');

	div.appendChild(p);

	assert.falsy(dom.parent(p, 'p'), 'Paragraph');
	assert.is(dom.parent(p, 'div'), div, 'Div');
});

test('closest()', function (assert) {
	var div = document.createElement('div');
	var p = document.createElement('p');

	div.appendChild(p);

	assert.is(dom.closest(p, 'p'), p, 'Paragraph');
	assert.is(dom.closest(p, 'div'), div, 'Div');
	assert.falsy(dom.closest(p, 'input'), 'No match');
});

test('appendChild()', function (assert) {
	var div = document.createElement('div');
	var p = document.createElement('p');

	div.appendChild(p);

	dom.remove(p);

	assert.falsy(p.parentNode);
	assert.falsy(div.firstChild);
});

test('appendChild() 2', function (assert) {
	var div = document.createElement('div');
	var p = document.createElement('p');

	dom.appendChild(div, p);

	assert.is(div.firstChild, p);
});

test('find()', function (assert) {
	var div = document.createElement('div');
	var p = document.createElement('p');
	var a = document.createElement('a');
	var text = document.createTextNode('');

	div.appendChild(p);
	div.appendChild(a);
	div.appendChild(text);

	var paragraphs = dom.find(div, 'p');
	assert.is(paragraphs.length, 1, 'Select paragraphs');

	var nodes = dom.find(div, '*');
	assert.is(nodes.length, 2, 'Select all');
});

test('on()', function (assert) {
	var div = document.createElement('div');
	var called = false;

	dom.on(div, 'test', function () {
		called = true;
	});

	dom.trigger(div, 'test');
	assert.true(called);
});

test('on() - Selector', function (assert) {
	var div = document.createElement('div');
	var p = document.createElement('p');
	var called = false;

	div.appendChild(p);

	dom.on(div, 'test', 'p', function () {
		called = true;
	});

	dom.trigger(div, 'test');
	assert.false(called, 'Not matching selector');

	dom.trigger(p, 'test');
	assert.true(called, 'Matching selector');
});

test('off()', function (assert) {
	var div = document.createElement('div');
	var called = false;
	var fn = function () {
		called = true;
	};

	dom.on(div, 'test', fn);
	dom.off(div, 'test', fn);

	dom.trigger(div, 'test');
	assert.false(called);
});

test('off() - Selector', function (assert) {
	var div = document.createElement('div');
	var p = document.createElement('p');
	var called = false;
	var fn = function () {
		called = true;
	};

	div.appendChild(p);

	dom.on(div, 'test', 'p', fn);
	dom.off(div, 'test', 'p', fn);

	dom.trigger(div, 'test');
	assert.false(called, 'Not matching selector');

	dom.trigger(p, 'test');
	assert.false(called, 'Matching selector');
});

test('attr()', function (assert) {
	var div = document.createElement('div');

	dom.attr(div, 'test', 'value');
	assert.true(div.hasAttribute('test'), 'Add attribute');

	assert.is(dom.attr(div, 'test'), 'value', 'Get attribute');

	dom.attr(div, 'test', 'new-value');
	assert.is(div.getAttribute('test'), 'new-value', 'Add attribute');

	dom.attr(div, 'test', null);
	assert.false(div.hasAttribute('test'), 'Remove attribute');
});

test('removeAttr()', function (assert) {
	var div = document.createElement('div');

	div.setAttribute('test', 'test');

	assert.true(div.hasAttribute('test'));
	dom.removeAttr(div, 'test');
	assert.false(div.hasAttribute('test'));
});

test('hide()', function (assert) {
	var div = document.createElement('div');

	dom.hide(div);
	assert.is(div.style.display, 'none', 'Should hide node');
});

test('show()', function (assert) {
	var div = document.createElement('div');

	div.style.display = 'none';

	dom.show(div);
	assert.is(div.style.display, '', 'Should show node');
});

test('toggle()', function (assert) {
	var div = document.createElement('div');

	dom.toggle(div);
	assert.is(div.style.display, 'none', 'Should hide node');

	dom.toggle(div);
	assert.is(div.style.display, '', 'Should show node');
});

test('css()', function (assert) {
	var div = document.createElement('div');

	dom.css(div, 'width', 100);
	assert.is(div.style.width, '100px', 'Convert numbers into pixels');

	dom.css(div, { width: 32 });
	assert.is(div.style.width, '32px', 'Set object');

	dom.css(div, 'width', '110px');
	assert.is(div.style.width, '110px', 'Set pixels');

	dom.css(div, 'width', '10em');
	assert.is(div.style.width, '10em', 'Set em');

	dom.css(div, 'width', '50%');
	assert.is(div.style.width, '50%', 'Set percent');

	assert.is(
		dom.css(window, 'width'),
		null,
		'Get computed value of window'
	);
});

test('data()', function (assert) {
	var text = document.createTextNode('');
	var div = document.createElement('div');
	div.setAttribute('data-test', 'test');
	div.setAttribute('data-another-test', 'test');
	div.setAttribute('ignored', 'test');

	assert.deepEqual(dom.data(div), {
		'another-test': 'test',
		'test': 'test'
	});
	assert.is(dom.data(div, 'test'), 'test');
	assert.is(dom.data(div, 'another-test'), 'test');

	dom.data(div, 'test', 'new-value');
	assert.is(dom.data(div, 'test'), 'new-value');

	dom.data(div, 'test', 1);
	assert.is(dom.data(div, 'test'), '1');

	dom.data(text, 'test', 'test');
	assert.is(dom.data(text, 'test'), undefined);
});

test('is()', function (assert) {
	var div = document.createElement('div');
	div.className = 'test';

	assert.true(dom.is(div, 'div'));
	assert.true(dom.is(div, '.test'));
	assert.false(dom.is());
	assert.false(dom.is(null));
	assert.false(dom.is(div, 'p'));
	assert.false(dom.is(div, '.testing'));
});

test('remove()', function (assert) {
	var parent = document.createElement('div');
	var child = document.createElement('div');

	parent.appendChild(child);
	dom.remove(child);

	assert.falsy(child.parentNode);

	// Make sure doesn't throw if has no parent
	dom.remove(child);
});

test('contains()', function (assert) {
	var parent = document.createElement('div');
	var child = document.createElement('div');

	parent.appendChild(child);

	assert.true(dom.contains(parent, child));
	assert.false(dom.contains(parent, parent));
	assert.false(dom.contains(child, parent));
});

test('insertBefore()', function (assert) {
	var parent = document.createElement('div');
	var ref = document.createElement('div');
	var first = document.createElement('div');

	parent.appendChild(ref);

	dom.insertBefore(first, ref);

	assert.is(parent.firstChild, first);
});

test('insertBefore() 2', function (assert) {
	var parent = document.createElement('div');
	var first = document.createElement('div');
	var last = document.createElement('div');

	parent.appendChild(first);
	parent.appendChild(last);

	assert.is(dom.previousElementSibling(last), first);
	assert.is(dom.previousElementSibling(last, 'div'), first);
	assert.is(dom.previousElementSibling(last, 'p'), null);
	assert.is(dom.previousElementSibling(first), null);
});

test('hasClass()', function (assert) {
	var div = document.createElement('div');

	div.className = 'test';

	assert.is(dom.hasClass(div, 'another-test'), false);
	assert.is(dom.hasClass(div, 'test'), true);
});

test('removeClass()', function (assert) {
	var div = document.createElement('div');

	div.className = 'test another-test';

	dom.removeClass(div, 'another-test');
	assert.is(div.className.trim(), 'test');

	dom.removeClass(div, 'test');
	assert.is(div.className.trim(), '');
});

test('addClass()', function (assert) {
	var div = document.createElement('div');

	dom.addClass(div, 'test');
	assert.is(div.className.trim(), 'test');

	dom.addClass(div, 'another-test');
	assert.is(div.className.trim(), 'test another-test');
});

test('toggleClass()', function (assert) {
	var div = document.createElement('div');

	dom.toggleClass(div, 'test');
	assert.is(div.className.trim(), 'test', 'Add class');

	dom.toggleClass(div, 'test');
	assert.is(div.className, '', 'Remove class');

	dom.toggleClass(div, 'test', true);
	dom.toggleClass(div, 'test', true);
	assert.is(div.className.trim(), 'test', 'Add class via state');

	dom.toggleClass(div, 'test', false);
	dom.toggleClass(div, 'test', false);
	assert.is(div.className, '', 'Remove class via state');
});

test('width()', function (assert) {
	var div = document.createElement('div');
	dom.width(div, 100);
	assert.is(div.style.width, '100px', 'Number width');

	dom.width(div, '10em');
	assert.is(div.style.width, '10em', 'Em width');

	dom.width(div, '100px');
	assert.is(dom.width(div), 100, 'Get width');
});

test('height()', function (assert) {
	var div = document.createElement('div');

	dom.height(div, 100);
	assert.is(div.style.height, '100px', 'Number height');

	dom.height(div, '10em');
	assert.is(div.style.height, '10em', 'Em height');

	dom.height(div, '100px');
	assert.is(dom.height(div), 100, 'Get height');
});

test('trigger()', function (assert) {
	var div = document.createElement('div');
	var detail = {};

	div.addEventListener('custom-event', function (e) {
		assert.is(e.detail, detail);
	});

	dom.trigger(div, 'custom-event', detail);
});

test('isVisible()', function (assert) {
	var div = document.createElement('div');

	dom.width(div, 100);
	dom.hide(div);
	assert.is(dom.isVisible(div), false, 'Should be false when hidden');

	dom.show(div);
	assert.is(dom.isVisible(div), true, 'Should be true when visible');

	dom.hide(div);
	assert.is(dom.isVisible(div), false, 'Deattached should be false');
});

test('traverse()', function (assert) {
	var result = '';
	var node   = parsHTML(
		'<code><b>1</b><b>2</b><b>3</b><span><b>4</b><b>5</b></span></code>'
	);

	dom.traverse(node, function (node) {
		if (node.nodeType === 3) {
			result += node.nodeValue;
		}
	});

	assert.is(result, '12345');
});

test('traverse() - Innermost first', function (assert) {
	var result = '';
	var node   = parsHTML(
		'<code><span><b></b></span><span><b></b><b></b></span></code>'
	);

	dom.traverse(node, function (node) {
		result += node.nodeName.toLowerCase() + ':';
	}, true);

	assert.is(result, 'b:span:b:b:span:code:');
});

test('traverse() - Siblings only', function (assert) {
	var result = '';
	var node   = parsHTML(
		'1<span>ignore</span>2<span>ignore</span>3'
	);

	dom.traverse(node, function (node) {
		if (node.nodeType === 3) {
			result += node.nodeValue;
		}
	}, false, true);

	assert.is(result, '123');
});

test('rTraverse()', function (assert) {
	var result = '';
	var node   = parsHTML(
		'<code><b>1</b><b>2</b><b>3</b><span><b>4</b><b>5</b></span></code>'
	);

	dom.rTraverse(node, function (node) {
		if (node.nodeType === 3) {
			result += node.nodeValue;
		}
	});

	assert.is(result, '54321');
});


test('parseHTML()', function (assert) {
	var result = dom.parseHTML(
		'<span>span<div style="font-weight: bold;">div</div>span</span>'
	);

	assert.is(result.nodeType, dom.DOCUMENT_FRAGMENT_NODE);
	assert.is(result.childNodes.length, 1);
	assert.deepEqual(
		result.firstChild,
		parsHTML(
			'<span>span<div style="font-weight: bold;">div</div>span</span>'
		).childNodes[0]
	);
});

test('parseHTML() - Parse multiple', function (assert) {
	var result = dom.parseHTML(
		'<span>one</span><span>two</span><span>three</span>'
	);

	assert.is(result.nodeType, dom.DOCUMENT_FRAGMENT_NODE);
	assert.is(result.childNodes.length, 3);
});


test('hasStyling()', function (assert) {
	var node = parsHTML('<pre></pre>').childNodes[0];

	assert.true(dom.hasStyling(node));
});

test('hasStyling() - Non-styled div', function (assert) {
	var node = parsHTML('<div></div>').childNodes[0];

	assert.false(dom.hasStyling(node));
});

test('hasStyling() - Div with class', function (assert) {
	var node = parsHTML('<div class="test"></div>').childNodes[0];

	assert.true(dom.hasStyling(node));
});

test('hasStyling() - Div with style attribute', function (assert) {
	var node = parsHTML('<div style="color: red;"></div>').childNodes[0];

	assert.true(dom.hasStyling(node));
});

test('convertElement()', function (assert) {
	var node = parsHTML(
		'<i style="font-weight: bold;">' +
			'span' +
			'<div>' +
				'div' +
			'</div>' +
			'span' +
		'</i>'
	);

	var newNode = dom.convertElement(node.firstChild, 'em');

	assert.is(newNode, node.firstChild);

	assert.deepEqual(
		newNode,
		parsHTML(
			'<em style="font-weight: bold;">' +
				'span' +
				'<div>' +
					'div' +
				'</div>' +
				'span' +
			'</em>'
		).childNodes[0]
	);
});

test('convertElement() - Invalid attribute name', function (assert) {
	var node = parsHTML(
		'<i size"2"="" good="attr">test</i>'
	);

	var newNode = dom.convertElement(node.firstChild, 'em');

	assert.is(newNode, node.firstChild);

	assert.deepEqual(
		newNode,
		parsHTML(
			'<em good="attr">test</em>'
		).childNodes[0]
	);
});

/*
test('fixNesting() - With styling', function (assert) {
	var node = parsHTML(
		'<span style="font-weight: bold;">' +
			'span' +
			'<div>' +
				'div' +
			'</div>' +
			'span' +
		'</span>'
	);

	dom.fixNesting(node);

	assert.deepEqual(
		node,
		parsHTML(
			'<span style="font-weight: bold;">' +
				'span' +
			'</span>' +
			'<div style="font-weight: bold;">' +
				'div' +
			'</div>' +
			'<span style="font-weight: bold;">' +
				'span' +
			'</span>'
		)
	);
});

test('fixNesting() - Deeply nested', function (assert) {
	var node = parsHTML(
		'<span>' +
			'span' +
			'<span>' +
				'span' +
				'<div style="font-weight: bold;">' +
					'div' +
				'</div>' +
				'span' +
			'</span>' +
			'span' +
		'</span>'
	);

	dom.fixNesting(node);

	assert.deepEqual(
		node,
		parsHTML(
			'<span>' +
				'span' +
				'<span>' +
					'span' +
				'</span>' +
			'</span>' +
			'<div style="font-weight: bold;">' +
				'div' +
			'</div>' +
			'<span>' +
				'<span>' +
					'span' +
				'</span>' +
				'span' +
			'</span>'
		)
	);
});
*/
test('fixNesting() - Nested list', function (assert) {
	var node = parsHTML(
		'<ul>' +
			'<li>first</li>' +
			'<ol><li>middle</li></ol>' +
			'<li>second</li>' +
		'</ul>'
	);

	dom.fixNesting(node);

	assert.deepEqual(
		node,
		parsHTML(
			'<ul>' +
				'<li>first' +
					'<ol><li>middle</li></ol>' +
				'</li>' +
				'<li>second</li>' +
			'</ul>'
		)
	);
});

test('fixNesting() - Nested list, no previous item', function (assert) {
	var node = parsHTML(
		'<ul>' +
			'<ol><li>middle</li></ol>' +
			'<li>first</li>' +
		'</ul>'
	);

	dom.fixNesting(node);

	assert.deepEqual(
		node,
		parsHTML(
			'<ul>' +
				'<li>' +
					'<ol><li>middle</li></ol>' +
				'</li>' +
				'<li>first</li>' +
			'</ul>'
		)
	);
});

test('fixNesting() - Deeply nested list', function (assert) {
	var node = parsHTML(
		'<ul>' +
			'<li>one</li>' +
			'<ul>' +
				'<li>two</li>' +
				'<ul>' +
					'<li>three</li>' +
				'</ul>' +
			'</ul>' +
		'</ul>'
	);

	dom.fixNesting(node);

	assert.deepEqual(
		node,
		parsHTML(
			'<ul>' +
				'<li>one' +
					'<ul>' +
						'<li>two' +
							'<ul>' +
								'<li>three</li>' +
							'</ul>' +
						'</li>' +
					'</ul>' +
				'</li>' +
			'</ul>'
		)
	);
});

test('removeWhiteSpace() - Preserve line breaks', function (assert) {
	var node = parsHTML(
		'<div style="white-space: pre-line">    ' +
			'<span>  \n\ncontent\n\n  </span>\n\n  ' +
		'</div><div></div>'
	);

	dom.removeWhiteSpace(node);

	assert.deepEqual(
		node,
		parsHTML(
			'<div style="white-space: pre-line">' +
				'<span>\n\ncontent\n\n </span>\n\n' +
			'</div><div></div>'
		)
	);
});

test('removeWhiteSpace() - Ignore marker spaces', function (assert) {
	var node = parsHTML(
		'aa ' +
			'<b>bb' +
				'<span id="sceditor-start-marker" ' +
					'class="sceditor-selection sceditor-ignore" ' +
					'style="display: none; line-height: 0;"> </span>' +
				'<span id="sceditor-end-marker" ' +
					'class="sceditor-selection sceditor-ignore" ' +
					'style="display: none; line-height: 0;"> </span>' +
			'</b>' +
		' aa'
	);

	dom.removeWhiteSpace(node);

	assert.deepEqual(
		node,
		parsHTML(
			'aa ' +
				'<b>bb' +
					'<span id="sceditor-start-marker" ' +
						'class="sceditor-selection sceditor-ignore" ' +
						'style="display: none; line-height: 0;"> </span>' +
					'<span id="sceditor-end-marker" ' +
						'class="sceditor-selection sceditor-ignore" ' +
						'style="display: none; line-height: 0;"> </span>' +
				'</b>' +
			' aa'
		)
	);
});

test(
	'removeWhiteSpace() - Siblings with start and end spaces',
	function (assert) {
		var html = '<span>  test</span><span>  test  </span>';
		var node = parsHTML(html);

		// Must move to a fragment as the other HTML on the QUnit test page
		// interferes with this test
		var frag = document.createDocumentFragment();
		frag.appendChild(node);

		dom.removeWhiteSpace(node);

		assert.is(
			node.innerHTML.toLowerCase(),
			'<span>test</span><span> test</span>'
		);
	}
);

test(
	'removeWhiteSpace() - Block then span with start spaces',
	function (assert) {
		var html = '<div>test</div><span>  test  </span>';
		var node = parsHTML(html);

		// Must move to a fragment as the other HTML on the QUnit test page
		// interferes with this test
		var frag = document.createDocumentFragment();
		frag.appendChild(node);

		dom.removeWhiteSpace(node);

		assert.is(
			node.innerHTML.toLowerCase(),
			'<div>test</div><span>test</span>'
		);
	}
);

test(
	'removeWhiteSpace() - Divs with start and end spaces',
	function (assert) {
		var html = '<div>  test  </div><div>  test  </div>';
		var node = parsHTML(html);

		// Must move to a fragment as the other HTML on the QUnit test page
		// interferes with this test
		var frag = document.createDocumentFragment();
		frag.appendChild(node);

		dom.removeWhiteSpace(node);

		assert.is(
			node.innerHTML.toLowerCase(),
			'<div>test</div><div>test</div>'
		);
	}
);

test('removeWhiteSpace() - New line chars', function (assert) {
	var html = '<span>\ntest\n\n</span><span>\n\ntest\n</span>';
	var node = parsHTML(html);

	// Must move to a fragment as the other HTML on the QUnit test page
	// interferes with this test
	var frag = document.createDocumentFragment();
	frag.appendChild(node);

	dom.removeWhiteSpace(node);

	assert.is(
		node.innerHTML.toLowerCase(),
		'<span>test </span>' +
		'<span>test</span>'
	);
});

test('removeWhiteSpace() - With .sceditor-ignore siblings', function (assert) {
	var node = parsHTML(
		'<span>test</span>' +
		'<span class="sceditor-ignore">  test  </span>' +
		'<span>  test</span>'
	);

	dom.removeWhiteSpace(node);

	assert.is(
		node.innerHTML.toLowerCase(),
		'<span>test</span>' +
		'<span class="sceditor-ignore"> test </span>' +
		'<span> test</span>'
	);
});

test('removeWhiteSpace() - Nested span space', function (assert) {
	var node = parsHTML(
		'<div>' +
			'<div>    <span>  \t\t\t\t </span>\t\t\t</div> ' +
			'<div>  </div>' +
		'</div>'
	).childNodes[0];

	dom.removeWhiteSpace(node);

	assert.is(
		node.innerHTML.toLowerCase(),
		'<div><span></span> </div><div></div>'
	);
});

test('removeWhiteSpace() - Pre tag', function (assert) {
	var node = parsHTML(
		'<pre>    <span>  \t\tcontent\t\t </span>\t\t\t</pre>'
	);

	dom.removeWhiteSpace(node);

	assert.is(
		node.innerHTML.toLowerCase(),
		'<pre>    <span>  \t\tcontent\t\t </span>\t\t\t</pre>'
	);
});

test('removeWhiteSpace() - Deeply nested siblings', function (assert) {
	var node = parsHTML(
		'<span>' +
			'<span>' +
				'<span>' +
					'<span>test  </span>' +
				'</span>' +
			'</span>' +
		'</span>' +
		'<span>' +
			'<span>' +
				'<span>' +
					'<span>' +
						'<span>  test  </span>' +
					'</span>' +
				'</span>' +
			'</span>' +
		'</span>' +
		'<span>  test</span>'
	);

	dom.removeWhiteSpace(node);

	assert.is(
		node.innerHTML.toLowerCase(),
		'<span>' +
			'<span>' +
				'<span>' +
					'<span>test </span>' +
				'</span>' +
			'</span>' +
		'</span>' +
		'<span>' +
			'<span>' +
				'<span>' +
					'<span>' +
						'<span>test </span>' +
					'</span>' +
				'</span>' +
			'</span>' +
		'</span>' +
		'<span>test</span>'
	);
});

test('removeWhiteSpace() - Text next to image', function (assert) {
	var node = parsHTML(
		'<div>test  <img src="../../emoticons/smile.png">  test.</div>'
	);

	dom.removeWhiteSpace(node);

	assert.deepEqual(
		node,
		parsHTML(
			'<div>test <img src="../../emoticons/smile.png"> test.</div>'
		)
	);
});

function isNode(o){
  return (
    typeof Node === "object" ? o instanceof Node : 
    o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName==="string"
  );
}
function isElement(o){
  return (
    typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
    o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
);
}
/*
test('extractContents()', function (assert) {
	var node  = parsHTML(
		'<div>' +
			'<span>ignored</span>' +
			'<div id="start">' +
				'<span>test</span>' +
			'</div>' +
			'<span>test</span>' +
			'<span id="end">end</span>' +
			'<span>ignored</span>' +
		'</div>'
	);
	var start = dom.find(node, '#start')[0];
	var end   = dom.find(node, '#end')[0];
	assert.true(isElement(start));
	assert.true(isElement(end));
	var container = document.createElement('div');
		container.appendChild(
		dom.extractContents(start, end));
	assert.true(container.innerHTML);
	assert.is(
		dom.extractContents(start, end),
		parseHTMLFragment(
			'<div id="start">' +
				'<span>test</span>' +
			'</div>' +
			'<span>test</span>'
		)
	);
});

test('extractContents() - End inside start', function (assert) {
	var node  = parsHTML(
		'<div>' +
			'<span>ignored</span>' +
			'<div id="start">' +
				'<span>test</span>' +
				'<span>test</span>' +
				'<span id="end">end</span>' +
				'<span>ignored</span>' +
			'</div>' +
			'<span>ignored</span>' +
		'</div>'
	);
	var start = dom.find(node, '#start')[0];
	var end   = dom.find(node, '#end')[0];
	assert.true(isElement(start));
	assert.true(isElement(end));
	assert.is(
		dom.extractContents(start, end),
		parseHTMLFragment(
			'<div id="start">' +
				'<span>test</span>' +
				'<span>test</span>' +
			'</div>'
		)
	);
});

test('extractContents() - Start inside end', function (assert) {
	var node  = parsHTML(
		'<div>' +
			'<span>ignored</span>' +
			'<div id="end">' +
				'<span>ignored</span>' +
				'<span>ignored</span>' +
				'<span id="start">start</span>' +
				'<span>test</span>' +
			'</div>' +
			'<span>ignored</span>' +
		'</div>'
	);
	var start = dom.find(node, '#start')[0];
	var end   = dom.find(node, '#end')[0];
	assert.true(isElement(start));
	assert.true(isElement(end));
	assert.is(
		dom.extractContents(start, end).innerHTML.toLowerCase(),
		'<div id="end"><span id="start">start</span><span>test</span></div>'
	);
	assert.is(
		node.innerHTML.toLowerCase(),
		'<div>' +
			'<span>ignored</span>' +
			'<div id="end">' +
				'<span>ignored</span>' +
				'<span>ignored</span>' +
			'</div>' +
			'<span>ignored</span>' +
		'</div>'
	);
});
*/
test('getStyle()', function (assert) {
	var node = parsHTML(
		'<div style="font-weight: bold; font-size: 10px;' +
		'text-align: right;">test</div>'
	).childNodes[0];
	assert.is(
		dom.getStyle(node, 'font-weight'),
		'bold',
		'Normal CSS property'
	);
	assert.is(
		dom.getStyle(node, 'fontSize'),
		'10px',
		'Camel case CSS property'
	);
	assert.is(
		dom.getStyle(node, 'text-align'),
		'right',
		'Text-align'
	);
	assert.is(
		dom.getStyle(node, 'color'),
		'',
		'Undefined CSS property'
	);
});

test('getStyle() - Normalise text-align', function (assert) {
	var node = parsHTML(
		'<div style="direction: rtl;text-align: right;">test</div>'
	).childNodes[0];

	// If direction is left-to-right and text-align is right,
	// it shouldn't return anything.
	assert.is(dom.getStyle(node, 'direction'), 'rtl');
	assert.is(dom.getStyle(node, 'textAlign'), '');
});

test('getStyle() - No style attribute', function (assert) {
	var node = parsHTML('<div>test</div>').childNodes[0];

	assert.is(dom.getStyle(node, 'color'), '');
});


test('hasStyle()', function (assert) {
	var node = parsHTML(
		'<div style="font-weight: bold;">test</div>'
	).childNodes[0];
	assert.is(node.style.cssText, 'font-weight: bold;');
	assert.true(
		dom.hasStyle(node, 'font-weight'),
		'Normal CSS property'
	);
	assert.true(
		dom.hasStyle(node, 'fontWeight'),
		'Camel case CSS property'
	);
	assert.true(
		dom.hasStyle(node, 'font-weight', 'bold'),
		'String value'
	);
	assert.true(
		dom.hasStyle(node, 'fontWeight', ['@', 'bold', '123']),
		'Array of values'
	);
});

test('hasStyle() - Invalid', function (assert) {
	var node = parsHTML(
		'<div style="font-weight: bold;">test</div>'
	).childNodes[0];
	assert.false(
		dom.hasStyle(node, 'font-weight', 'Bold'),
		'Invalid string'
	);
	assert.false(
		dom.hasStyle(node, 'fontWeight', ['@', 'normal', '123']),
		'Invalid array'
	);
	assert.false(
		dom.hasStyle(node, 'color'),
		'Undefined property'
	);
});

test('hasStyle() - No style attribute', function (assert) {
	var node = parsHTML('<div>test</div>').childNodes[0];

	assert.false(dom.hasStyle(node, 'color'));
});
