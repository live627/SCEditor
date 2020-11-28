import test from 'ava';
import * as escape from '../../../src/lib/escape.js';

test('regex()', function (assert) {
	assert.is(
		escape.regex('- \\ ^ / $ * + ? . ( ) | { } [ ] | ! :'),
		'\\- \\\\ \\^ \\/ \\$ \\* \\+ \\? \\. \\( \\) \\| ' +
			'\\{ \\} \\[ \\] \\| \\! \\:'
	);
});

test('regex() - Emoticons', function (assert) {
	assert.is(
		escape.regex('^^ >.< =)'),
		'\\^\\^ >\\.< \\=\\)'
	);
});


test('entities()', function (assert) {
	assert.true(escape.entities(null) === null);
	assert.true(escape.entities('') === '');

	assert.is(
		escape.entities('& < > " \'    `'),
		'&amp; &lt; &gt; &#34; &#39;&nbsp; &nbsp; &#96;'
	);

	assert.is(
		escape.entities('& < > " \'    `', false),
		'&amp; &lt; &gt; " \'&nbsp; &nbsp; `'
	);
});

test('entities() - XSS', function (assert) {
	assert.is(
		escape.entities('<script>alert("XSS");</script>'),
		'&lt;script&gt;alert(&#34;XSS&#34;);&lt;/script&gt;'
	);
});

test('entities() - IE XSS', function (assert) {
	assert.is(
		escape.entities('<img src="x" alt="``onerror=alert(1)" />'),
		'&lt;img src=&#34;x&#34; alt=&#34;&#96;&#96;onerror=alert(1)&#34; /&gt;'
	);
});

  const url = "http://dummy.com/";
global.window = {location: new URL(url)};

//~ Object.defineProperty(window, 'location', {
  //~ value: {
    //~ href: url,
    //~ protocol: 'http',
    //~ host: 'dummy.com',
    //~ pathname: '',
  //~ }
//~ });
  Object.defineProperty(window, "location", {
    value: new URL(url)
  } );

test('uriScheme() - No schmes', function (assert) {
	var urls = [
		'',
		'/test.html',
		'//localhost/test.html',
		'www.example.com/test?id=123'
	];
	for (var i = 0; i < urls.length; i++) {
		var url = urls[i];

		assert.is(escape.uriScheme(url), url);
	}
});

test('uriScheme() - Valid schmes', function (assert) {
	var urls = [
		'http://localhost',
		'https://example.com/test.html',
		'ftp://localhost',
		'sftp://example.com/test/',
		'mailto:user@localhost',
		'spotify:xyz',
		'skype:xyz',
		'ssh:user@host.com:22',
		'teamspeak:12345',
		'tel:12345',
		'//www.example.com/test?id=123',
		'data:image/png;test',
		'data:image/gif;test',
		'data:image/jpg;test',
		'data:image/bmp;test'
	];
	for (var i = 0; i < urls.length; i++) {
		var url = urls[i];
		assert.is(escape.uriScheme(url), url);
	}
});

test('uriScheme() - Invalid schmes', function (assert) {
	var path = window.location.pathname.split('/');
	path.pop();

	var baseUrl = window.location.protocol + '//' +
		window.location.host +
		path.join('/') + '/';

	var urls = [
		'javascript:alert("XSS");',
		'jav	ascript:alert(\'XSS\');',
		'vbscript:msgbox("XSS")',
		'data:application/javascript;alert("xss")'
	];
	for (var i = 0; i < urls.length; i++) {
		var url = urls[i];
		assert.is(escape.uriScheme(url), baseUrl + url);
	}
});
