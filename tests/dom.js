import test from 'ava';
import browserEnv from 'browser-env';
import * as dom from '../src/lib/dom.js';

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
browserEnv();
Object.defineProperties(window.HTMLElement.prototype, {
	offsetLeft: {
		get: function ()
		{
			return parseFloat(window.getComputedStyle(this).marginLeft) || 0;
		}
	},
	offsetTop: {
		get: function ()
		{
			return parseFloat(window.getComputedStyle(this).marginTop) || 0;
		}
	},
	offsetHeight: {
		get: function ()
		{
			return parseFloat(window.getComputedStyle(this).height) || 0;
		}
	},
	offsetWidth: {
		get: function ()
		{
			return parseFloat(window.getComputedStyle(this).width) || 0;
		}
	}
});
window.Element.prototype.getClientRects = function ()
{
	var node = this;
	while (node)
	{
		if (node === document)
			break;

		// don't know why but style is sometimes undefined
		if (!node.style || node.style.display === 'none' || node.style.visibility === 'hidden')
			return [];

		node = node.parentNode;
	}
	return [{width: this.offsetWidth, height: this.offsetHeight}];
};
var obj = {
	startNode: null,
	endNode: null
};
global.document.createRange = () => Object.create({
	setStart()
	{},
	setEnd()
	{},
	setStartBefore: node => obj.startNode = node,
	setEndAfter: node => obj.endNode = node,
	commonAncestorContainer: {
		nodeName: 'BODY',
		ownerDocument: document
	},
	extractContents()
	{
		var frag = document.createDocumentFragment();
		var node = obj.startNode;
		while (node)
		{
			frag.appendChild(node);
			node = node.nextSibling;
			if (node === obj.endNode)
				break;
		}
		return frag;
	}
});

test('createElement() - Simple',t =>
{
	var node = dom.createElement('div');
	t.truthy(node, 'Is defined');
	t.is(node.tagName.toLowerCase(), 'div', 'TagName');
});

test('createElement() - Attributes',t =>
{
	var node = dom.createElement('div', {
		contentEditable: true,
		'data-test': 'value'
	});

	t.truthy(node, 'Is defined');
	//~ t.true(node.isContentEditable, 'Is contentEditable');
	t.true(node.hasAttribute('data-test'), 'Has attribute');
	t.is(node.getAttribute('data-test'), 'value', 'Attribute value');
});

test('createElement() - Style',t =>
{
	var node = dom.createElement('div', {
		style: 'font-size: 100px; font-weight: bold'
	});

	t.truthy(node, 'Is defined');
	t.is(node.style.fontSize, '100px', 'Font size');
	t.is(node.style.fontWeight, 'bold', 'Font weight');
});

test('parents()',t =>
{
	var div = document.createElement('div');
	var p = document.createElement('p');
	var a = document.createElement('a');

	div.appendChild(p);
	p.appendChild(a);

	t.deepEqual(dom.parents(a), [p, div], 'No selector');
	t.deepEqual(dom.parents(a, 'p'), [p], 'Simple selector');
	t.deepEqual(dom.parents(a, 'p,div,em'), [p, div], 'Complex selector');
});

test('parent()',t =>
{
	var div = document.createElement('div');
	var p = document.createElement('p');

	div.appendChild(p);

	t.falsy(dom.parent(p, 'p'), 'Paragraph');
	t.is(dom.parent(p, 'div'), div, 'Div');
});

test('closest()',t =>
{
	var div = document.createElement('div');
	var p = document.createElement('p');

	div.appendChild(p);

	t.is(dom.closest(p, 'p'), p, 'Paragraph');
	t.is(dom.closest(p, 'div'), div, 'Div');
	t.falsy(dom.closest(p, 'input'), 'No match');
});

test('appendChild()',t =>
{
	var div = document.createElement('div');
	var p = document.createElement('p');

	div.appendChild(p);

	dom.remove(p);

	t.falsy(p.parentNode);
	t.falsy(div.firstChild);
});

test('appendChild() 2',t =>
{
	var div = document.createElement('div');
	var p = document.createElement('p');

	dom.appendChild(div, p);

	t.is(div.firstChild, p);
});

test('find()',t =>
{
	var div = document.createElement('div');
	var p = document.createElement('p');
	var a = document.createElement('a');
	var text = document.createTextNode('');

	div.appendChild(p);
	div.appendChild(a);
	div.appendChild(text);

	var paragraphs = dom.find(div, 'p');
	t.is(paragraphs.length, 1, 'Select paragraphs');

	var nodes = dom.find(div, '*');
	t.is(nodes.length, 2, 'Select all');
});

test('on()',t =>
{
	var div = document.createElement('div');
	var called = false;

	dom.on(div, 'test', function ()
	{
		called = true;
	});

	dom.trigger(div, 'test');
	t.true(called);
});

test('on() - Selector',t =>
{
	var div = document.createElement('div');
	var p = document.createElement('p');
	var called = false;

	div.appendChild(p);

	dom.on(div, 'test', 'p', function ()
	{
		called = true;
	});

	dom.trigger(div, 'test');
	t.false(called, 'Not matching selector');

	dom.trigger(p, 'test');
	t.true(called, 'Matching selector');
});

test('off()',t =>
{
	var div = document.createElement('div');
	var called = false;
	var fn = function ()
	{
		called = true;
	};

	dom.on(div, 'test', fn);
	dom.off(div, 'test', fn);

	dom.trigger(div, 'test');
	t.false(called);
});

test('off() - Selector',t =>
{
	var div = document.createElement('div');
	var p = document.createElement('p');
	var called = false;
	var fn = function ()
	{
		called = true;
	};

	div.appendChild(p);

	dom.on(div, 'test', 'p', fn);
	dom.off(div, 'test', 'p', fn);

	dom.trigger(div, 'test');
	t.false(called, 'Not matching selector');

	dom.trigger(p, 'test');
	t.false(called, 'Matching selector');
});

test('attr()',t =>
{
	var div = document.createElement('div');

	dom.attr(div, 'test', 'value');
	t.true(div.hasAttribute('test'), 'Add attribute');

	t.is(dom.attr(div, 'test'), 'value', 'Get attribute');

	dom.attr(div, 'test', 'new-value');
	t.is(div.getAttribute('test'), 'new-value', 'Add attribute');

	dom.attr(div, 'test', null);
	t.false(div.hasAttribute('test'), 'Remove attribute');
});

test('removeAttr()',t =>
{
	var div = document.createElement('div');

	div.setAttribute('test', 'test');

	t.true(div.hasAttribute('test'));
	dom.removeAttr(div, 'test');
	t.false(div.hasAttribute('test'));
});

test('hide()',t =>
{
	var div = document.createElement('div');

	dom.hide(div);
	t.is(div.style.display, 'none', 'Should hide node');
});

test('show()',t =>
{
	var div = document.createElement('div');

	div.style.display = 'none';

	dom.show(div);
	t.is(div.style.display, '', 'Should show node');
});

test('toggle()',t =>
{
	var div = document.createElement('div');

	dom.toggle(div);
	t.is(div.style.display, 'none', 'Should hide node');

	dom.toggle(div);
	t.is(div.style.display, '', 'Should show node');
});

test('css()',t =>
{
	var div = document.createElement('div');

	dom.css(div, 'width', 100);
	t.is(div.style.width, '100px', 'Convert numbers into pixels');

	dom.css(div, { width: 32 });
	t.is(div.style.width, '32px', 'Set object');

	dom.css(div, 'width', '110px');
	t.is(div.style.width, '110px', 'Set pixels');

	dom.css(div, 'width', '10em');
	t.is(div.style.width, '10em', 'Set em');

	dom.css(div, 'width', '50%');
	t.is(div.style.width, '50%', 'Set percent');

	t.is(
		dom.css(window, 'width'),
		null,
		'Get computed value of window'
	);
});

test('data()',t =>
{
	var text = document.createTextNode('');
	var div = document.createElement('div');
	div.setAttribute('data-test', 'test');
	div.setAttribute('data-another-test', 'test');
	div.setAttribute('ignored', 'test');

	t.deepEqual(dom.data(div), {
		'another-test': 'test',
		'test': 'test'
	});
	t.is(dom.data(div, 'test'), 'test');
	t.is(dom.data(div, 'another-test'), 'test');

	dom.data(div, 'test', 'new-value');
	t.is(dom.data(div, 'test'), 'new-value');

	dom.data(div, 'test', 1);
	t.is(dom.data(div, 'test'), '1');

	dom.data(text, 'test', 'test');
	t.is(dom.data(text, 'test'), undefined);
});

test('is()',t =>
{
	var div = document.createElement('div');
	div.className = 'test';

	t.true(dom.is(div, 'div'));
	t.true(dom.is(div, '.test'));
	t.false(dom.is());
	t.false(dom.is(null));
	t.false(dom.is(div, 'p'));
	t.false(dom.is(div, '.testing'));
});

test('remove()',t =>
{
	var parent = document.createElement('div');
	var child = document.createElement('div');

	parent.appendChild(child);
	dom.remove(child);

	t.falsy(child.parentNode);

	// Make sure doesn't throw if has no parent
	dom.remove(child);
});

test('contains()',t =>
{
	var parent = document.createElement('div');
	var child = document.createElement('div');

	parent.appendChild(child);

	t.true(dom.contains(parent, child));
	t.false(dom.contains(parent, parent));
	t.false(dom.contains(child, parent));
});

test('insertBefore()',t =>
{
	var parent = document.createElement('div');
	var ref = document.createElement('div');
	var first = document.createElement('div');

	parent.appendChild(ref);

	dom.insertBefore(first, ref);

	t.is(parent.firstChild, first);
});

test('insertBefore() 2',t =>
{
	var parent = document.createElement('div');
	var first = document.createElement('div');
	var last = document.createElement('div');

	parent.appendChild(first);
	parent.appendChild(last);

	t.is(dom.previousElementSibling(last), first);
	t.is(dom.previousElementSibling(last, 'div'), first);
	t.is(dom.previousElementSibling(last, 'p'), null);
	t.is(dom.previousElementSibling(first), null);
});

test('hasClass()',t =>
{
	var div = document.createElement('div');

	div.className = 'test';

	t.is(dom.hasClass(div, 'another-test'), false);
	t.is(dom.hasClass(div, 'test'), true);
});

test('removeClass()',t =>
{
	var div = document.createElement('div');

	div.className = 'test another-test';

	dom.removeClass(div, 'another-test');
	t.is(div.className.trim(), 'test');

	dom.removeClass(div, 'test');
	t.is(div.className.trim(), '');
});

test('addClass()',t =>
{
	var div = document.createElement('div');

	dom.addClass(div, 'test');
	t.is(div.className.trim(), 'test');

	dom.addClass(div, 'another-test');
	t.is(div.className.trim(), 'test another-test');
});

test('toggleClass()',t =>
{
	var div = document.createElement('div');

	dom.toggleClass(div, 'test');
	t.is(div.className.trim(), 'test', 'Add class');

	dom.toggleClass(div, 'test');
	t.is(div.className, '', 'Remove class');

	dom.toggleClass(div, 'test', true);
	dom.toggleClass(div, 'test', true);
	t.is(div.className.trim(), 'test', 'Add class via state');

	dom.toggleClass(div, 'test', false);
	dom.toggleClass(div, 'test', false);
	t.is(div.className, '', 'Remove class via state');
});

test('width()',t =>
{
	var div = document.createElement('div');
	dom.width(div, 100);
	t.is(div.style.width, '100px', 'Number width');

	dom.width(div, '10em');
	t.is(div.style.width, '10em', 'Em width');

	dom.width(div, '100px');
	t.is(dom.width(div), 100, 'Get width');
});

test('height()',t =>
{
	var div = document.createElement('div');

	dom.height(div, 100);
	t.is(div.style.height, '100px', 'Number height');

	dom.height(div, '10em');
	t.is(div.style.height, '10em', 'Em height');

	dom.height(div, '100px');
	t.is(dom.height(div), 100, 'Get height');
});

test('trigger()',t =>
{
	var div = document.createElement('div');
	var detail = {};

	div.addEventListener('custom-event', function (e)
	{
		t.is(e.detail, detail);
	});

	dom.trigger(div, 'custom-event', detail);
});

test('isVisible()',t =>
{
	var div = document.createElement('div');

	dom.width(div, 100);
	dom.hide(div);
	t.is(dom.isVisible(div), false, 'Should be false when hidden');

	dom.show(div);
	t.is(dom.isVisible(div), true, 'Should be true when visible');

	dom.hide(div);
	t.is(dom.isVisible(div), false, 'Deattached should be false');
});

test('traverse()',t =>
{
	var result = '';
	var node   = parsHTML(
		'<code><b>1</b><b>2</b><b>3</b><span><b>4</b><b>5</b></span></code>'
	);

	dom.traverse(node, function (node)
	{
		if (node.nodeType === 3)

			result += node.nodeValue;

	});

	t.is(result, '12345');
});

test('traverse() - Innermost first',t =>
{
	var result = '';
	var node   = parsHTML(
		'<code><span><b></b></span><span><b></b><b></b></span></code>'
	);

	dom.traverse(node, function (node)
	{
		result += node.nodeName.toLowerCase() + ':';
	}, true);

	t.is(result, 'b:span:b:b:span:code:');
});

test('traverse() - Siblings only',t =>
{
	var result = '';
	var node   = parsHTML(
		'1<span>ignore</span>2<span>ignore</span>3'
	);

	dom.traverse(node, function (node)
	{
		if (node.nodeType === 3)

			result += node.nodeValue;

	}, false, true);

	t.is(result, '123');
});

test('rTraverse()',t =>
{
	var result = '';
	var node   = parsHTML(
		'<code><b>1</b><b>2</b><b>3</b><span><b>4</b><b>5</b></span></code>'
	);

	dom.rTraverse(node, function (node)
	{
		if (node.nodeType === 3)

			result += node.nodeValue;

	});

	t.is(result, '54321');
});

test('parseHTML()',t =>
{
	var result = dom.parseHTML(
		'<span>span<div style="font-weight: bold;">div</div>span</span>'
	);

	t.is(result.nodeType, dom.DOCUMENT_FRAGMENT_NODE);
	t.is(result.childNodes.length, 1);
	t.deepEqual(
		result.firstChild,
		parsHTML(
			'<span>span<div style="font-weight: bold;">div</div>span</span>'
		).childNodes[0]
	);
});

test('parseHTML() - Parse multiple',t =>
{
	var result = dom.parseHTML(
		'<span>one</span><span>two</span><span>three</span>'
	);

	t.is(result.nodeType, dom.DOCUMENT_FRAGMENT_NODE);
	t.is(result.childNodes.length, 3);
});

test('hasStyling()',t =>
{
	var node = parsHTML('<pre></pre>').childNodes[0];

	t.true(dom.hasStyling(node));
});

test('hasStyling() - Non-styled div',t =>
{
	var node = parsHTML('<div></div>').childNodes[0];

	t.false(dom.hasStyling(node));
});

test('hasStyling() - Div with class',t =>
{
	var node = parsHTML('<div class="test"></div>').childNodes[0];

	t.true(dom.hasStyling(node));
});

test('hasStyling() - Div with style attribute',t =>
{
	var node = parsHTML('<div style="color: red;"></div>').childNodes[0];

	t.true(dom.hasStyling(node));
});

test('convertElement()',t =>
{
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

	t.is(newNode, node.firstChild);

	t.deepEqual(
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

test('convertElement() - Invalid attribute name',t =>
{
	var node = parsHTML(
		'<i size"2"="" good="attr">test</i>'
	);

	var newNode = dom.convertElement(node.firstChild, 'em');

	t.is(newNode, node.firstChild);

	t.deepEqual(
		newNode,
		parsHTML(
			'<em good="attr">test</em>'
		).childNodes[0]
	);
});

/*
test('fixNesting() - With styling',t => {
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

	t.deepEqual(
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

test('fixNesting() - Deeply nested',t => {
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

	t.deepEqual(
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
test('fixNesting() - Nested list',t =>
{
	var node = parsHTML(
		'<ul>' +
			'<li>first</li>' +
			'<ol><li>middle</li></ol>' +
			'<li>second</li>' +
		'</ul>'
	);

	dom.fixNesting(node);

	t.deepEqual(
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

test('fixNesting() - Nested list, no previous item',t =>
{
	var node = parsHTML(
		'<ul>' +
			'<ol><li>middle</li></ol>' +
			'<li>first</li>' +
		'</ul>'
	);

	dom.fixNesting(node);

	t.deepEqual(
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

test('fixNesting() - Deeply nested list',t =>
{
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

	t.deepEqual(
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

test('removeWhiteSpace() - Preserve line breaks',t =>
{
	var node = parsHTML(
		'<div style="white-space: pre-line">    ' +
			'<span>  \n\ncontent\n\n  </span>\n\n  ' +
		'</div><div></div>'
	);

	dom.removeWhiteSpace(node);

	t.deepEqual(
		node,
		parsHTML(
			'<div style="white-space: pre-line">' +
				'<span>\n\ncontent\n\n </span>\n\n' +
			'</div><div></div>'
		)
	);
});

test('removeWhiteSpace() - Ignore marker spaces',t =>
{
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

	t.deepEqual(
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
	function (t)
	{
		var html = '<span>  test</span><span>  test  </span>';
		var node = parsHTML(html);

		// Must move to a fragment as the other HTML on the QUnit test page
		// interferes with this test
		var frag = document.createDocumentFragment();
		frag.appendChild(node);

		dom.removeWhiteSpace(node);

		t.is(
			node.innerHTML.toLowerCase(),
			'<span>test</span><span> test</span>'
		);
	}
);

test(
	'removeWhiteSpace() - Block then span with start spaces',
	function (t)
	{
		var html = '<div>test</div><span>  test  </span>';
		var node = parsHTML(html);

		// Must move to a fragment as the other HTML on the QUnit test page
		// interferes with this test
		var frag = document.createDocumentFragment();
		frag.appendChild(node);

		dom.removeWhiteSpace(node);

		t.is(
			node.innerHTML.toLowerCase(),
			'<div>test</div><span>test</span>'
		);
	}
);

test(
	'removeWhiteSpace() - Divs with start and end spaces',
	function (t)
	{
		var html = '<div>  test  </div><div>  test  </div>';
		var node = parsHTML(html);

		// Must move to a fragment as the other HTML on the QUnit test page
		// interferes with this test
		var frag = document.createDocumentFragment();
		frag.appendChild(node);

		dom.removeWhiteSpace(node);

		t.is(
			node.innerHTML.toLowerCase(),
			'<div>test</div><div>test</div>'
		);
	}
);

test('removeWhiteSpace() - New line chars',t =>
{
	var html = '<span>\ntest\n\n</span><span>\n\ntest\n</span>';
	var node = parsHTML(html);

	// Must move to a fragment as the other HTML on the QUnit test page
	// interferes with this test
	var frag = document.createDocumentFragment();
	frag.appendChild(node);

	dom.removeWhiteSpace(node);

	t.is(
		node.innerHTML.toLowerCase(),
		'<span>test </span>' +
		'<span>test</span>'
	);
});

test('removeWhiteSpace() - With .sceditor-ignore siblings',t =>
{
	var node = parsHTML(
		'<span>test</span>' +
		'<span class="sceditor-ignore">  test  </span>' +
		'<span>  test</span>'
	);

	dom.removeWhiteSpace(node);

	t.is(
		node.innerHTML.toLowerCase(),
		'<span>test</span>' +
		'<span class="sceditor-ignore"> test </span>' +
		'<span> test</span>'
	);
});

test('removeWhiteSpace() - Nested span space',t =>
{
	var node = parsHTML(
		'<div>' +
			'<div>    <span>  \t\t\t\t </span>\t\t\t</div> ' +
			'<div>  </div>' +
		'</div>'
	).childNodes[0];

	dom.removeWhiteSpace(node);

	t.is(
		node.innerHTML.toLowerCase(),
		'<div><span></span> </div><div></div>'
	);
});

test('removeWhiteSpace() - Pre tag',t =>
{
	var node = parsHTML(
		'<pre>    <span>  \t\tcontent\t\t </span>\t\t\t</pre>'
	);

	dom.removeWhiteSpace(node);

	t.is(
		node.innerHTML.toLowerCase(),
		'<pre>    <span>  \t\tcontent\t\t </span>\t\t\t</pre>'
	);
});

test('removeWhiteSpace() - Deeply nested siblings',t =>
{
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

	t.is(
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

test('removeWhiteSpace() - Text next to image',t =>
{
	var node = parsHTML(
		'<div>test  <img src="../../emoticons/smile.png">  test.</div>'
	);

	dom.removeWhiteSpace(node);

	t.deepEqual(
		node,
		parsHTML(
			'<div>test <img src="../../emoticons/smile.png"> test.</div>'
		)
	);
});

/*
function isNode(o)
{
	return (
		typeof Node === 'object' ? o instanceof Node :
			o && typeof o === 'object' && typeof o.nodeType === 'number'
			&& typeof o.nodeName === 'string'
	);
}
function isElement(o)
{
	return (
		typeof HTMLElement === 'object' ? o instanceof HTMLElement : //DOM2
			o && typeof o === 'object' && o !== null
			&& o.nodeType === 1 && typeof o.nodeName === 'string'
	);
}

test('extractContents()',t => {
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
	t.true(isElement(start));
	t.true(isElement(end));
	var container = document.createElement('div');
		container.appendChild(
		dom.extractContents(start, end));
	t.true(container.innerHTML);
	t.is(
		dom.extractContents(start, end),
		parseHTMLFragment(
			'<div id="start">' +
				'<span>test</span>' +
			'</div>' +
			'<span>test</span>'
		)
	);
});

test('extractContents() - End inside start',t => {
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
	t.true(isElement(start));
	t.true(isElement(end));
	t.is(
		dom.extractContents(start, end),
		parseHTMLFragment(
			'<div id="start">' +
				'<span>test</span>' +
				'<span>test</span>' +
			'</div>'
		)
	);
});

test('extractContents() - Start inside end',t => {
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
	t.true(isElement(start));
	t.true(isElement(end));
	t.is(
		dom.extractContents(start, end).innerHTML.toLowerCase(),
		'<div id="end"><span id="start">start</span><span>test</span></div>'
	);
	t.is(
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
test('getStyle()',t =>
{
	var node = parsHTML(
		'<div style="font-weight: bold; font-size: 10px;' +
		'text-align: right;">test</div>'
	).childNodes[0];
	t.is(
		dom.getStyle(node, 'font-weight'),
		'bold',
		'Normal CSS property'
	);
	t.is(
		dom.getStyle(node, 'fontSize'),
		'10px',
		'Camel case CSS property'
	);
	t.is(
		dom.getStyle(node, 'text-align'),
		'right',
		'Text-align'
	);
	t.is(
		dom.getStyle(node, 'color'),
		'',
		'Undefined CSS property'
	);
});

test('getStyle() - Normalise text-align',t =>
{
	var node = parsHTML(
		'<div style="direction: rtl;text-align: right;">test</div>'
	).childNodes[0];

	// If direction is left-to-right and text-align is right,
	// it shouldn't return anything.
	t.is(dom.getStyle(node, 'direction'), 'rtl');
	t.is(dom.getStyle(node, 'textAlign'), '');
});

test('getStyle() - No style attribute',t =>
{
	var node = parsHTML('<div>test</div>').childNodes[0];

	t.is(dom.getStyle(node, 'color'), '');
});

test('hasStyle()',t =>
{
	var node = parsHTML(
		'<div style="font-weight: bold;">test</div>'
	).childNodes[0];
	t.is(node.style.cssText, 'font-weight: bold;');
	t.true(
		dom.hasStyle(node, 'font-weight'),
		'Normal CSS property'
	);
	t.true(
		dom.hasStyle(node, 'fontWeight'),
		'Camel case CSS property'
	);
	t.true(
		dom.hasStyle(node, 'font-weight', 'bold'),
		'String value'
	);
	t.true(
		dom.hasStyle(node, 'fontWeight', ['@', 'bold', '123']),
		'Array of values'
	);
});

test('hasStyle() - Invalid',t =>
{
	var node = parsHTML(
		'<div style="font-weight: bold;">test</div>'
	).childNodes[0];
	t.false(
		dom.hasStyle(node, 'font-weight', 'Bold'),
		'Invalid string'
	);
	t.false(
		dom.hasStyle(node, 'fontWeight', ['@', 'normal', '123']),
		'Invalid array'
	);
	t.false(
		dom.hasStyle(node, 'color'),
		'Undefined property'
	);
});

test('hasStyle() - No style attribute',t =>
{
	var node = parsHTML('<div>test</div>').childNodes[0];

	t.false(dom.hasStyle(node, 'color'));
});
