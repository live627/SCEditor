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
		'[youtube]xyz[/youtube]\n'
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

test('getTime', t =>
{
	var match = x => x.match(/()(?:(?:(\d+)h)?(\d+)m?(\d+)s|([0-9]+))/);

	t.is(0, youtube.getTime(match('0')));
	t.is(0, youtube.getTime(match('00s')));
	t.is(0, youtube.getTime(match('0s')));
	t.is(1, youtube.getTime(match('01')));
	t.is(1, youtube.getTime(match('01s')));
	t.is(1, youtube.getTime(match('1s')));
	t.is(599, youtube.getTime(match('9m59s')));
	t.is(600, youtube.getTime(match('10m00s')));
	t.is(3600, youtube.getTime(match('3600')));
	t.is(360009, youtube.getTime(match('100h09s')));
});

test('formatSeconds', t =>
{
	t.is('0:00:00', youtube.formatSeconds(0));
	t.is('0:00:01', youtube.formatSeconds(1));
	t.is('0:09:59', youtube.formatSeconds(599));
	t.is('0:10:00', youtube.formatSeconds(600));
	t.is('0:16:00', youtube.formatSeconds(960));
	t.is('1:00:00', youtube.formatSeconds(3600));
	t.is('25:21:00', youtube.formatSeconds(91260));
	t.is('100:00:09', youtube.formatSeconds(360009));
	t.is('0:00:.2', youtube.formatSeconds(0.2));
});
