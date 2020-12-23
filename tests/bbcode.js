import test from 'ava';
import browserEnv from 'browser-env';
browserEnv();
import bbcode from '../src/formats/bbcode.js';
import QuoteType from '../src/formats/bbcode.quotetype.js';

var IE_BR_STR = '<br />';
var parser = new bbcode({});
let stripWhiteSpace = x => x.replace(/[\r\n\s\t]/g, '');

test('Check properties', t => {
	t.true('fixInvalidChildren' in parser.opts);
	t.true(parser.opts.fixInvalidChildren);
	parser = new bbcode({
		fixInvalidChildren: false
	});
	t.false(parser.opts.fixInvalidChildren);
	parser = new bbcode({
		eatDoughnut: false,
		fixInvalidChildren: true
	});
	t.true('eatDoughnut' in parser.opts);
	t.true(parser.opts.fixInvalidChildren);
	parser = new bbcode({});
	// t.false('eatDoughnut' in parser.opts);
});


test('Fix invalid nesting', t => {
	t.is(
		stripWhiteSpace(parser.toSource('[b]test[code]test[/code]test[/b]')),
		'[b]test[/b][code]test[/code][b]test[/b]',
		'Block level tag in an inline tag with content before and after'
	);

	t.is(
		stripWhiteSpace(parser.toSource('[b]test[code]test[/code][/b]')),
		'[b]test[/b][code]test[/code]',
		'Block level tag in an inline tag with content before'
	);

	t.is(
		stripWhiteSpace(
			parser.toSource('[b][i][s]test[code]test[/code]test[/s][/i][/b]')
		),
		'[b][i][s]test[/s][/i][/b][code]test[/code]' +
			'[b][i][s]test[/s][/i][/b]',
		'Deeply nested block in inline tags'
	);

	t.is(
		stripWhiteSpace(
			parser.toSource('[size=3]test[code]test[/code]test[/size]')
		),
		'[size=3]test[/size][code]test[/code][size=3]test[/size]',
		'Preserve attributes'
	);

	t.is(
		parser.toSource(
			'[ul]' +
				'[color=#444444]' +
					'[li]test[/li]\n' +
					'[li]test[/li]\n' +
					'[li]test[/li]\n' +
				'[/color]' +
			'[/ul]'
		),
		'[ul]\n' +
			'[li][color=#444444]test[/color][/li]\n' +
			' [li][color=#444444]test[/color][/li]\n' +
			' [li][color=#444444]test[/color][/li]\n' +
		' [/ul]\n',
		'Move newlines'
	);
});


test('Rename BBCode', t => {
	bbcode.rename('b', 'testbold');

	t.truthy(
		bbcode.get('testbold'),
		'Can get renamed BBCode'
	);

	t.falsy(
		bbcode.get('b'),
		'Cannot get BBCode by old name'
	);

	t.is( 
		parser.toHtml('[testbold]test[/testbold]'),
		'<div><strong>test</strong></div>\n',
		'Will convert renamed BBCode'
	);

	bbcode.rename('testbold', 'b');

	t.falsy(
		bbcode.get('testbold'),
		'Should not be able to get old BBCode name'
	);
});


test('Self closing tag', t => {
	t.is(
		parser.toSource('[hr]test'),
		'[hr]\ntest',
		'Self closing'
	);
});



test('Tag closed by another tag', t => {
	t.is(
		parser.toSource('[list][*] test[*] test 2[/list]'),
		'[list]\n[*] test[/*]\n[*] test 2[/*]\n[/list]\n',
		'List [*]'
	);
});



test('BBCode closed outside block', t => {
	t.is(
		parser.toSource('[b]test[code]test[/b][/code]test[/b]'),
		'[b]test[/b][code]test[/b][/code]\n[b]test[/b]',
		'Code with closing tag inside'
	);

	t.is(
		parser.toSource('[b]test[quote]test[/b][/quote]\ntest[/b]'),
		'[b]test[/b][quote][b]test[/b][/quote]\n test[/b]',
		'Quote with closing tag inside'
	);

	t.is(
		parser.toSource('[code][b]something[/code]\n[b]something[/b]'),
		'[code][b]something[/code]\n [b]something[/b]',
		'Code with tag closed outside'
	);

	t.is(
		parser.toSource('[quote][b]something[/quote]\n[b]something[/b]'),
		'[quote][b]something[/b][/quote]\n[b] [b]something[/b][/b]',
		'Quote with tag closed outside'
	);
});

test('BBCode closed outside block - No children fix', t => {
	parser = new bbcode({
		fixInvalidChildren: false
	});

	t.is(
		parser.toSource('[b]test[code]test[/b][/code]test[/b]'),
		'[b]test[/b][code][b]test[/b][/code]\ntest[/b]',
		'Code with closing tag inside'
	);

	t.is(
		parser.toSource('[b]test[quote]test[/b][/quote]\ntest[/b]'),
		'[b]test[/b][quote][b]test[/b][/quote]\n test[/b]',
		'Quote with closing tag inside'
	);

	t.is(
		parser.toSource('[code][b]something[/code]\n[b]something[/b]'),
		'[code][b]something[/b][/code]\n[b] [b]something[/b][/b]',
		'Code with tag closed outside'
	);

	t.is(
		parser.toSource('[quote][b]something[/quote]\n[b]something[/b]'),
		'[quote][b]something[/b][/quote]\n[b] [b]something[/b][/b]',
		'Quote with tag closed outside'
	);
	parser = new bbcode({
		fixInvalidChildren: true
	});
});


test('Closing parent tag from child', t => {
	t.is(
		parser.toSource('[b][color]test[/b][/color]'),
		'[b][color]test[/color][/b]',
		'Closing parent tag from child tag'
	);

	t.is(
		parser.toSource('[b]test[color]test[/b]test[/color]'),
		'[b]test[color]test[/color][/b][color]test[/color]',
		'Closing parent tag from child tag with content before and after'
	);

	t.is(
		parser.toSource('[b][s][i][color]test[/i][/s][/b][/color]'),
		'[b][s][i][color]test[/color][/i][/s][/b]',
		'Closing parent tag from deeply nested child tag'
	);

	t.is(
		parser.toSource('[color][b][s][i]test[/color][/i][/s][/b]'),
		'[color][b][s][i]test[/i][/s][/b][/color]',
		'Closing parent tag from deeply nested child tag'
	);

	t.is(
		parser.toSource('[left][list][*]xyz[/left][list][*]abc[/list]'),
		'[left][list]\n[*]xyz[/*]\n[/list]\n[/left]\n[list]\n[*][list]\n' +
			'[*]abc[/*]\n[/list]\n[/*]\n[/list]\n',
		'Closing parent tag from list item'
	);
});


test('Missing tags', t => {
	t.is(
		parser.toSource('[b][color][/b]'),
		'[b][color][/b]',
		'Missing closing tag'
	);

	t.is(
		parser.toSource('[b][/color][/b]'),
		'[b][/color][/b]',
		'Missing opening tag'
	);
});


test('Unknown tags', t => {
	t.is(
		parser.toSource('[b][unknown][/b]'),
		'[b][unknown][/b]',
		'Unknown tag missing end'
	);

	t.is(
		parser.toSource('[b][unknown]test[/unknown][/b]'),
		'[b][unknown]test[/unknown][/b]',
		'Unknown tag with end'
	);

	t.is(
		parser.toSource('[b][unknown][/unknown][/b]'),
		'[b][unknown][/unknown][/b]',
		'Empty unknown tag with end'
	);

	t.is(
		parser.toHtml('[b][unknown]test[/unknown][/b]'),
		'<div><strong>[unknown]test[/unknown]</strong></div>\n',
		'Empty unknown tag with end to HTML'
	);

	t.is(
		parser.toHtml('[nonexistant aaa]'),
		'<div>[nonexistant aaa]</div>\n',
		'Unknown tag with attribute'
	);
});

test('Do not strip start and end spaces', t => {
	t.is(
		parser.toHtml('\n\n[quote]test[/quote]\n\n\n\n'),
		'<div>' + IE_BR_STR + '</div>\n' +
		'<div>' + IE_BR_STR + '</div>\n' +
		'<blockquote>test' + IE_BR_STR + '</blockquote>' +
		'<div>' + IE_BR_STR + '</div>\n' +
		'<div>' + IE_BR_STR + '</div>\n' +
		'<div><br />' + IE_BR_STR + '</div>\n'
	);
});


test('New Line Handling', t => {
	t.is(
		parser.toHtml('[list][*]test\n[*]test2\nline\n[/list]'),

		'<ul>' +
			'<li>test' + IE_BR_STR + '</li>' +
			'<li>test2<br />line' + IE_BR_STR + '</li>' +
		'</ul>',

		'List with non-closed [*]'
	);

	t.is(
		parser.toHtml('[code]test\nline\n[/code]'),
		'<code>test<br />line<br />' + IE_BR_STR + '</code>',
		'Code test'
	);

	t.is(
		parser.toHtml('[quote]test\nline\n[/quote]'),
		'<blockquote>test<br />line<br />' + IE_BR_STR + '</blockquote>',
		'Quote test'
	);

	t.is(
		parser.toHtml('[quote][center]test[/center][/quote]'),
		'<blockquote>' +
			'<div align="center">test' + IE_BR_STR + '</div>' +
		'</blockquote>',

		'Two block-level elements together'
	);
});


test('Attributes QuoteType.auto', t => {
	// Remove the [quote] tag default quoteType so will use the default
	// one specified by the parser
	bbcode.set('quote', {
		quoteType: null
	});

	parser = new bbcode({
		quoteType: QuoteType.auto
	});

	t.is(
		parser.toSource(
			'[quote author=poster date=1353794172 ' +
				'link=topic=2.msg4#msg4]hi[/quote]'
		),
		'[quote author=poster date=1353794172 ' +
				'link="topic=2.msg4#msg4"]hi[/quote]\n',
		'Attribute with value that contains an iss'
	);

	t.is(
		parser.toSource(
			'[quote author=\'poster"s\']hi[/quote]'
		),
		'[quote author=poster"s]hi[/quote]\n',
		'Quoted attribute with a double quote'
	);

	t.is(
		parser.toSource(
			'[quote author=This is all the author date=12345679]hi[/quote]'
		),
		'[quote author="This is all the author" date=12345679]hi[/quote]\n',
		'Attribute with spaces'
	);

	t.is(
		parser.toSource(
			'[quote=te=st test=ex=tra]hi[/quote]'
		),
		'[quote="te=st" test="ex=tra"]hi[/quote]\n',
		'Default attribute with is'
	);

	t.is(
		parser.toSource(
			'[quote ' +
				'quoted=\'words word=word\\\' link=lala=lalala\' ' +
				'author=anything that does not have an iss after it ' +
				'date=1353794172 ' +
				'link=anythingEvenEquals=no space up to the iss ' +
				'test=la' +
			']asd[/quote]'
		),
		'[quote ' +
			'quoted="words word=word\\\\\' link=lala=lalala" ' +
			'author="anything that does not have an iss after it" ' +
			'date=1353794172 ' +
			'link="anythingEvenEquals=no space up to the iss" ' +
			'test=la' +
		']asd[/quote]\n',
		'Multi-Attribute test'
	);

	// Reset [quote]'s default quoteType
	bbcode.set('quote', {
		quoteType: QuoteType.never
	});
});


test('Attributes QuoteType.never', t => {
	// Remove the [quote] tag default quoteType so will use the default
	// one specified by the parser
	bbcode.set('quote', {
		quoteType: null
	});

	parser = new bbcode({
		quoteType: QuoteType.never
	});

	t.is(
		parser.toSource(
			'[quote author=poster date=1353794172 ' +
				'link=topic=2.msg4#msg4]hi[/quote]'
		),
		'[quote author=poster date=1353794172 ' +
				'link=topic=2.msg4#msg4]hi[/quote]\n',
		'Attribute with value that contains an iss'
	);

	t.is(
		parser.toSource(
			'[quote author=\'poster"s\']hi[/quote]'
		),
		'[quote author=poster"s]hi[/quote]\n',
		'Quoted attribute with a double quote'
	);

	t.is(
		parser.toSource(
			'[quote author=This is all the author date=12345679]hi[/quote]'
		),
		'[quote author=This is all the author date=12345679]hi[/quote]\n',
		'Attribute with spaces'
	);

	t.is(
		parser.toSource(
			'[quote=te=st test=ex=tra]hi[/quote]'
		),
		'[quote=te=st test=ex=tra]hi[/quote]\n',
		'Default attribute with is'
	);

	t.is(
		parser.toSource(
			'[quote ' +
				'quoted=\'words word=word\\\' link=lala=lalala\' ' +
				'author=anything that does not have an iss after it ' +
				'date=1353794172 ' +
				'link=anythingEvenEquals=no space up to the iss ' +
				'test=la' +
			']asd[/quote]'
		),
		'[quote ' +
			'quoted=words word=word\\\' link=lala=lalala ' +
			'author=anything that does not have an iss after it ' +
			'date=1353794172 ' +
			'link=anythingEvenEquals=no space up to the iss ' +
			'test=la' +
		']asd[/quote]\n',
		'Multi-Attribute test'
	);

	// Reset [quote]'s default quoteType
	bbcode.set('quote', {
		quoteType: QuoteType.never
	});
});


test('Attributes QuoteType.always', t => {
	// Remove the [quote] tag default quoteType so will use the default
	// one specified by the parser
	bbcode.set('quote', {
		quoteType: null
	});

	parser = new bbcode({
		quoteType: QuoteType.always
	});

	t.is(
		parser.toSource(
			'[quote author=poster date=1353794172 ' +
				'link=topic=2.msg4#msg4]hi[/quote]'
		),
		'[quote author="poster" date="1353794172" ' +
				'link="topic=2.msg4#msg4"]hi[/quote]\n',
		'Attribute with value that contains an iss'
	);

	t.is(
		parser.toSource(
			'[quote author=\'poster"s\']hi[/quote]'
		),
		'[quote author="poster\\"s"]hi[/quote]\n',
		'Quoted attribute with a double quote'
	);

	t.is(
		parser.toSource(
			'[quote author=This is all the author date=12345679]hi[/quote]'
		),
		'[quote author="This is all the author" ' +
			'date="12345679"]hi[/quote]\n',
		'Attribute with spaces'
	);

	t.is(
		parser.toSource(
			'[quote=te=st test=ex=tra]hi[/quote]'
		),
		'[quote="te=st" test="ex=tra"]hi[/quote]\n',
		'Default attribute with is'
	);

	t.is(
		parser.toSource(
			'[quote ' +
				'quoted=\'words word=word\\\' link=lala=lalala\' ' +
				'author=anything that does not have an iss after it ' +
				'date=1353794172 ' +
				'link=anythingEvenEquals=no space up to the iss ' +
				'test=la' +
			']asd[/quote]'
		),
		'[quote ' +
			'quoted="words word=word\\\\\' link=lala=lalala" ' +
			'author="anything that does not have an iss after it" ' +
			'date="1353794172" ' +
			'link="anythingEvenEquals=no space up to the iss" ' +
			'test="la"' +
		']asd[/quote]\n',
		'Multi-Attribute test'
	);

	// Reset [quote]'s default quoteType
	bbcode.set('quote', {
		quoteType: QuoteType.never
	});
});


test('Attributes QuoteType custom', t => {
	// Remove the [quote] tag default quoteType so will use the default
	// one specified by the parser
	bbcode.set('quote', {
		quoteType: null
	});

	parser = new bbcode({
		quoteType: function (str) {
			return '\'' +
				str.replace('\\', '\\\\').replace('\'', '\\\'') +
				'\'';
		}
	});

	t.is(
		parser.toSource(
			'[quote author=poster date=1353794172 ' +
				'link=topic=2.msg4#msg4]hi[/quote]'
		),
		'[quote author=\'poster\' date=\'1353794172\' ' +
				'link=\'topic=2.msg4#msg4\']hi[/quote]\n',
		'Attribute with value that contains an iss'
	);

	t.is(
		parser.toSource(
			'[quote author=\'poster"s\']hi[/quote]'
		),
		'[quote author=\'poster"s\']hi[/quote]\n',
		'Quoted attribute with a double quote'
	);

	t.is(
		parser.toSource(
			'[quote author=This is all the author date=12345679]hi[/quote]'
		),
		'[quote author=\'This is all the author\' ' +
			'date=\'12345679\']hi[/quote]\n',
		'Attribute with spaces'
	);

	t.is(
		parser.toSource(
			'[quote=te=st test=ex=tra]hi[/quote]'
		),
		'[quote=\'te=st\' test=\'ex=tra\']hi[/quote]\n',
		'Default attribute with is'
	);

	t.is(
		parser.toSource(
			'[quote ' +
				'quoted=\'words word=word\\\' link=lala=lalala\' ' +
				'author=anything that does not have an iss after it ' +
				'date=1353794172 ' +
				'link=anythingEvenEquals=no space up to the iss ' +
				'test=la' +
			']asd[/quote]'
		),
		'[quote ' +
			'quoted=\'words word=word\\\\\\\' link=lala=lalala\' ' +
			'author=\'anything that does not have an iss after it\' ' +
			'date=\'1353794172\' ' +
			'link=\'anythingEvenEquals=no space up to the iss\' ' +
			'test=\'la\'' +
		']asd[/quote]\n',
		'Multi-Attribute test'
	);

	// Reset [quote]'s default quoteType
	bbcode.set('quote', {
		quoteType: QuoteType.never
	});
});



test('Bold', t => {
	t.is(
		parser.toHtml('[b]test[/b]'),
		'<div><strong>test</strong></div>\n'
	);
});


test('Italic', t => {
	t.is(
		parser.toHtml('[i]test[/i]'),
		'<div><em>test</em></div>\n'
	);
});


test('Underline', t => {
	t.is(
		parser.toHtml('[u]test[/u]'),
		'<div><u>test</u></div>\n'
	);
});


test('Strikethrough', t => {
	t.is(
		parser.toHtml('[s]test[/s]'),
		'<div><s>test</s></div>\n'
	);
});


test('Subscript', t => {
	t.is(
		parser.toHtml('[sub]test[/sub]'),
		'<div><sub>test</sub></div>\n'
	);
});


test('Superscript', t => {
	t.is(
		parser.toHtml('[sup]test[/sup]'),
		'<div><sup>test</sup></div>\n'
	);
});


test('Font face', t => {
	t.is(
		parser.toHtml('[font=arial]test[/font]'),
		'<div><font face="arial">test</font></div>\n',
		'Normal'
	);

	t.is(
		parser.toHtml('[font=arial black]test[/font]'),
		'<div><font face="arial black">test</font></div>\n',
		'Space'
	);

	t.is(
		parser.toHtml('[font="arial black"]test[/font]'),
		'<div><font face="arial black">test</font></div>\n',
		'Quotes'
	);
});


test('Size', t => {
	t.is(
		parser.toHtml('[size=4]test[/size]'),
		'<div><font size="4">test</font></div>\n',
		'Normal'
	);
});


test('Font colour', t => {
	t.is(
		parser.toHtml('[color=#000]test[/color]'),
		'<div><font color="#000000">test</font></div>\n',
		'Normal'
	);

	t.is(
		parser.toHtml('[color=black]test[/color]'),
		'<div><font color="black">test</font></div>\n',
		'Named'
	);
});


test('List', t => {
	t.is(
		parser.toHtml('[ul][li]test[/li][/ul]'),
		'<ul><li>test' + IE_BR_STR + '</li></ul>',
		'UL'
	);

	t.is(
		parser.toHtml('[ol][li]test[/li][/ol]'),
		'<ol><li>test' + IE_BR_STR + '</li></ol>',
		'OL'
	);

	t.is(
		parser.toHtml('[ul][li]test[ul][li]sub[/li][/ul][/li][/ul]'),
		'<ul><li>test<ul><li>sub' + IE_BR_STR + '</li></ul></li></ul>',
		'Nested UL'
	);
});


test('Table', t => {
	t.is(
		parser.toHtml('[table][tr][th]test[/th][/tr]' +
			'[tr][td]data1[/td][/tr][/table]'),
		'<div><table><tr><th>test' + IE_BR_STR + '</th></tr>' +
			'<tr><td>data1' + IE_BR_STR + '</td></tr></table></div>\n',
		'Normal'
	);
});


test('Horizontal rule', t => {
	t.is(
		parser.toHtml('[hr]'),
		'<hr />',
		'Normal'
	);
});


test('Image', t => {
	t.is(
		parser.toHtml('[img width=10]http://test.com/test.png[/img]'),
		'<div><img src="http://test.com/test.png" width="10" /></div>\n',
		'Width only'
	);

	t.is(
		parser.toHtml('[img height=10]http://test.com/test.png[/img]'),
		'<div><img src="http://test.com/test.png" height="10" /></div>\n',
		'Height only'
	);

	t.is(
		parser.toHtml('[img]http://test.com/test.png[/img]'),
		'<div><img src="http://test.com/test.png" /></div>\n',
		'No size'
	);

	t.is(
		parser.toHtml(
			'[img]http://test.com/test.png?test&&test[/img]'
		),
		'<div><img src="http://test.com/test.png?test&amp;&amp;test" ' +
			'/></div>\n',
		'Ampersands in URL'
	);
});


test('URL', t => {
	t.is(
		parser.toHtml('[url=http://test.com/]test[/url]'),
		'<div><a href="http://test.com/">test</a></div>\n',
		'Normal'
	);

	t.is(
		parser.toHtml('[url]http://test.com/[/url]'),
		'<div><a href="http://test.com/">http://test.com/</a></div>\n',
		'Only URL'
	);

	t.is(
		parser.toHtml('[url=http://test.com/?test&&test]test[/url]'),
		'<div><a href="http://test.com/?test&amp;&amp;test">' +
			'test</a></div>\n',
		'Ampersands in URL'
	);

	t.is(
		parser.toHtml('[url]http://test.com/?test&&test[/url]'),
		'<div><a href="http://test.com/?test&amp;&amp;test">' +
			'http://test.com/?test&amp;&amp;test</a></div>\n',
		'Ampersands in URL'
	);
});


test('Email', t => {
	t.is(
		parser.toHtml('[email=test@test.com]test[/email]'),
		'<div><a href="mailto:test@test.com">test</a></div>\n',
		'Normal'
	);

	t.is(
		parser.toHtml('[email]test@test.com[/email]'),
		'<div><a href="mailto:test@test.com">test@test.com</a></div>\n',
		'Only e-mail'
	);
});


test('Quote', t => {
	t.is(
		parser.toHtml('[quote]Testing 1.2.3....[/quote]'),
		'<blockquote>Testing 1.2.3....' + IE_BR_STR + '</blockquote>',
		'Normal'
	);

	t.is(
		parser.toHtml('[quote=admin]Testing 1.2.3....[/quote]'),
		'<blockquote><cite>admin</cite>Testing 1.2.3....' + IE_BR_STR +
			'</blockquote>',
		'With author'
	);
});


test('Code', t => {
	t.is(
		parser.toHtml('[code]Testing 1.2.3....[/code]'),
		'<code>Testing 1.2.3....' + IE_BR_STR + '</code>',
		'Normal'
	);

	t.is(
		parser.toHtml('[code]Testing [b]test[/b][/code]'),
		'<code>Testing [b]test[/b]' + IE_BR_STR + '</code>',
		'Normal'
	);
});


test('Left', t => {
	t.is(
		parser.toHtml('[left]Testing 1.2.3....[/left]'),
		'<div align="left">Testing 1.2.3....' + IE_BR_STR + '</div>',
		'Normal'
	);
});


test('Right', t => {
	t.is(
		parser.toHtml('[right]Testing 1.2.3....[/right]'),
		'<div align="right">Testing 1.2.3....' + IE_BR_STR + '</div>',
		'Normal'
	);
});


test('Centre', t => {
	t.is(
		parser.toHtml('[center]Testing 1.2.3....[/center]'),
		'<div align="center">Testing 1.2.3....' + IE_BR_STR + '</div>',
		'Normal'
	);
});


test('Justify', t => {
	t.is(
		parser.toHtml('[justify]Testing 1.2.3....[/justify]'),
		'<div align="justify">Testing 1.2.3....' + IE_BR_STR + '</div>',
		'Normal'
	);
});


test('YouTube', t => {
	t.is(
		parser.toHtml('[youtube]xyz[/youtube]'),
		'<div><iframe ' +
			'src="https://www.youtube.com/embed/xyz?start=0&wmode=opaque" ' +
			'data-youtube-id="xyz" data-youtube-start="0"></iframe></div>\n',
		'Normal'
	);
});




test('[img]', t => {
	t.is(
		parser.toHtml('[img]fake.png" onerror="alert(' +
			'String.fromCharCode(88,83,83))[/img]'),
		'<div><img src="fake.png&#34; onerror=&#34;alert(' +
			'String.fromCharCode(88,83,83))" /></div>\n',
		'Inject attribute'
	);

	t.false(
		/src="javascript:/i.test(
			parser.toHtml('[img]javascript:alert(' +
				'String.fromCharCode(88,83,83))[/img]')
		),
		'JavaScript URL'
	);

	t.false(
		/src="javascript:/i.test(
			parser.toHtml('[img]JaVaScRiPt:alert(' +
				'String.fromCharCode(88,83,83))[/img]')
		),
		'JavaScript URL casing'
	);

	t.false(
		/src="jav/i.test(
			parser.toHtml('[img]jav&#x0A;ascript:alert(' +
				'String.fromCharCode(88,83,83))[/img]')
		),
		'JavaScript URL entities'
	);

	t.false(
		/[img]onerror=j/i.test(
			parser.toHtml('[img]http://foo.com/fake.png [img] ' +
				'onerror=javascript:alert(String.fromCharCode(88,83,83))' +
				' [/img] [/img]')
		),
		'Nested [img]'
	);

	t.is(
		parser.toHtml('[img=\'"2]uri[/img]'),
		'<div><img src="uri" />' +
			'</div>\n',
		'Dimension attribute injection'
	);
});


test('[url]', t => {
	t.is(
		parser.toHtml(
			'[url]fake.png" ' +
				'onmouseover="alert(String.fromCharCode(88,83,83))[/url]'
		),

		'<div>' +
			'<a href="fake.png&#34; onmouseover=&#34;' +
				'alert(String.fromCharCode(88,83,83))">' +
					'fake.png&#34; onmouseover=&#34;alert(' +
					'String.fromCharCode(88,83,83))' +
			'</a>' +
		'</div>\n',

		'Inject attribute'
	);

	t.false(
		/href="javascript:/i.test(
			parser.toHtml('[url]javascript:alert(' +
				'String.fromCharCode(88,83,83))[/url]')
		),
		'JavaScript URL'
	);

	t.false(
		/href="javascript:/i.test(
			parser.toHtml('[url]JaVaScRiPt:alert(' +
				'String.fromCharCode(88,83,83))[/url]')
		),
		'JavaScript URL casing'
	);

	t.false(
		/href="jav/i.test(
			parser.toHtml('[url]jav&#x0A;ascript:alert(' +
				'String.fromCharCode(88,83,83))[/url]')
		),
		'JavaScript URL entities'
	);

	t.false(
		/href="jav/i.test(
			parser.toHtml('[url]jav	ascript:alert("XSS");[/url]')
		),
		'JavaScript URL entities'
	);

	t.is(
		parser.toHtml('[url]test@test.test<b>tet</b>[/url]'),
		'<div><a href="test@test.test&lt;b&gt;tet&lt;/b&gt;">' +
			'test@test.test&lt;b&gt;tet&lt;/b&gt;</a></div>\n',
		'Inject HTML'
	);

	t.is(
		parser.toHtml('[url=&#106;&#97;&#118;&#97;&#115;&#99;&#114;' +
			'&#105;&#112;&#116;&#58;&#97;&#108;&#101;&#114;&#116;&#40;' +
			'&#39;&#88;&#83;&#83;&#39;&#41;]XSS[/url]'),

		'<div><a href="&#106;&#97;&#118;&#97;&#115;' +
			'&#99;&#114;&#105;&#112;&#116;&#58;' +
			'&#97;&#108;&#101;&#114;&#116;&#40;' +
			'&#39;&#88;&#83;&#83;&#39;&#41;">' +
			'XSS</a></div>\n',

		'Inject HTML'
	);
});


test('[email]', t => {
	t.is(
		parser.toHtml(
			'[email]' +
				'fake@fake.com" onmouseover="alert(' +
					'String.fromCharCode(88,83,83))' +
			'[/email]'
		),

		'<div><a href="mailto:fake@fake.com&#34; ' +
			'onmouseover=&#34;alert(String.fromCharCode(88,83,83))">' +
			'fake@fake.com&#34; onmouseover=&#34;alert(' +
			'String.fromCharCode(88,83,83))</a></div>\n',

		'Inject attribute'
	);

	t.is(
		parser.toHtml('[email]test@test.test<b>tet</b>[/email]'),
		'<div><a href="mailto:test@test.test&lt;b&gt;tet&lt;/b&gt;">' +
			'test@test.test&lt;b&gt;tet&lt;/b&gt;</a></div>\n',
		'Inject HTML'
	);
});


test('CSS injection', t => {
	t.is(
		parser.toHtml('[color=#ff0000;xss:expression(' +
			'alert(String.fromCharCode(88,83,83)))]XSS[/color]'),
		'<div><font color="#ff0000;xss:expression(' +
			'alert(String.fromCharCode(88,83,83)))">XSS</font></div>\n',
		'Inject CSS expression'
	);

	t.is(
		parser.toHtml('[font=Impact, sans-serif;xss:expression(' +
			'alert(String.fromCharCode(88,83,83)))]XSS[/font]'),
		'<div><font face="Impact, sans-serif;xss:expression(' +
			'alert(String.fromCharCode(88,83,83)))">XSS</font></div>\n',
		'Inject CSS expression'
	);
});

test('Break out of attribute', t => {
	t.is(
		parser.toHtml('[font=Impact"brokenout]XSS[/font]'),
		'<div><font face="Impact&#34;brokenout">XSS</font></div>\n',
		'Inject CSS expression'
	);
});


test('HTML injection', t => {
	t.is(
		parser.toHtml('<script>alert("Hello");</script>'),
		'<div>&lt;script&gt;alert(&#34;Hello&#34;);&lt;/script&gt;</div>\n',
		'Inject HTML script'
	);

	t.is(
		parser.toHtml('[quote=test<b>test</b>test]test[/quote]'),
		'<blockquote><cite>test&lt;b&gt;test&lt;/b&gt;test</cite>' +
			'test' + IE_BR_STR + '</blockquote>',
		'Inject HTML script'
	);
});
