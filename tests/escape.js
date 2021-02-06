import test from 'ava';
import * as escape from '../src/lib/escape.js';

test('regex()',t =>
{
	t.is(
		escape.regex('- \\ ^ / $ * + ? . ( ) | { } [ ] | ! :'),
		'\\- \\\\ \\^ \\/ \\$ \\* \\+ \\? \\. \\( \\) \\| ' +
			'\\{ \\} \\[ \\] \\| \\! \\:'
	);
});

test('regex() - Emoticons',t =>
{
	t.is(
		escape.regex('^^ >.< =)'),
		'\\^\\^ >\\.< \\=\\)'
	);
});

test('entities()',t =>
{
	t.true(escape.entities(null) === null);
	t.true(escape.entities('') === '');

	t.is(
		escape.entities('& < > " \'    `'),
		'&amp; &lt; &gt; &#34; &#39;&nbsp; &nbsp; &#96;'
	);
	t.is(
		escape.entities('http://www.example.com/?a=1&b=2&amp;c=3/'),
		'http://www.example.com/?a=1&amp;b=2&amp;c=3/'
	);
	t.is(
		escape.entities('&lt; is <), &gt; is >), &apos; is \'), etc.'),
		'&lt; is &lt;), &gt; is &gt;), &apos; is &#39;), etc.'
	);
	t.is(
		escape.entities('it will handle numeric escapes, e.g. &#160; – neat.'),
		'it will handle numeric escapes, e.g. &#160; – neat.'
	);
	t.is(
		escape.entities('& < > " \'    `', false),
		'&amp; &lt; &gt; " \'&nbsp; &nbsp; `'
	);
});

test('entities() - XSS',t =>
{
	t.is(
		escape.entities('<script>alert("XSS");</script>'),
		'&lt;script&gt;alert(&#34;XSS&#34;);&lt;/script&gt;'
	);
});

test('entities() - IE XSS',t =>
{
	t.is(
		escape.entities('<img src="x" alt="``onerror=alert(1)" />'),
		'&lt;img src=&#34;x&#34; alt=&#34;&#96;&#96;onerror=alert(1)&#34; /&gt;'
	);
});

const url = 'http://dummy.com/';
global.window = {location: new URL(url)};

test('uriScheme() - No schmes',t =>
{
	var urls = [
		'',
		'/test.html',
		'//localhost/test.html',
		'www.example.com/test?id=123'
	];
	for (var i = 0; i < urls.length; i++)
	{
		var url = urls[i];

		t.is(escape.uriScheme(url), url);
	}
});

test('uriScheme() - Valid schmes',t =>
{
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
	for (var i = 0; i < urls.length; i++)
	{
		var url = urls[i];
		t.is(escape.uriScheme(url), url);
	}
});

test('uriScheme() - Invalid schmes',t =>
{
	var path = window.location.pathname.split('/');
	path.pop();

	var baseUrl = window.location.protocol + '//' +
		window.location.host +
		path.join('/') + '/';

	var urls = [
		// eslint-disable-next-line
		'javascript:alert("XSS");',
		'jav	ascript:alert(\'XSS\');',
		'vbscript:msgbox("XSS")',
		'data:application/javascript;alert("xss")'
	];
	for (var i = 0; i < urls.length; i++)
	{
		var url = urls[i];
		t.is(escape.uriScheme(url), baseUrl + url);
	}
});
