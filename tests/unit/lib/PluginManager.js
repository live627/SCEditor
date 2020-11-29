import test from 'ava';
import sinon from 'sinon';
import PluginManager from '../../../src/lib/PluginManager.js';

var fakeEditor = {};
var fakePlugin;
var fakePluginTwo;
var pluginManager, sandbox;

test.beforeEach(() => {
	//~ sandbox = sinon.sandbox.create();
	fakePlugin    = function () {};
	fakePluginTwo = function () {};

	pluginManager = new PluginManager(fakeEditor);
	PluginManager.plugins.fakePlugin = fakePlugin;
	PluginManager.plugins.fakePluginTwo = fakePluginTwo;
});

//~ test.afterEach.always(() => {
    //~ sandbox.restore();
//~ });

test.serial('call()', function (assert) {
	var arg = {};
	var firstSpy = sinon.spy();
	var secondSpy = sinon.spy();

	fakePlugin.prototype.signalTest = firstSpy;
	fakePluginTwo.prototype.signalTest = secondSpy;

	pluginManager.register('fakePlugin');
	pluginManager.register('fakePluginTwo');

	pluginManager.call('test', arg);

	assert.true(firstSpy.calledOnce);
	assert.true(firstSpy.calledOn(fakeEditor));
	assert.true(firstSpy.calledWithExactly(arg));
	assert.true(secondSpy.calledOnce);
	assert.true(secondSpy.calledOn(fakeEditor));
	assert.true(secondSpy.calledWithExactly(arg));

	assert.true(firstSpy.calledBefore(secondSpy));
});

test.serial('callOnlyFirst()', function (assert) {
	var arg = {};

	var stub = sinon.stub();
	stub.returns(1);

	fakePlugin.prototype.signalTest = stub;
	fakePluginTwo.prototype.signalTest = sinon.spy();

	pluginManager.register('fakePlugin');
	pluginManager.register('fakePluginTwo');

	assert.truthy(pluginManager.callOnlyFirst('test', arg));

	assert.true(fakePlugin.prototype.signalTest.calledOnce);
	assert.true(fakePlugin.prototype.signalTest.calledOn(fakeEditor));
	assert.true(fakePlugin.prototype.signalTest.calledWithExactly(arg));
	assert.false(fakePluginTwo.prototype.signalTest.called);
});

test.serial('hasHandler()', function (assert) {
	fakePlugin.prototype.signalTest = sinon.spy();
	fakePluginTwo.prototype.signalTest = sinon.spy();
	fakePluginTwo.prototype.signalTestTwo = sinon.spy();

	pluginManager.register('fakePlugin');
	pluginManager.register('fakePluginTwo');

	assert.true(pluginManager.hasHandler('test'));
	assert.true(pluginManager.hasHandler('testTwo'));
});

test.serial('hasHandler() - No handler', function (assert) {
	fakePlugin.prototype.signalTest = sinon.spy();

	pluginManager.register('fakePlugin');

	assert.false(pluginManager.hasHandler('teSt'));
	assert.false(pluginManager.hasHandler('testTwo'));
});

test.serial('exists()', function (assert) {
	assert.true(pluginManager.exists('fakePlugin'));
	assert.false(pluginManager.exists('noPlugin'));
});

test.serial('isRegistered()', function (assert) {
	pluginManager.register('fakePlugin');

	assert.true(pluginManager.isRegistered('fakePlugin'));
	assert.false(pluginManager.isRegistered('fakePluginTwo'));
});

test.serial('register() - No plugin', function (assert) {
	assert.false(pluginManager.register('noPlugin'));
});

test.serial('register() - Call init', function (assert) {
	fakePlugin.prototype.init = sinon.spy();
	fakePluginTwo.prototype.init = sinon.spy();

	assert.true(pluginManager.register('fakePlugin'));

	assert.true(fakePlugin.prototype.init.calledOnce);
	assert.true(fakePlugin.prototype.init.calledOn(fakeEditor));
	assert.false(fakePluginTwo.prototype.init.called);
});

test.serial('register() - Called twice', function (assert) {
	fakePlugin.prototype.init = sinon.spy();

	assert.true(pluginManager.register('fakePlugin'));
	assert.false(pluginManager.register('fakePlugin'));

	assert.true(fakePlugin.prototype.init.calledOnce);
	assert.true(fakePlugin.prototype.init.calledOn(fakeEditor));
});

test.serial('deregister()', function (assert) {
	fakePlugin.prototype.destroy = sinon.spy();
	fakePluginTwo.prototype.destroy = sinon.spy();

	pluginManager.register('fakePlugin');
	pluginManager.register('fakePluginTwo');

	pluginManager.deregister('fakePlugin');

	assert.true(fakePlugin.prototype.destroy.calledOnce);
	assert.true(fakePlugin.prototype.destroy.calledOn(fakeEditor));
	assert.false(fakePluginTwo.prototype.destroy.calledOnce);
});

test.serial('deregister() - Called twice', function (assert) {
	fakePlugin.prototype.destroy = sinon.spy();
	fakePluginTwo.prototype.destroy = sinon.spy();

	pluginManager.register('fakePlugin');
	pluginManager.register('fakePluginTwo');

	pluginManager.deregister('fakePlugin');
	pluginManager.deregister('fakePlugin');

	assert.true(fakePlugin.prototype.destroy.calledOnce);
	assert.true(fakePlugin.prototype.destroy.calledOn(fakeEditor));
	assert.false(fakePluginTwo.prototype.destroy.calledOnce);
});

test.serial('destroy()', function (assert) {
	fakePlugin.prototype.destroy = sinon.spy();
	fakePluginTwo.prototype.destroy = sinon.spy();

	pluginManager.register('fakePlugin');
	pluginManager.register('fakePluginTwo');

	pluginManager.destroy();

	assert.true(fakePlugin.prototype.destroy.calledOnce);
	assert.true(fakePlugin.prototype.destroy.calledOn(fakeEditor));
	assert.true(fakePluginTwo.prototype.destroy.calledOnce);
	assert.true(fakePluginTwo.prototype.destroy.calledOn(fakeEditor));
});
