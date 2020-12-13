import test from 'ava';
import * as utils from '../src/lib/utils.js';

test('isEmptyObject()', function (assert) {
	assert.true(utils.isEmptyObject({}));
	assert.true(utils.isEmptyObject([]));

	assert.false(utils.isEmptyObject({ a: 'a' }));
	assert.false(utils.isEmptyObject([1]));
});

test('extend()', function (assert) {
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

	assert.true(result === target);
	assert.true(result.key === child);
	assert.true(result.array === childArray);

	assert.deepEqual(result, {
		key: child,
		array: childArray,
		prop: 'a',
		extra: '@'
	});
});

test('extend() - Deep', function (assert) {
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

	assert.true(result === target);
	assert.false(result.child === child);

	assert.deepEqual(result, {
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

test('arrayRemove()', function (assert) {
	var array = [1, 2, 3, 3, 4, 5];

	utils.arrayRemove(array, 1);
	assert.is(array.length, 5);

	utils.arrayRemove(array, 1);
	assert.is(array.length, 5);

	utils.arrayRemove(array, 3);
	assert.is(array.length, 4);
	assert.is(array.indexOf(3), 1);
});

test('each() - Array', function (assert) {
	var count = 0;
	var validValues = ['idx0', 'idx1', 'idx4', 'idx5'];
	var validKeys = [0, 1, 2, 3, 4];
	var array = ['idx0', 'idx1', 'idx4', 'idx5'];

	utils.each(array, function (index, value) {
		count++;
		assert.true(value === validValues.shift());
		assert.true(index === validKeys.shift());
	});

	assert.is(count, 4);
});

test('each() - Object', function (assert) {
	var count = 0;
	var validValues = ['idx0', 'idx1', 'idx4', 'idx5'];
	var validKeys = ['0', '1', '4', '5'];
	var object = {
		0: 'idx0',
		1: 'idx1',
		4: 'idx4',
		5: 'idx5'
	};

	utils.each(object, function (key, value) {
		count++;
		assert.true(key === validKeys.shift());
		assert.true(value === validValues.shift());
	});

	assert.is(count, 4);
});

test('each() - Array like', function (assert) {
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

	utils.each(arrayLike, function (index, value) {
		count++;
		assert.true(value === validValues.shift());
		assert.true(index === validKeys.shift());
	});

	assert.is(count, 5);
});

test('format()', assert => {
	assert.is(utils.format('str'), 'str');
	assert.is(utils.format('str { 0 }'), 'str { 0 }');
	assert.is(utils.format('str {0}'), 'str {0}');
	assert.is(utils.format('str { 0 }', 'hi'), 'str { 0 }');
	assert.is(utils.format('str {0}', 'hi'), 'str hi');
	assert.is(utils.format('str {0} {1}', 'hi', 'lo'), 'str hi lo');
	assert.is(utils.format('str {0} {1}', 4.5,  5), 'str 4.5 5');
});