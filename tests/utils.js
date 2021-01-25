import test from 'ava';
import * as utils from '../src/lib/utils.js';

test('isDigit()',t =>
{
	t.false(utils.isDigit('abcd'));
	t.false(utils.isDigit('123a'));
	t.true(utils.isDigit('1'));
	t.true(utils.isDigit('1234567890'));   // true
	t.false(utils.isDigit('-23'));
	t.true(utils.isDigit(1234));
	t.false(utils.isDigit('123.4'));
	t.false(utils.isDigit(''));
	t.false(utils.isDigit(undefined));
	t.false(utils.isDigit(null));
	t.true(utils.isDigit('123'));
	t.false(utils.isDigit('-123'));
	t.true(utils.isDigit(123));
	t.false(utils.isDigit(-123));
});

test('isEmptyObject()',t =>
{
	t.true(utils.isEmptyObject({}));
	t.true(utils.isEmptyObject([]));

	t.false(utils.isEmptyObject({ a: 'a' }));
	t.false(utils.isEmptyObject([1]));
});

test('extend()',t =>
{
	var target = {};
	var child = {};
	var childOverriden = {};
	var childArray = [1, 2, 3];
	var childArrayOverriden = [1];

	var result = utils.extend(target, {
		key: childOverriden,
		ignore: undefined,
		array: childArrayOverriden,
		prop: 'overriden',
		extra: '@'
	}, {
		key: child,
		array: childArray,
		prop: 'a'
	});

	t.true(result === target);
	t.true(result.key === child);
	t.true(result.array === childArray);

	t.deepEqual(result, {
		key: child,
		array: childArray,
		prop: 'a',
		extra: '@'
	});
});

test('extend() - Deep',t =>
{
	var target = {};
	var child = {};

	var result = utils.extend(true, target, {
		child: child,
		ignore: undefined,
		key: {
			prop: 'overriden',
			extra: 'a'
		},
		array: [1, 1, 1],
		prop: 'overriden',
		extra: 'a'
	}, {
		key: {
			prop: 'a'
		},
		array: [2, 3],
		prop: 'a'
	});

	t.true(result === target);
	t.false(result.child === child);

	t.deepEqual(result, {
		child: {},
		key: {
			prop: 'a',
			extra: 'a'
		},
		array: [2, 3, 1],
		prop: 'a',
		extra: 'a'
	});
});

test('arrayRemove()',t =>
{
	var array = [1, 2, 3, 3, 4, 5];

	utils.arrayRemove(array, 1);
	t.is(array.length, 5);

	utils.arrayRemove(array, 1);
	t.is(array.length, 5);

	utils.arrayRemove(array, 3);
	t.is(array.length, 4);
	t.is(array.indexOf(3), 1);
});

test('each() - Array',t =>
{
	var count = 0;
	var validValues = ['idx0', 'idx1', 'idx4', 'idx5'];
	var validKeys = [0, 1, 2, 3, 4];
	var array = ['idx0', 'idx1', 'idx4', 'idx5'];

	utils.each(array, function (index, value)
	{
		count++;
		t.true(value === validValues.shift());
		t.true(index === validKeys.shift());
	});

	t.is(count, 4);
});

test('each() - Object',t =>
{
	var count = 0;
	var validValues = ['idx0', 'idx1', 'idx4', 'idx5'];
	var validKeys = ['0', '1', '4', '5'];
	var object = {
		0: 'idx0',
		1: 'idx1',
		4: 'idx4',
		5: 'idx5'
	};

	utils.each(object, function (key, value)
	{
		count++;
		t.true(key === validKeys.shift());
		t.true(value === validValues.shift());
	});

	t.is(count, 4);
});

test('each() - Array like',t =>
{
	var count = 0;
	var validValues = ['idx0', 'idx1', undefined, undefined, 'idx4'];
	var validKeys = [0, 1, 2, 3, 4];
	var arrayLike = {
		length: 5,
		0: 'idx0',
		1: 'idx1',
		4: 'idx4',
		5: 'idx5'
	};

	utils.each(arrayLike, function (index, value)
	{
		count++;
		t.true(value === validValues.shift());
		t.true(index === validKeys.shift());
	});

	t.is(count, 5);
});

test('format()', t =>
{
	t.is(utils.format('str'), 'str');
	t.is(utils.format('str { 0 }'), 'str { 0 }');
	t.is(utils.format('str {0}'), 'str {0}');
	t.is(utils.format('str { 0 }', 'hi'), 'str { 0 }');
	t.is(utils.format('str {0}', 'hi'), 'str hi');
	t.is(utils.format('str {0} {1}', 'hi', 'lo'), 'str hi lo');
	t.is(utils.format('str {0} {1}', 4.5, 5), 'str 4.5 5');
});

test('replaceVars()', t =>
{
	t.is(utils.replaceVars('str'), 'str');
	t.is(utils.replaceVars('str', {}), 'str');
	t.is(utils.replaceVars('str { var0 }', {var0: 'hi'}), 'str hi');
	t.is(utils.replaceVars('str {var0}', {var1: 'hi'}), 'str {var0}');
	t.is(utils.replaceVars('str {var0} {var1}', {var0: 'hi',  var1: 'lo'}), 'str hi lo');
	t.is(utils.replaceVars('str {var0} {var1}', {var0: 4.5, var1: 5}), 'str 4.5 5');
});

test('toHex()', t =>
{
	t.is(utils.toHex('-1'), 'ffffffff');
	t.is(utils.toHex('0'), '0');
	t.is(utils.toHex('2'), '2');
	t.is(utils.toHex('20'), '14');
	t.is(utils.toHex('200'), 'c8');
	t.is(utils.toHex('201'), 'c9');
	t.is(utils.toHex('145000'), '23668');
	t.is(utils.toHex('90000000'), '55d4a80');
	t.is(utils.toHex('str'), '0');
});

test('normaliseColour()', t =>
{
	t.is(utils.normaliseColour('#000'), '#000000');
	t.is(utils.normaliseColour('rgb(0,0,0)'), '#000000');
	t.is(utils.normaliseColour('#03f'), '#0033ff');
	t.is(utils.normaliseColour('rgb(0, 51, 255)'), '#0033ff');
	t.is(utils.normaliseColour('rgb(77, 147, 188)'), '#4d93bc');
	t.is(utils.normaliseColour('rgb(255, 0, 0)'), '#ff0000');
	t.is(utils.normaliseColour('#8a5'), '#88aa55');
	t.is(utils.normaliseColour('red'), 'red');
});

test('stripQuotes()', t =>
{
	t.is(utils.stripQuotes('"Name"'), 'Name');
	t.is(utils.stripQuotes(' "John" '), ' "John" ');
	t.is(utils.stripQuotes('"Name": "John"'), 'Name": "John');
	t.is(utils.stripQuotes('Name": "John"'), 'Name": "John"');
	t.is(utils.stripQuotes('"Name": "John'), '"Name": "John');
	t.is(utils.stripQuotes('\'Name\''), 'Name');
	t.is(utils.stripQuotes(' \'John\' '), ' \'John\' ');
	t.is(utils.stripQuotes('\'Name\': \'John\''), 'Name\': \'John');
	t.is(utils.stripQuotes('Name\': \'John\''), 'Name\': \'John\'');
	t.is(utils.stripQuotes('\'Name\': \'John'), '\'Name\': \'John');
	t.is(utils.stripQuotes('"Name\''), '"Name\'');
	t.is(utils.stripQuotes('\'John"'), '\'John"');
	t.is(utils.stripQuotes('\'Name": "John\''), 'Name": "John');
	t.is(utils.stripQuotes('Name": "John\''), 'Name": "John\'');
	t.is(utils.stripQuotes('\'Name": "John'), '\'Name": "John');
	t.is(utils.stripQuotes('Name": "John'), 'Name": "John');
	t.is(utils.stripQuotes('\\k\\\e\\y\\"\\\'\\s'), 'key"\'s');
});
