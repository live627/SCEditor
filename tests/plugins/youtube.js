import test from 'ava';
import browserEnv from 'browser-env';
browserEnv();
import BBCode from '../../src/formats/bbcode.js';
import Plugin from '../../src/plugins/youtube.js';
var youtube = new Plugin;
var parser = new BBCode;
parser.set('youtube', youtube.getFormat());
parser.buildBbcodeCache();

test('toHtml', t =>
{
	t.is(
		parser.toHtml('[youtube]xyz[/youtube]'),
		'<div data-youtube-id="xyz" data-youtube-start="0"><iframe ' +
			'src="https://www.youtube.com/embed/xyz?start=0&wmode=opaque"></iframe></div>'
	);
});

test('toHtml with time', t =>
{
	t.is(
		parser.toHtml('[youtube=123]xyz[/youtube]'),
		'<div data-youtube-id="xyz" data-youtube-start="123"><iframe ' +
			'src="https://www.youtube.com/embed/xyz?start=123&wmode=opaque"></iframe></div>'
	);
});

test('toSource', t =>
{
	t.is(
		parser.toSource('<div data-youtube-id="xyz" data-youtube-start="0"><iframe ' +
			'src="https://www.youtube.com/embed/xyz?start=0&wmode=opaque"></iframe></div>'),
		'[youtube]xyz[/youtube]\\n'
	);
});

test('toSource with time', t =>
{
	t.is(
		parser.toSource('<div data-youtube-id="xyz" data-youtube-start="123"><iframe ' +
			'src="https://www.youtube.com/embed/xyz?start=123&wmode=opaque"></iframe></div>'),
		'[youtube=123]xyz[/youtube]\n'
	);
});

test('matchURL', t =>
{
	// Data from https://regex101.com/r/v3AbFi/3
	var urls = [
		'https://www.youtube.com/watch?v=DFYRQ_zQ-gk&feature=featured',
		'https://www.youtube.com/watch?v=DFYRQ_zQ-gk',
		'http://www.youtube.com/watch?v=DFYRQ_zQ-gk',
		'//www.youtube.com/watch?v=DFYRQ_zQ-gk',
		'www.youtube.com/watch?v=DFYRQ_zQ-gk',
		'https://youtube.com/watch?v=DFYRQ_zQ-gk',
		'http://youtube.com/watch?v=DFYRQ_zQ-gk',
		'//youtube.com/watch?v=DFYRQ_zQ-gk',
		'youtube.com/watch?v=DFYRQ_zQ-gk',
		'https://m.youtube.com/watch?v=DFYRQ_zQ-gk',
		'http://m.youtube.com/watch?v=DFYRQ_zQ-gk',
		'//m.youtube.com/watch?v=DFYRQ_zQ-gk',
		'm.youtube.com/watch?v=DFYRQ_zQ-gk',
		'https://www.youtube.com/v/DFYRQ_zQ-gk?fs=1&hl=en_US&t=150h20m31s',
		'http://www.youtube.com/v/DFYRQ_zQ-gk?fs=1&hl=en_US&t=20m31s',
		'//www.youtube.com/v/DFYRQ_zQ-gk?fs=1&hl=en_US&t=1231',
		'www.youtube.com/v/DFYRQ_zQ-gk?fs=1&hl=en_US',
		'youtube.com/v/DFYRQ_zQ-gk?fs=1&hl=en_US',
		'https://www.youtube.com/embed/DFYRQ_zQ-gk?autoplay=1',
		'https://www.youtube.com/embed/DFYRQ_zQ-gk',
		'http://www.youtube.com/embed/DFYRQ_zQ-gk',
		'//www.youtube.com/embed/DFYRQ_zQ-gk',
		'www.youtube.com/embed/DFYRQ_zQ-gk',
		'https://youtube.com/embed/DFYRQ_zQ-gk',
		'http://youtube.com/embed/DFYRQ_zQ-gk',
		'//youtube.com/embed/DFYRQ_zQ-gk',
		'youtube.com/embed/DFYRQ_zQ-gk',
		'https://youtu.be/DFYRQ_zQ-gk?t=120',
		'https://youtu.be/DFYRQ_zQ-gk',
		'http://youtu.be/DFYRQ_zQ-gk',
		'//youtu.be/DFYRQ_zQ-gk',
		'youtu.be/DFYRQ_zQ-gk'
	];
	for (let url of urls)
		t.true(youtube.matchURL(url).length > 1);

	t.is(541231, youtube.getTime(youtube.matchURL(urls[13])));
	t.is(1231, youtube.getTime(youtube.matchURL(urls[14])));
	t.is(1231, youtube.getTime(youtube.matchURL(urls[15])));
	t.is(120, youtube.getTime(youtube.matchURL(urls[27])));
	t.is(0, youtube.getTime(youtube.matchURL(urls[30])));
});
